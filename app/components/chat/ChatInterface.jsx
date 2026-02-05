"use client";
import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { sendChatMessage } from "@/utils/api";
import { toast } from "react-toastify";

export default function ChatInterface({ userId, chatId }) {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Load chat history from localStorage
    useEffect(() => {
        const savedMessages = localStorage.getItem(`chat_${chatId}`);
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        } else {
            setMessages([]); // Clear messages for new/reset chat
        }
    }, [chatId]);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
        }
    }, [messages, chatId]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!inputMessage.trim() || loading) return;

        const userMessage = {
            content: inputMessage,
            isUser: true,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputMessage("");
        setLoading(true);

        try {
            const response = await sendChatMessage(
                inputMessage,
                userId,
                chatId
            );

            const assistantMessage = {
                content: response.response || response.message || "I received your message.",
                isUser: false,
                timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            toast.error("Failed to send message. Please try again.");
            console.error("Chat error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="empty-chat">
                        <div className="empty-chat-icon">💬</div>
                        <h2>Start a Conversation</h2>
                        <p>Ask me anything about the portfolio or any topic!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <MessageBubble
                            key={index}
                            message={msg}
                            isUser={msg.isUser}
                        />
                    ))
                )}

                {loading && (
                    <div className="chat-loading">
                        <span>Thinking</span>
                        <div className="chat-loading-dots">
                            <div className="chat-loading-dot"></div>
                            <div className="chat-loading-dot"></div>
                            <div className="chat-loading-dot"></div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
                <div className="chat-input-wrapper">
                    <textarea
                        className="chat-input"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        rows={1}
                    />
                    <button
                        className="chat-send-btn"
                        onClick={handleSend}
                        disabled={loading || !inputMessage.trim()}
                    >
                        {loading ? "Sending..." : "Send"}
                    </button>
                </div>
            </div>
        </>
    );
}
