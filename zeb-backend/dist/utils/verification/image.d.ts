/**
 * Generates a basic perceptual hash (pHash) for an image.
 * This version resizes the image to 8x8, converts to grayscale,
 * and calculates a bitstring based on whether pixels are above/below the mean.
 * @param buffer - The image buffer.
 */
export declare function generatePHash(buffer: Buffer): Promise<string>;
/**
 * Calculates the Hamming distance between two hex hashes.
 * @param h1 - Hex string hash 1.
 * @param h2 - Hex string hash 2.
 */
export declare function calculateHammingDistance(h1: string, h2: string): number;
//# sourceMappingURL=image.d.ts.map