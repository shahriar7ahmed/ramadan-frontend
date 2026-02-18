/**
 * Gemini API key rotation for optimized usage.
 * Cycles through keys to avoid rate limits.
 */

let currentKeyIndex = 0;

const GEMINI_KEYS = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
    process.env.GEMINI_API_KEY_5,
    process.env.GEMINI_API_KEY_6,
].filter(Boolean);

/**
 * Get the next available API key (round-robin).
 */
export function getNextKey() {
    if (GEMINI_KEYS.length === 0) {
        throw new Error("No Gemini API keys configured");
    }
    const key = GEMINI_KEYS[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % GEMINI_KEYS.length;
    return key;
}

/**
 * Call Gemini API with automatic key rotation on rate limit.
 * Tries each key once before giving up.
 */
export async function callGemini(contents, config = {}) {
    let lastError = null;

    for (let attempt = 0; attempt < GEMINI_KEYS.length; attempt++) {
        const key = getNextKey();
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents,
                        generationConfig: {
                            temperature: 0.3,
                            maxOutputTokens: 4096,
                            responseMimeType: "application/json",
                            ...config,
                        },
                    }),
                }
            );

            if (response.status === 429) {
                // Rate limited — try next key
                lastError = new Error(`Rate limited on key ${attempt + 1}`);
                continue;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `Gemini API error: ${response.status}`);
            }

            const data = await response.json();

            // Extract text content from response
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) {
                throw new Error("No response from Gemini");
            }

            // Parse JSON response
            try {
                return JSON.parse(text);
            } catch {
                // If JSON parsing fails, return raw text
                return { rawResponse: text };
            }
        } catch (err) {
            if (err.message.includes("Rate limited")) {
                lastError = err;
                continue;
            }
            throw err;
        }
    }

    throw lastError || new Error("All API keys exhausted");
}
