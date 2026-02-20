"use server";

import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function RegisterUser(formData: FormData) {
    try {
        const nom = formData.get("nom") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!nom || !email || !password) {
           return{error:"Tous les champs sont requis"};
        }

        // Vérifier si l'email existe déjà
        const existingUser = await prisma.users.findUnique({
            where: { email }
        });

        if (existingUser) {
            return{error:"Cet email est déjà utilisé"};
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.users.create({
            data: {
                nom,
                email,
                password: hashedPassword,
                role: "USER",
            },
        });

        revalidatePath("/utilisateur");
        console.log("Utilisateur créé avec succès:", newUser.id);
        return{success: true, message: "Utilisateur créé avec succès", userId: newUser.id};

        return { success: true, message: "Utilisateur créé avec succès", userId: newUser.id };
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur:", error);
         return{error:"Une erreur technique est survenue"};
    }
}