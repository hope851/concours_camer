"use client";

import Image, { ImageProps } from "next/image";

export default function CloudinaryImage(props: ImageProps) {
    // On définit le loader à l'intérieur ou on l'utilise sans l'exporter
    const cloudinaryLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
        // Sécurisation de l'extraction du Public ID
        const parts = src.split('/upload/');
        const publicId = parts.length > 1 ? parts[1] : src;

        const params = [
            `w_${width}`,
            `q_${quality || 'auto'}`,
            'f_auto',
            'c_limit'
        ].join(',');

        // CORRECTION ICI : Ajout des slashs et du Cloud Name
        // Remplace 'demo' par ton vrai cloud name Cloudinary
        return `https://res.cloudinary.com/demo/image/upload/${params}/${publicId}`;
    };

    return (
        <Image
            {...props}
            loader={cloudinaryLoader}
        />
    );
}
