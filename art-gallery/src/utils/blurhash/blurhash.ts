import { decode } from "blurhash";

/**
 * Converts a blurhash to an environment-safe, Base64-encoded SVG data URL.
 * Works in both Node.js (Server Components) and browser environments.
 */
export function blurHashToDataURL(
  blurHash: string,
  width = 8, //default = 8x8
  height = 8
): string {
  try {
    if (!blurHash) { //missing blurhash
      throw new Error("Blurhash string is empty");
    }

    const pixels = decode(blurHash, width, height); 

    //initialize svg template string
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">`;
    
    // Extending x, y, width and height to prevent edge clipping during blur
    svg += `<filter id="b" x="-20%" y="-20%" width="140%" height="140%">`;
    
    //applying blur effect with gaussian blur 
    svg += `<feGaussianBlur stdDeviation="1.2" />`;
    
    //close filter tag
    svg += `</filter>`;
    
    //apply filter to group tag
    svg += `<g filter="url(#b)">`;

    //iterating through each pixel of the blurhash
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="rgb(${r},${g},${b})" />`;
      }
    }

    //close group tag and svg template
    svg += `</g></svg>`;

    // Environment-safe base64 helper. Converts the raw SVG markup into Base64 
    const base64 = typeof window === "undefined"
      ? Buffer.from(svg).toString("base64")
      : btoa(unescape(encodeURIComponent(svg)));
    
    // Returns the finalized, inline CSS-ready Base64 image data URL.
    return `data:image/svg+xml;base64,${base64}`;
  } catch {
    // Neutral fallback SVG (gray background) so the UI doesn't crash on bad data
    const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><rect width="100%" height="100%" fill="#3f3f3fff" /></svg>`;
    const fallbackBase64 = typeof window === "undefined"
      ? Buffer.from(fallbackSvg).toString("base64")
      : btoa(unescape(encodeURIComponent(fallbackSvg)));

    return `data:image/svg+xml;base64,${fallbackBase64}`;
  }
}