"use client";
import { useState, useEffect } from "react";
import ChatInterface from "./chat/ChatInterface";
import { v4 as uuidv4 } from "uuid";
import "../css/floating-chat.css";

export default function FloatingChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState("");
    const [chatId, setChatId] = useState("");


    useEffect(() => {
        if (typeof window !== "undefined") {
            const hostname = window.location.hostname;
            if (hostname.includes(".")) {
                const parts = hostname.split(".");
                if (parts[0] === "www" && parts.length > 1) {
                    setUserId(parts[1]);
                } else {
                    setUserId(parts[0]);
                }
            } else {
                setUserId(hostname); // Fallback for localhost
            }
        }

        let cid = sessionStorage.getItem("current_chat_id");
        if (!cid) {
            cid = uuidv4();
            sessionStorage.setItem("current_chat_id", cid);
        }
        setChatId(cid);
    }, []);

    const handleNewChat = () => {
        const newChatId = uuidv4();
        sessionStorage.setItem("current_chat_id", newChatId);
        setChatId(newChatId);
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    if (!userId || !chatId) {
        return null;
    }

    return (
        <>
            {/* Floating Chat Button */}
            <button
                className={`floating-chat-button ${isOpen ? 'open' : ''}`}
                onClick={toggleChat}
                aria-label="Toggle chat"
            >
                {isOpen ? '✕' : '💬'}
            </button>

            {/* Chat Popup Window */}
            {isOpen && (
                <div className="floating-chat-popup">
                    <div className="floating-chat-header">
                        <div>
                            <h3>AI Assistant</h3>
                            <p className="subtitle">Powered by private LLM</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={handleNewChat}
                                className="chat-action-btn"
                                title="New Chat"
                            >
                                🔄
                            </button>
                            <button
                                onClick={toggleChat}
                                className="chat-action-btn"
                                title="Close"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                    <ChatInterface userId={userId} chatId={chatId} />
                </div>
            )}
        </>
    );
}
