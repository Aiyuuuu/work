import { decode } from "blurhash";

export function blurHashToDataURL(
  blurHash: string,
  width = 8,
  height = 8
): string {
  const pixels = decode(blurHash, width, height);

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">`;
  svg += `<filter id="b"><feGaussianBlur stdDeviation="1.2" /></filter>`;
  svg += `<g filter="url(#b)">`;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="rgb(${r},${g},${b})" />`;
    }
  }

  svg += `</g></svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}