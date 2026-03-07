// Version JavaScript (sans : ImageLoaderProps)
const cloudinaryLoader = ({ src, width, quality }) => {
    // On extrait l'identifiant de l'image
    const parts = src.split('/upload/');
    const publicId = parts.length > 1 ? parts[1] : src;
    
    const params = [
        `w_${width}`,
        `q_${quality || 'auto'}`,
        'f_auto',
        'c_limit'
    ].join(',');

    // Correction de l'URL : Ajout de "/" et de "$" devant {params}
    return `https://res.cloudinary.com{params}/${publicId}`;
};
export function CloudinaryLoader({src, width,quality}){

     const parts = src.split('/upload/');
    const publicId = parts.length > 1 ? parts[1] : src;
    
    const params = [
        `w_${width}`,
        `q_${quality || 'auto'}`,
        'f_auto',
        'c_limit'
    ].join(',');

    // Correction de l'URL : Ajout de "/" et de "$" devant {params}
    return `https://res.cloudinary.com{params}/${publicId}`;
}