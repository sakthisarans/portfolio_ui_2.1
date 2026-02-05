"use client";
import { useState, useEffect } from "react";
import ChatInterface from "../components/chat/ChatInterface";
import { v4 as uuidv4 } from "uuid";
import "../css/chat.css";
import Link from "next/link";

export default function ChatPage() {
    const [userId, setUserId] = useState("");
    const [chatId, setChatId] = useState("");

    useEffect(() => {
        // Get or create user ID
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


        // Get or create chat ID for this session
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

    if (!userId || !chatId) {
        return null; // Loading state
    }

    return (
        <div className="chat-container">
            <div className="chat-wrapper">
                <div className="chat-header">
                    <div>
                        <h1>AI Assistant</h1>
                        <p className="subtitle">Powered by private LLM</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={handleNewChat}
                            style={{
                                padding: '0.5rem 1rem',
                                background: 'rgba(255,255,255,0.2)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                borderRadius: '8px',
                                color: 'white',
                                cursor: 'pointer',
                                fontWeight: '600',
                            }}
                        >
                            New Chat
                        </button>
                        <Link
                            href="/"
                            style={{
                                padding: '0.5rem 1rem',
                                background: 'rgba(255,255,255,0.2)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                borderRadius: '8px',
                                color: 'white',
                                textDecoration: 'none',
                                fontWeight: '600',
                            }}
                        >
                            Home
                        </Link>
                    </div>
                </div>

                <ChatInterface userId={userId} chatId={chatId} />
            </div>
        </div>
    );
}
