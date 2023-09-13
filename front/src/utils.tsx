export function extractColors(intValue:number) {
    // Convertir la valeur hexadécimale en décimale
  
    // Extraire les composantes de couleur rouge, verte et bleue
    const r = Math.floor(intValue / (255 * 255));
    const g = Math.floor((intValue % (255 * 255)) / 255);
    const b = intValue % 255;
  
    // Retourner un objet avec les composantes de couleur
    return {
        color: `rgb(${r}, ${g}, ${b})`
    };
  }