import { NextResponse } from "next/server";
import { callGemini } from "@/lib/api/gemini";

/**
 * POST /api/tajweed/chat
 * Chat with the Tajweed AI teacher for follow-up questions.
 */
export async function POST(request) {
    try {
        const { message, context } = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: "No message provided" },
                { status: 400 }
            );
        }

        const prompt = `You are a friendly and knowledgeable Quran Tajweed teacher assistant.

${context ? `The student just practiced reciting and received this analysis:
Overall Score: ${context.overallScore}/100
Key issues: ${context.feedback?.map((f) => f.issue).join(", ") || "None"}
` : ""}

The student asks: "${message}"

Respond helpfully about Tajweed, Arabic pronunciation, or Quran recitation.
Keep your response concise (2-4 sentences max).
Always provide the response in both English and Bangla.

Return JSON:
{
  "reply": "<English response>",
  "replyBn": "<Bangla response>",
  "tip": "<optional quick tip>"
}`;

        const contents = [{ parts: [{ text: prompt }] }];

        const result = await callGemini(contents, {
            temperature: 0.5,
            maxOutputTokens: 1024,
        });

        return NextResponse.json({ success: true, ...result });
    } catch (err) {
        console.error("Tajweed chat error:", err);
        return NextResponse.json(
            { error: err.message || "Chat failed" },
            { status: 500 }
        );
    }
}
