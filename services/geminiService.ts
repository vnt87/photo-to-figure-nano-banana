/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import type { Language } from '../lib/i18n/LanguageContext';

/**
 * Generates an image by sending the source image and prompt to our secure serverless function.
 * @param imageDataUrl A data URL string of the source image (e.g., 'data:image/png;base64,...').
 * @param name The name for the figure, to be used in the prompt.
 * @param language The current language ('vi' or 'en').
 * @returns A promise that resolves to a base64-encoded image data URL of the generated image.
 */
export async function generateImage(imageDataUrl: string, name: string, language: Language): Promise<string> {
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                imageDataUrl,
                name,
                language,
            }),
        });

        if (!response.ok) {
            // FIX: Add type assertion to handle unknown type from response.json()
            const errorData = await response.json() as { error?: string };
            // Use the detailed error message from the server function
            throw new Error(errorData.error || `Server error: ${response.statusText}`);
        }

        // FIX: Add type assertion to handle unknown type from response.json()
        const data = await response.json() as { imageUrl: string };
        return data.imageUrl;

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
        console.error("An unrecoverable error occurred during image generation.", error);
        // Re-throw the error with a user-friendly message, preserving the server's detail.
        throw new Error(`The AI model failed to create an image. Details: ${errorMessage}`);
    }
}
