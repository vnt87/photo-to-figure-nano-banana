/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
// FIX: The Cloudflare workers type definitions were not found, causing multiple errors.
// The types have been changed to `any` to resolve this without altering build configurations.
import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

// --- Localized Strings ---

const prompts = {
    vi: "Tạo một nhân vật mô hình tỉ lệ 1/7 được thương mại hóa từ nhân vật trong hình minh họa, theo phong cách và môi trường thực tế. Đặt nhân vật trên một đế acrylic trong suốt. Bên cạnh màn hình máy tính, hiển thị quá trình tạo mô hình ZBrush của nhân vật. Bên cạnh màn hình máy tính, đặt một hộp bao bì đồ chơi kiểu BANDAI có in tiêu đề {name} cùng với tác phẩm nghệ thuật gốc.",
    en: "Create a 1/7 scale commercialized figure of the character in the illustration, in a realistic style and environment. Place the figure on clear acrylic stand. Next to the computer screen, display the ZBrush modeling process of the figure. Next to the computer screen, place a BANDAI-style toy packaging box with title {name} printed with the original artwork."
};

const errors = {
    vi: {
        safetyFilter: "Tạo hình ảnh không thành công do bộ lọc an toàn. Điều này có thể xảy ra với một số loại hình ảnh hoặc văn bản nhất định. Vui lòng thử sử dụng một ảnh hoặc tên khác.",
        textResponse: "Mô hình AI đã trả lời bằng văn bản thay vì hình ảnh: \"{textResponse}\"",
        allRetriesFailed: "Cuộc gọi API Gemini không thành công sau tất cả các lần thử lại."
    },
    en: {
        safetyFilter: "Image generation failed due to safety filters. This can happen with certain types of images or text. Please try a different photo or name.",
        textResponse: "The AI model responded with text instead of an image: \"{textResponse}\"",
        allRetriesFailed: "Gemini API call failed after all retries."
    }
};

// FIX: Add a type definition for the request body to resolve TypeScript errors.
interface GenerateRequestBody {
    imageDataUrl: string;
    name: string;
    language?: 'vi' | 'en';
    apiKey?: string;
}


// This is the Cloudflare Pages Function onRequest handler
// FIX: Replaced PagesFunction with `any` to resolve type definition errors.
export const onRequest: any = async (context: any) => {
    // Only allow POST requests
    if (context.request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        // --- Get data from the client's request ---
        // FIX: Type the destructured object from the JSON body since the request is now `any`.
        const { imageDataUrl, name, language = 'vi', apiKey }: GenerateRequestBody = await context.request.json();
        const lang: 'vi' | 'en' = (language === 'en') ? 'en' : 'vi'; // Sanitize language input

        // --- Initialize Gemini ---
        const effectiveApiKey = apiKey || context.env.API_KEY;
        if (!effectiveApiKey) {
            throw new Error("Gemini API key is not configured. Please provide one or set it in the server environment.");
        }
        const ai = new GoogleGenAI({ apiKey: effectiveApiKey });

        if (!imageDataUrl || !name) {
            return new Response(JSON.stringify({ error: 'Missing imageDataUrl or name' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const prompt = prompts[lang].replace('{name}', name);

        // --- Call the Gemini API ---
        const generatedImageUrl = await callGeminiApi(ai, imageDataUrl, prompt, lang);

        // --- Send the result back to the client ---
        return new Response(JSON.stringify({ imageUrl: generatedImageUrl }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error in serverless function:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};


async function callGeminiApi(ai: GoogleGenAI, imageDataUrl: string, prompt: string, lang: 'vi' | 'en'): Promise<string> {
    const match = imageDataUrl.match(/^data:(image\/\w+);base64,(.*)$/);
    if (!match) {
        throw new Error("Invalid image data URL format. Expected 'data:image/...;base64,...'");
    }
    const [, mimeType, base64Data] = match;

    const imagePart = { inlineData: { mimeType, data: base64Data } };
    const textPart = { text: prompt };

    const response = await callGeminiWithRetry(ai, imagePart, textPart, lang);
    return processGeminiResponse(response, lang);
}


async function callGeminiWithRetry(ai: GoogleGenAI, imagePart: object, textPart: object, lang: 'vi' | 'en'): Promise<GenerateContentResponse> {
    const maxRetries = 3;
    const initialDelay = 1000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: { parts: [imagePart, textPart] },
                config: {
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });
        } catch (error) {
            console.error(`Error calling Gemini API (Attempt ${attempt}/${maxRetries}):`, error);
            const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
            const isInternalError = errorMessage.includes('"code":500') || errorMessage.includes('INTERNAL');

            if (isInternalError && attempt < maxRetries) {
                const delay = initialDelay * Math.pow(2, attempt - 1);
                console.log(`Internal error detected. Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw error;
        }
    }
    throw new Error(errors[lang].allRetriesFailed);
}

function processGeminiResponse(response: GenerateContentResponse, lang: 'vi' | 'en'): string {
    const finishReason = response.candidates?.[0]?.finishReason;
    if (finishReason === 'PROHIBITED_CONTENT' || finishReason === 'SAFETY') {
        throw new Error(errors[lang].safetyFilter);
    }

    const imagePartFromResponse = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
    if (imagePartFromResponse?.inlineData) {
        const { mimeType, data } = imagePartFromResponse.inlineData;
        return `data:${mimeType};base64,${data}`;
    }

    const textResponse = response.text || '';
    throw new Error(errors[lang].textResponse.replace('{textResponse}', textResponse));
}
