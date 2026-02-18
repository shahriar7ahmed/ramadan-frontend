"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./TajweedChat.module.css";

/**
 * Chat component for follow-up Tajweed questions.
 * Uses text-only Gemini calls (cheaper than audio).
 */
export default function TajweedChat({ analysisContext }) {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            text: "Assalamu Alaikum! I'm your Tajweed assistant. Ask me anything about pronunciation, tajweed rules, or how to improve your recitation. 🤲",
            textBn: "আসসালামু আলাইকুম! আমি আপনার তাজউইদ সহকারী। উচ্চারণ, তাজউইদের নিয়ম, বা তিলাওয়াত উন্নত করার বিষয়ে যেকোনো প্রশ্ন করুন। 🤲",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
        setLoading(true);

        try {
            const response = await fetch("/api/tajweed/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    context: analysisContext || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Chat failed");
            }

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: data.reply || "I'm sorry, I couldn't understand that.",
                    textBn: data.replyBn || null,
                    tip: data.tip || null,
                },
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: "Sorry, I couldn't process that. Please try again.",
                    textBn: "দুঃখিত, আমি এটি প্রক্রিয়া করতে পারিনি। অনুগ্রহ করে আবার চেষ্টা করুন।",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Quick question buttons
    const quickQuestions = [
        "What is Idgham?",
        "How to pronounce ع correctly?",
        "Explain Madd rules",
        "Tips for better Qalqalah",
    ];

    return (
        <div className={`${styles.container} glass-card`}>
            <div className={styles.header}>
                <h3 className={styles.title}>💬 Ask the Tajweed Teacher</h3>
            </div>

            {/* Messages */}
            <div className={styles.messages}>
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`${styles.message} ${styles[msg.role]}`}
                    >
                        <div className={styles.bubble}>
                            <p>{msg.text}</p>
                            {msg.textBn && (
                                <p className={styles.banglaText}>{msg.textBn}</p>
                            )}
                            {msg.tip && (
                                <div className={styles.tipBox}>
                                    💡 {msg.tip}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className={`${styles.message} ${styles.assistant}`}>
                        <div className={`${styles.bubble} ${styles.typing}`}>
                            <span /><span /><span />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 2 && (
                <div className={styles.quickQuestions}>
                    {quickQuestions.map((q) => (
                        <button
                            key={q}
                            className={styles.quickBtn}
                            onClick={() => {
                                setInput(q);
                                setTimeout(() => {
                                    const form = document.getElementById("tajweed-chat-form");
                                    form?.requestSubmit();
                                }, 50);
                            }}
                        >
                            {q}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <form id="tajweed-chat-form" className={styles.inputArea} onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about tajweed rules, pronunciation..."
                    className={styles.input}
                    disabled={loading}
                />
                <button
                    type="submit"
                    className={styles.sendBtn}
                    disabled={!input.trim() || loading}
                >
                    ➤
                </button>
            </form>
        </div>
    );
}
