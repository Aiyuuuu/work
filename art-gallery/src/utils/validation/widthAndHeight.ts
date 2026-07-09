export function isValidWidthAndHeight(width: number, height: number): boolean { //in pixels
    return !(typeof width !== "number" || typeof height !== "number" || width <= 0 || height <= 0 || width == null || height == null || width > 6000 || height > 6000)
}