
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import "./AIShoppingAssistant.css";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:9090";

export default function AIShoppingAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            text: "Hi! I'm your SalesSavvy AI assistant. What product are you looking for today?",
        },
    ]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function sendMessage(event) {
        event.preventDefault();

        const question = message.trim();

        if (!question || loading) return;

        setMessages((previous) => [
            ...previous,
            { role: "user", text: question },
        ]);

        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/ai/chat`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ message: question }),
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (
                    response.status === 401 ||
                    response.status === 403
                ) {
                    throw new Error(
                        "Please log in with a customer account to use the AI assistant."
                    );
                }

                throw new Error(
                    data.detail ||
                    data.message ||
                    "Unable to get an AI response. Please try again."
                );
            }

            if (!data.reply || !data.reply.trim()) {
                throw new Error(
                    "The AI assistant returned an empty response."
                );
            }

            setMessages((previous) => [
                ...previous,
                {
                    role: "assistant",
                    text: data.reply,
                },
            ]);
        } catch (err) {
            setError(
                err.message || "Cannot connect to the AI assistant."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="sales-ai">
            {isOpen && (
                <section
                    className="sales-ai-panel"
                    aria-label="SalesSavvy AI shopping assistant"
                >
                    <header className="sales-ai-header">
                        <div>
                            <strong>SalesSavvy AI</strong>
                            <span>Your shopping assistant</span>
                        </div>

                        <button
                            type="button"
                            className="sales-ai-close"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chat"
                        >
                            ×
                        </button>
                    </header>

                    <div
                        className="sales-ai-messages"
                        aria-live="polite"
                    >
                        {messages.map((item, index) => (
                            <div
                                key={`${item.role}-${index}`}
                                className={`sales-ai-message ${item.role}`}
                            >
                                {item.role === "assistant" ? (
                                    <div className="sales-ai-markdown">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                        >
                                            {item.text}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    item.text
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div className="sales-ai-message assistant">
                                Thinking...
                            </div>
                        )}
                    </div>

                    {error && (
                        <p className="sales-ai-error" role="alert">
                            {error}
                        </p>
                    )}

                    <form
                        className="sales-ai-form"
                        onSubmit={sendMessage}
                    >
                        <input
                            value={message}
                            onChange={(event) =>
                                setMessage(event.target.value)
                            }
                            placeholder="Ask about products..."
                            aria-label="Your message"
                            maxLength={1000}
                            disabled={loading}
                        />

                        <button
                            type="submit"
                            disabled={loading || !message.trim()}
                        >
                            {loading ? "Sending..." : "Send"}
                        </button>
                    </form>
                </section>
            )}

            <button
                type="button"
                className="sales-ai-toggle"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
            >
                {isOpen ? "Close AI" : "✨ Ask AI"}
            </button>
        </div>
    );
}
