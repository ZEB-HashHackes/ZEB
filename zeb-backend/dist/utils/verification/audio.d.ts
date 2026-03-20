/**
 * Generates a simple audio signature for MVP.
 * Currently hashes the first 128KB of the audio file to detect exact or near-identical headers/content.
 * @param buffer - The audio buffer.
 */
export declare function generateAudioSignature(buffer: Buffer): string;
//# sourceMappingURL=audio.d.ts.map