"use server";

import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";
import { randomUUID } from "crypto";
import { signSessionToken, verifySessionToken } from "@/lib/session";

// --- FONCTIONS EXISTANTES (AUTHENTIFICATION) ---

export async function RegisterUser(formData: FormData) {
  try {
    const nom = (formData.get("nom") as string)?.trim();
    const email = (formData.get("email") as string)?.trim().toLowerCase();
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
        role: "USER", // Rôle toujours fixé à USER à l'inscription
      },
    });

    const cookieStore = await cookies();
    cookieStore.set("userId", signSessionToken(newUser.id), {
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
    if (message.includes("ECONNREFUSED") || message.includes("Can't reach database") || (message.includes("database") && message.includes("connect"))) {
      return { error: "La base de données n'est pas disponible. Vérifiez PostgreSQL et la variable DATABASE_URL." };
    }
    return { error: "Une erreur technique est survenue" };
  }
}

export async function LoginUser(formData: FormData) {
  try {
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const password = formData.get("password") as string;

    if (!email || !password) return { error: "Email et mot de passe requis" };

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) return { error: "Email ou mot de passe incorrect" };

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return { error: "Email ou mot de passe incorrect" };
    if (!user.isActive) return { error: "Ce compte a été désactivé" };

    const cookieStore = await cookies();
    cookieStore.set("userId", signSessionToken(user.id), {
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
    const token = cookieStore.get("userId")?.value;
    const userId = verifySessionToken(token);
    
    // Si pas de session valide ou signature altérée, refuser et purger le cookie
    if (!userId) {
      if (token) {
        cookieStore.delete("userId");
      }
      return null;
    }

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

    // Si utilisateur introuvable ou compte révoqué, rejeter l'accès
    if (!user || !user.isActive) {
      cookieStore.delete("userId");
      return null;
    }

    return {
      ...user,
      eesId: user.ees[0]?.id ?? null,
    };
  } catch (error) {
    return null;
  }
}

// --- FONCTIONS D'ADMINISTRATION ---

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
  if (!admin || admin.role !== "ADMIN") return { error: "Action non autorisée" };

  // Empêcher l'administrateur de désactiver son propre compte
  if (userId === admin.id) {
    return { error: "Vous ne pouvez pas désactiver votre propre compte administrateur." };
  }

  await prisma.users.update({ where: { id: userId }, data: { isActive: status } });
  revalidatePath("/profile/utilisateur");
  revalidatePath("/profile/admin");
  return { success: true };
}

export async function UpdateUserRole(userId: string, role: Role) {
  const admin = await GetCurrentUser();
  if (!admin || admin.role !== "ADMIN") return { error: "Action non autorisée" };

  // Empêcher l'administrateur de modifier son propre rôle pour éviter de perdre les accès admin
  if (userId === admin.id) {
    return { error: "Vous ne pouvez pas modifier votre propre rôle administrateur." };
  }

  const validRoles: Role[] = ["ADMIN", "GESTIONAIRE", "USER"];
  if (!validRoles.includes(role)) {
    return { error: "Rôle invalide" };
  }

  await prisma.users.update({
    where: { id: userId },
    data: { role },
  });
  revalidatePath("/profile/admin");
  return { success: true };
}

export async function AssignEesToUser(userId: string, eesId: string | null) {
  const admin = await GetCurrentUser();
  if (!admin || admin.role !== "ADMIN") return { error: "Action non autorisée" };

  await prisma.users.update({
    where: { id: userId },
    data: {
      ees: eesId ? { set: [{ id: eesId }] } : { set: [] },
    },
  });

  revalidatePath("/profile/admin");
  return { success: true };
}

/**
 * Modification administrative du profil d'un utilisateur (Seul l'ADMIN peut modifier le compte d'un autre)
 */
export async function AdminUpdateUserProfile(userId: string, formData: FormData) {
  try {
    const admin = await GetCurrentUser();
    if (!admin || admin.role !== "ADMIN") return { error: "Action réservée à l'administrateur." };

    const nom = (formData.get("nom") as string)?.trim();
    const email = (formData.get("email") as string)?.trim().toLowerCase();

    if (!nom || !email) return { error: "Nom et email requis" };

    const existingTarget = await prisma.users.findUnique({ where: { id: userId } });
    if (!existingTarget) return { error: "Utilisateur introuvable" };

    if (email !== existingTarget.email) {
      const duplicate = await prisma.users.findUnique({ where: { email } });
      if (duplicate) return { error: "Cet email est déjà utilisé par un autre compte" };
    }

    await prisma.users.update({
      where: { id: userId },
      data: { nom, email },
    });

    revalidatePath("/profile/admin");
    return { success: true, message: "Compte utilisateur mis à jour par l'administrateur." };
  } catch (error) {
    return { error: "Erreur lors de la mise à jour par l'administrateur." };
  }
}

/**
 * Réinitialisation administrative du mot de passe (Seul l'ADMIN peut réinitialiser le mot de passe d'un autre utilisateur)
 */
export async function AdminResetUserPassword(userId: string, newPassword: string) {
  try {
    const admin = await GetCurrentUser();
    if (!admin || admin.role !== "ADMIN") return { error: "Action réservée à l'administrateur." };

    if (!newPassword || newPassword.length < 6) {
      return { error: "Le mot de passe doit comporter au moins 6 caractères" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.users.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true, message: "Mot de passe réinitialisé avec succès par l'administrateur." };
  } catch (error) {
    return { error: "Erreur lors de la réinitialisation du mot de passe." };
  }
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

// --- GESTION DU PROFIL (RÈGLES DE SÉCURITÉ STRICTES) ---

/**
 * Mise à jour de profil par l'utilisateur connecté :
 * - Un utilisateur non-admin NE PEUT PAS modifier son email (information sensible), ni son rôle, ni son statut, ni son EES.
 * - Seul l'administrateur a le droit de modifier les informations sensibles d'un compte.
 */
export async function UpdateUserProfile(formData: FormData) {
  try {
    const user = await GetCurrentUser();
    if (!user) return { error: "Non connecté" };

    const nom = (formData.get("nom") as string)?.trim();
    const requestedEmail = (formData.get("email") as string)?.trim().toLowerCase();

    if (!nom) return { error: "Le nom est requis" };

    // VÉRIFICATION DE SÉCURITÉ :
    // Un utilisateur autre que l'admin ne peut PAS modifier l'adresse email de son compte
    if (user.role !== "ADMIN") {
      if (requestedEmail && requestedEmail !== user.email) {
        return { error: "Seul un administrateur est autorisé à modifier l'adresse email (information sensible du compte)." };
      }

      // Mise à jour uniquement du nom (information personnelle non sensible)
      await prisma.users.update({
        where: { id: user.id },
        data: { nom },
      });

      revalidatePath("/profile");
      revalidatePath("/profile/utilisateur");
      return { success: true, message: "Profil mis à jour avec succès" };
    }

    // Si l'utilisateur est ADMIN, il peut modifier son nom et son email
    if (!requestedEmail) return { error: "L'adresse email est requise pour l'administrateur." };

    if (requestedEmail !== user.email) {
      const existing = await prisma.users.findUnique({ where: { email: requestedEmail } });
      if (existing) return { error: "Cet email est déjà utilisé" };
    }

    await prisma.users.update({
      where: { id: user.id },
      data: { nom, email: requestedEmail },
    });

    revalidatePath("/profile");
    revalidatePath("/profile/utilisateur");
    return { success: true, message: "Profil administrateur mis à jour avec succès" };
  } catch (error) {
    return { error: "Erreur lors de la mise à jour" };
  }
}

/**
 * Modification de mot de passe par l'utilisateur :
 * - L'utilisateur ne peut modifier QUE son propre mot de passe (lié à sa session vérifiée).
 * - Vérification stricte de l'ancien mot de passe.
 * - Un utilisateur ne peut JAMAIS modifier le mot de passe d'un autre compte via cette action.
 */
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

    // Recherche de l'utilisateur basé UNIQUEMENT sur la session vérifiée
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
  if (!admin || admin.role !== "ADMIN") return { error: "Action non autorisée" };

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

// --- SUIVIS UTILISATEUR (AUTHENTIFIÉ SUR SON PROPRE COMPTE) ---

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

export async function AdminDeleteUser(userId: string) {
  const admin = await GetCurrentUser();
  if (!admin || admin.role !== "ADMIN") return { error: "Action non autorisée" };

  if (userId === admin.id) {
    return { error: "Vous ne pouvez pas supprimer votre propre compte administrateur." };
  }

  try {
    await prisma.users.delete({ where: { id: userId } });
    revalidatePath("/profile/admin");
    return { success: true, message: "Compte utilisateur supprimé avec succès." };
  } catch (error) {
    console.error("Erreur AdminDeleteUser:", error);
    return { error: "Impossible de supprimer cet utilisateur." };
  }
}

export async function UnfollowEes(eesId: string) {
  const user = await GetCurrentUser();
  if (!user) return { error: "Non connecté" };

  try {
    await prisma.followEes.deleteMany({
      where: { userId: user.id, eesId },
    });
    revalidatePath("/profile/utilisateur");
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    return { error: "Erreur lors du désabonnement." };
  }
}

export async function UnfollowTutelle(tutelleId: string) {
  const user = await GetCurrentUser();
  if (!user) return { error: "Non connecté" };

  try {
    await prisma.followTutelle.deleteMany({
      where: { userId: user.id, tutelleId },
    });
    revalidatePath("/profile/utilisateur");
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    return { error: "Erreur lors du désabonnement." };
  }
}

export async function UnfollowProgramme(programmeId: string) {
  const user = await GetCurrentUser();
  if (!user) return { error: "Non connecté" };

  try {
    await prisma.followProgramme.deleteMany({
      where: { userId: user.id, programmeId },
    });
    revalidatePath("/profile/utilisateur");
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    return { error: "Erreur lors du désabonnement." };
  }
}

export async function IsFollowingEes(eesId: string) {
  const user = await GetCurrentUser();
  if (!user) return false;

  const follow = await prisma.followEes.findUnique({
    where: { userId_eesId: { userId: user.id, eesId } },
  });
  return !!follow;
}

