"use server";

import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";

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
      data: { nom, email, password: hashedPassword, role: "USER" },
    });

    const cookieStore = await cookies();
    cookieStore.set('userId', newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    revalidatePath("/profile");
    return { success: true, userId: newUser.id, message: "Inscription réussie ! Bienvenue sur Concours-Camer." };
  } catch (error) {
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
    cookieStore.set('userId', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    revalidatePath("/");
    return { success: true, userId: user.id, message: "Connexion réussie ! Heureux de vous revoir." };
  } catch (error) {
    return { error: "Une erreur technique est survenue" };
  }
}

export async function LogoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('userId');
  revalidatePath("/");
  return { success: true };
}

export async function GetCurrentUser() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    if (!userId) return null;

    return await prisma.users.findUnique({
      where: { id: userId },
      select: { id: true, email: true, nom: true, role: true, isActive: true, date_inscription: true }
    });
  } catch (error) {
    return null;
  }
}

// --- NOUVELLES FONCTIONS (ADMINISTRATION) ---

export async function GetAllUsers() {
  const admin = await GetCurrentUser();
  if (!admin || admin.role !== 'ADMIN') return [];

  return await prisma.users.findMany({
    orderBy: { date_inscription: 'desc' },
    select: { id: true, nom: true, email: true, role: true, isActive: true, date_inscription: true }
  });
}

export async function UpdateUserStatus(userId: string, status: boolean) {
  const admin = await GetCurrentUser();
  if (!admin || admin.role !== 'ADMIN') return { error: "Non autorisé" };

  await prisma.users.update({ where: { id: userId }, data: { isActive: status } });
  revalidatePath("/profile/utilisateur");
  return { success: true };
}

export async function UpdateUserRole(userId: string, role: Role) { // <--- Utilise Role ici
  const admin = await GetCurrentUser();
  if (!admin || admin.role !== 'ADMIN') return { error: "Non autorisé" };

  await prisma.users.update({
    where: { id: userId },
    data: { role }
  });
  revalidatePath("/profile/admin"); // Mets le bon chemin ici
  return { success: true };
}

export async function GetMyEES() {
  try {
    // 1. Récupérer l'ID de l'utilisateur depuis les cookies via ta fonction existante
    const user = await GetCurrentUser();

    if (!user) {
      console.error("Utilisateur non connecté");
      return [];
    }

    // 2. Chercher la tutelle associée à cet utilisateur
    // On suppose que dans ton schéma Prisma, l'utilisateur a un champ 'tutelle_id'
    const userWithTutelle = await prisma.users.findUnique({
      where: { id: user.id },
      select: { eesId: true }
    });

    if (!userWithTutelle?.eesId) {
      console.warn("Cet utilisateur n'est rattaché à aucune EES.");
      return [];
    }

    // 3. Récupérer les EES liées à cette tutelle
    const ees = await prisma.eES.findMany({
      where: {
        id: userWithTutelle.eesId
      },
      include: {
        _count: {
          select: { concours: true, filieres: true }
        }
      },
      orderBy: {
        nom_ees: 'asc'
      }
    });

    return ees;
  } catch (error) {
    console.error("Erreur GetMyEES:", error);
    return [];
  }
}

