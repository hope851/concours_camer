"use server";

import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";
import { randomUUID } from "crypto";

// --- FONCTIONS EXISTANTES (AUTHENTIFICATION) ---

export async function RegisterUser(formData: FormData) {
  try {
    const nom = formData.get("nom") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!nom || !email || !password) return { error: "Tous les champs sont requis" };
    if (password.length < 6) return { error: "Le mot de passe doit contenir au moins 6 caractères" };

    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) return { error: "Cet email est déjà utilisé" };

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.users.create({
      data: {
        id: randomUUID(),
        nom,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    const cookieStore = await cookies();
    cookieStore.set("userId", newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    revalidatePath("/profile");
    return { success: true, userId: newUser.id, message: "Inscription réussie ! Bienvenue sur Concours-Camer." };
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.includes("ECONNREFUSED") || message.includes("Can't reach database") || message.includes("database") && message.includes("connect")) {
      return { error: "La base de données n'est pas disponible. Vérifiez PostgreSQL et la variable DATABASE_URL." };
    }
    return { error: "Une erreur technique est survenue" };
  }
}

export async function LoginUser(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) return { error: "Email ou mot de passe incorrect" };

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return { error: "Email ou mot de passe incorrect" };
    if (!user.isActive) return { error: "Ce compte a été désactivé" };

    const cookieStore = await cookies();
    cookieStore.set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    revalidatePath("/");
    return { success: true, userId: user.id, message: "Connexion réussie ! Heureux de vous revoir." };
  } catch (error) {
    return { error: "Une erreur technique est survenue" };
  }
}

export async function LogoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
  revalidatePath("/");
  return { success: true };
}

export async function GetCurrentUser() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    if (!userId) return null;

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nom: true,
        role: true,
        isActive: true,
        dateInscription: true,
        ees: { select: { id: true, nomEes: true }, take: 1 },
      },
    });

    if (!user) return null;

    return {
      ...user,
      eesId: user.ees[0]?.id ?? null,
    };
  } catch (error) {
    return null;
  }
}

// --- NOUVELLES FONCTIONS (ADMINISTRATION) ---

export async function GetAllUsers() {
  const admin = await GetCurrentUser();
  if (!admin || admin.role !== "ADMIN") return [];

  const users = await prisma.users.findMany({
    orderBy: { dateInscription: "desc" },
    select: {
      id: true,
      nom: true,
      email: true,
      role: true,
      isActive: true,
      dateInscription: true,
      ees: { select: { id: true, nomEes: true }, take: 1 },
    },
  });

  return users.map((user) => ({
    ...user,
    eesId: user.ees[0]?.id ?? null,
  }));
}

export async function UpdateUserStatus(userId: string, status: boolean) {
  const admin = await GetCurrentUser();
  if (!admin || admin.role !== "ADMIN") return { error: "Non autorisé" };

  await prisma.users.update({ where: { id: userId }, data: { isActive: status } });
  revalidatePath("/profile/utilisateur");
  return { success: true };
}

export async function UpdateUserRole(userId: string, role: Role) {
  const admin = await GetCurrentUser();
  if (!admin || admin.role !== "ADMIN") return { error: "Non autorisé" };

  await prisma.users.update({
    where: { id: userId },
    data: { role },
  });
  revalidatePath("/profile/admin");
  return { success: true };
}

export async function GetMyEES() {
  try {
    const user = await GetCurrentUser();
    if (!user) return [];

    const userWithEes = await prisma.users.findUnique({
      where: { id: user.id },
      include: {
        ees: {
          include: {
            tutelleInstitutionelle: true,
            ville: true,
            _count: { select: { sessionAdmission: true, programme: true } },
          },
          orderBy: { nomEes: "asc" },
        },
      },
    });

    return userWithEes?.ees ?? [];
  } catch (error) {
    console.error("Erreur GetMyEES:", error);
    return [];
  }
}

// --- PROFILE MANAGEMENT ---

export async function UpdateUserProfile(formData: FormData) {
  try {
    const user = await GetCurrentUser();
    if (!user) return { error: "Non connecté" };

    const nom = formData.get("nom") as string;
    const email = formData.get("email") as string;

    if (!nom || !email) return { error: "Nom et email requis" };

    if (email !== user.email) {
      const existing = await prisma.users.findUnique({ where: { email } });
      if (existing) return { error: "Cet email est déjà utilisé" };
    }

    await prisma.users.update({
      where: { id: user.id },
      data: { nom, email },
    });

    revalidatePath("/profile");
    return { success: true, message: "Profil mis à jour avec succès" };
  } catch (error) {
    return { error: "Erreur lors de la mise à jour" };
  }
}

export async function ChangePassword(formData: FormData) {
  try {
    const user = await GetCurrentUser();
    if (!user) return { error: "Non connecté" };

    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return { error: "Tous les champs sont requis" };
    }

    if (newPassword !== confirmPassword) {
      return { error: "Les mots de passe ne correspondent pas" };
    }

    if (newPassword.length < 6) {
      return { error: "Le nouveau mot de passe doit faire au moins 6 caractères" };
    }

    const dbUser = await prisma.users.findUnique({ where: { id: user.id } });
    if (!dbUser) return { error: "Utilisateur introuvable" };

    const isMatch = await bcrypt.compare(oldPassword, dbUser.password);
    if (!isMatch) return { error: "Ancien mot de passe incorrect" };

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.users.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { success: true, message: "Mot de passe modifié avec succès" };
  } catch (error) {
    return { error: "Erreur technique" };
  }
}

export async function GetSystemStats() {
  try {
    const user = await GetCurrentUser();
    if (!user || user.role !== "ADMIN") return null;

    const [userCount, newsCount, concoursCount, eesCount] = await Promise.all([
      prisma.users.count(),
      prisma.news.count(),
      prisma.sessionAdmission.count(),
      prisma.ees.count(),
    ]);

    return { userCount, newsCount, concoursCount, eesCount };
  } catch (error) {
    return null;
  }
}

export async function GetAllEes() {
  const admin = await GetCurrentUser();
  if (!admin || admin.role !== "ADMIN") return [];

  return await prisma.ees.findMany({
    orderBy: { nomEes: "asc" },
    select: { id: true, nomEes: true },
  });
}

export async function GetAllSubscriptions() {
  const admin = await GetCurrentUser();
  if (!admin || admin.role !== "ADMIN") return null;

  const [ees, tutelles, programmes] = await Promise.all([
    prisma.followEes.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, nom: true, email: true } },
        ees: { select: { id: true, nomEes: true } },
      },
    }),
    prisma.followTutelle.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, nom: true, email: true } },
        tutelle: { select: { id: true, nomTutelle: true } },
      },
    }),
    prisma.followProgramme.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, nom: true, email: true } },
        programme: {
          select: {
            id: true,
            nomProgramme: true,
            niveau: true,
            ees: { select: { id: true, nomEes: true } },
          },
        },
      },
    }),
  ]);

  return { ees, tutelles, programmes };
}

export async function DeleteAdminSubscription(type: "ees" | "tutelle" | "programme", id: string) {
  const admin = await GetCurrentUser();
  if (!admin || admin.role !== "ADMIN") return { error: "Non autorisé" };

  try {
    if (type === "ees") {
      await prisma.followEes.delete({ where: { id } });
    } else if (type === "tutelle") {
      await prisma.followTutelle.delete({ where: { id } });
    } else {
      await prisma.followProgramme.delete({ where: { id } });
    }

    revalidatePath("/profile/admin");
    return { success: true };
  } catch (error) {
    console.error("Erreur DeleteAdminSubscription:", error);
    return { error: "Impossible de supprimer cet abonnement." };
  }
}

export async function AssignEesToUser(userId: string, eesId: string | null) {
  const admin = await GetCurrentUser();
  if (!admin || admin.role !== "ADMIN") return { error: "Non autorisé" };

  await prisma.users.update({
    where: { id: userId },
    data: {
      ees: eesId ? { set: [{ id: eesId }] } : { set: [] },
    },
  });

  revalidatePath("/profile/admin");
  return { success: true };
}

// --- SUIVIS UTILISATEUR ---

export async function GetUserFollows() {
  const user = await GetCurrentUser();
  if (!user) return null;

  const [ees, tutelles, programmes] = await Promise.all([
    prisma.followEes.findMany({
      where: { userId: user.id },
      include: { ees: { select: { id: true, nomEes: true, domaine: true, ville: { select: { nomVille: true } } } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.followTutelle.findMany({
      where: { userId: user.id },
      include: { tutelle: { select: { id: true, nomTutelle: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.followProgramme.findMany({
      where: { userId: user.id },
      include: {
        programme: {
          select: {
            id: true,
            nomProgramme: true,
            niveau: true,
            ees: { select: { id: true, nomEes: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { ees, tutelles, programmes };
}

export async function ToggleFollowEes(eesId: string) {
  const user = await GetCurrentUser();
  if (!user) return { error: "Non connecté" };

  const existing = await prisma.followEes.findUnique({
    where: { userId_eesId: { userId: user.id, eesId } },
  });

  if (existing) {
    await prisma.followEes.delete({ where: { id: existing.id } });
  } else {
    await prisma.followEes.create({
      data: { id: randomUUID(), userId: user.id, eesId },
    });
  }

  revalidatePath("/profile/utilisateur");
  revalidatePath(`/explore/${eesId}`);
  return { success: true };
}

export async function ToggleFollowTutelle(tutelleId: string) {
  const user = await GetCurrentUser();
  if (!user) return { error: "Non connecté" };

  const existing = await prisma.followTutelle.findUnique({
    where: { userId_tutelleId: { userId: user.id, tutelleId } },
  });

  if (existing) {
    await prisma.followTutelle.delete({ where: { id: existing.id } });
  } else {
    await prisma.followTutelle.create({
      data: { id: randomUUID(), userId: user.id, tutelleId },
    });
  }

  revalidatePath("/profile/utilisateur");
  revalidatePath(`/tutelles/${tutelleId}`);
  return { success: true };
}

export async function ToggleFollowProgramme(programmeId: string) {
  const user = await GetCurrentUser();
  if (!user) return { error: "Non connecté" };

  const existing = await prisma.followProgramme.findUnique({
    where: { userId_programmeId: { userId: user.id, programmeId } },
  });

  if (existing) {
    await prisma.followProgramme.delete({ where: { id: existing.id } });
  } else {
    await prisma.followProgramme.create({
      data: { id: randomUUID(), userId: user.id, programmeId },
    });
  }

  revalidatePath("/profile/utilisateur");
  return { success: true };
}

export async function IsFollowingEes(eesId: string) {
  const user = await GetCurrentUser();
  if (!user) return false;

  const follow = await prisma.followEes.findUnique({
    where: { userId_eesId: { userId: user.id, eesId } },
  });
  return !!follow;
}
