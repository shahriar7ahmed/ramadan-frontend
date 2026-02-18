import { NextResponse } from "next/server";
import { callGemini } from "@/lib/api/gemini";

/**
 * POST /api/tajweed/analyze
 * Receives audio recording + surah info, sends to Gemini for Tajweed analysis.
 */
export async function POST(request) {
    try {
        const { audioBase64, surahName, surahNumber, arabicText, ayahRange } =
            await request.json();

        if (!audioBase64) {
            return NextResponse.json(
                { error: "No audio provided" },
                { status: 400 }
            );
        }

        // Build the analysis prompt
        const prompt = buildTajweedPrompt(surahName, surahNumber, arabicText, ayahRange);

        // Send to Gemini with audio
        const contents = [
            {
                parts: [
                    {
                        inlineData: {
                            mimeType: "audio/webm",
                            data: audioBase64,
                        },
                    },
                    { text: prompt },
                ],
            },
        ];

        const result = await callGemini(contents, {
            temperature: 0.2,
            maxOutputTokens: 4096,
        });

        return NextResponse.json({ success: true, analysis: result });
    } catch (err) {
        console.error("Tajweed analysis error:", err);
        return NextResponse.json(
            { error: err.message || "Analysis failed" },
            { status: 500 }
        );
    }
}

/**
 * Build a structured prompt for Tajweed analysis.
 */
function buildTajweedPrompt(surahName, surahNumber, arabicText, ayahRange) {
    return `You are an expert Quran Tajweed teacher and Arabic phonetics analyst.

The user is reciting ${surahName ? `Surah ${surahName} (${surahNumber})` : "a Quran passage"}${ayahRange ? `, ayahs ${ayahRange}` : ""}.

${arabicText ? `The correct Arabic text is:
${arabicText}` : "Listen carefully to identify which surah/ayahs are being recited."}

TASK: Listen to the audio recitation and provide a detailed Tajweed analysis.

Analyze:
1. **Pronunciation (Makharij)** — Are Arabic letters articulated from correct points?
2. **Tajweed Rules** — Idgham, Ikhfa, Iqlab, Izhar, Ghunnah, Madd, Qalqalah, Tafkheem/Tarqeeq
3. **Fluency** — Pace, rhythm, natural flow, stopping points (waqf)
4. **Accuracy** — Any words skipped, added, or mispronounced

Return ONLY a JSON object with this exact structure:
{
  "overallScore": <0-100>,
  "scores": {
    "pronunciation": <0-100>,
    "tajweedRules": <0-100>,
    "fluency": <0-100>,
    "accuracy": <0-100>
  },
  "detectedSurah": "<surah name if identifiable>",
  "feedback": [
    {
      "word": "<Arabic word>",
      "ayahNumber": <number or null>,
      "issue": "<English description of problem>",
      "issueBn": "<Bangla description>",
      "severity": "<correct|minor|major|missed>",
      "rule": "<tajweed rule name>",
      "ruleBn": "<Bangla rule name>",
      "suggestion": "<how to fix>",
      "suggestionBn": "<Bangla fix>"
    }
  ],
  "praise": "<one encouraging sentence in English>",
  "praiseBn": "<same in Bangla>",
  "summary": "<2-3 sentence overall assessment in English>",
  "summaryBn": "<same in Bangla>",
  "tipsToImprove": [
    {
      "tip": "<English tip>",
      "tipBn": "<Bangla tip>"
    }
  ]
}

IMPORTANT RULES:
- Be encouraging but honest
- If the recitation is good, give high scores and praise
- Only flag genuine pronunciation or tajweed issues
- Always provide Bangla translations for all feedback
- If audio is unclear or too short, still provide what feedback you can
- Limit feedback items to the top 5-8 most important issues
- severity "correct" should be used for words that are recited perfectly as positive reinforcement`;
}
