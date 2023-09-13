export function extractColors(intValue:number) {
    const r = Math.floor(intValue / (255 * 255));
    const g = Math.floor((intValue % (255 * 255)) / 255);
    const b = intValue % 255;
    return {
        color: `rgb(${r}, ${g}, ${b})`
    };
  }