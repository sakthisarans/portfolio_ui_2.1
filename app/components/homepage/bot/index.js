"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from 'framer-motion';

const TypingDots = () => (
    <span className="typing-dots">
        <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ display: 'inline-block', margin: '0 1px', fontSize: 22 }}
        >•</motion.span>
        <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            style={{ display: 'inline-block', margin: '0 1px', fontSize: 22 }}
        >•</motion.span>
        <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            style={{ display: 'inline-block', margin: '0 1px', fontSize: 22 }}
        >•</motion.span>
    </span>
);

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}
function setCookie(name, value, days = 365) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}
async function getIP() {
    try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        return data.ip;
    } catch {
        return "unknown";
    }
}

export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [animating, setAnimating] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [chatId, setChatId] = useState(null);
    const messagesEndRef = useRef(null);

    const handleIconClick = () => {
        setAnimating(true);
        setTimeout(() => {
            setOpen(true);
            setAnimating(false);
        }, 400);
    };
    const handleClose = () => {
        setAnimating(true);
        setTimeout(() => {
            setOpen(false);
            setAnimating(false);
        }, 400);
    };

    useEffect(() => {
        async function initChatId() {
            let cid = getCookie("chatid");
            if (!cid) {
                const ip = await getIP();
                const sys = navigator.userAgent.replace(/\s/g, "");
                cid = btoa(`${sys}-${ip}-${Date.now()}-${Math.random()}`);
                setCookie("chatid", cid);
            }
            setChatId(cid);
        }
        initChatId();
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages]);

    const getUserIdFromDomain = () => {
        if (typeof window !== "undefined") {
            const hostname = window.location.hostname;
            if (hostname.includes(".")) {
                return hostname.split(".")[0];
            }
            return hostname;
        }
        return "";
    };

    // Streaming handler
    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages((msgs) => [...msgs, { from: "user", text: input }]);
        setInput("");
        setLoading(true);

        // Add a placeholder for the streaming bot message
        setMessages((msgs) => [...msgs, { from: "bot", text: "" }]);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
            const res = await fetch(`${apiUrl}/api/v1/genai/search`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input, chatid: chatId, userid: getUserIdFromDomain() }),
            });

            if (!res.body || !window.ReadableStream) {
                // fallback: not streaming
                const data = await res.json();
                setMessages((msgs) => {
                    const updated = [...msgs];
                    updated[updated.length - 1] = { from: "bot", text: data.reply };
                    return updated;
                });
                setLoading(false);
                return;
            }

            const reader = res.body.getReader();
            let botText = "";
            const decoder = new TextDecoder();

            // Smoother streaming: update every 40ms or on chunk
            let buffer = "";
            let lastUpdate = Date.now();

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });

                // Only update UI if enough time has passed or buffer is large
                if (Date.now() - lastUpdate > 40 || buffer.length > 16) {
                    botText += buffer;
                    buffer = "";
                    setMessages((msgs) => {
                        const updated = [...msgs];
                        updated[updated.length - 1] = { from: "bot", text: botText };
                        return updated;
                    });
                    lastUpdate = Date.now();
                }
            }
            // Flush any remaining buffer
            if (buffer.length > 0) {
                botText += buffer;
                setMessages((msgs) => {
                    const updated = [...msgs];
                    updated[updated.length - 1] = { from: "bot", text: botText };
                    return updated;
                });
            }
        } catch {
            setMessages((msgs) => {
                const updated = [...msgs];
                updated[updated.length - 1] = {
                    from: "bot",
                    text: "Something went wrong on our side. We’re looking into it, and things should be back to normal soon. Thanks for your patience."
                };
                return updated;
            });
        }
        setLoading(false);
    };

    return (
        <>
            {/* Chat Icon (hidden when open or animating) */}
            {!open && !animating && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "32px",
                        right: "32px",
                        zIndex: 9999,
                        background: "#fff",
                        borderRadius: "50%",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        width: "56px",
                        height: "56px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "opacity 0.3s",
                        opacity: 1,
                    }}
                    title="Chat Assistant"
                    onClick={handleIconClick}
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#333" strokeWidth="2" fill="#f5f5f5" />
                        <ellipse cx="9" cy="13" rx="1.5" ry="2" fill="#333" />
                        <ellipse cx="15" cy="13" rx="1.5" ry="2" fill="#333" />
                        <path d="M8 17c1.333 1 4.667 1 6 0" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </div>
            )}
            {/* Expand Animation (only when opening) */}
            {animating && !open && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "16px",
                        right: "16px",
                        width: "420px",
                        maxWidth: "95vw",
                        height: "600px",
                        maxHeight: "80vh",
                        background: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                        zIndex: 9999,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        opacity: 1,
                        transformOrigin: "bottom right",
                        animation: "expandFromIcon 0.4s forwards",
                    }}
                >
                    {/* Empty content for animation */}
                </div>
            )}
            {/* Shrink Animation (only when closing) */}
            {animating && open && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "16px",
                        right: "16px",
                        width: "420px",
                        maxWidth: "90vw",
                        height: "600px",
                        maxHeight: "80vh",
                        background: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                        zIndex: 9999,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        opacity: 1,
                        transformOrigin: "bottom right",
                        animation: "shrinkToIcon 0.4s forwards",
                    }}
                >
                    <div style={{
                        padding: "12px",
                        borderBottom: "1px solid #eee",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        color: "#000",
                        fontSize: "16px"
                    }}>
                        Chat Assistant
                        <button
                            style={{
                                background: "none",
                                border: "none",
                                fontSize: "18px",
                                cursor: "pointer",
                                color: "#000"
                            }}
                            onClick={handleClose}
                            title="Close"
                        >
                            ×
                        </button>
                    </div>
                    <div
                        ref={messagesEndRef}
                        style={{
                            flex: 1,
                            padding: "12px",
                            overflowY: "auto",
                            background: "#fafafa",
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}
                        className="hide-scrollbar"
                    >
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{ marginBottom: "8px", textAlign: msg.from === "user" ? "right" : "left" }}>
                                <span style={{
                                    display: "inline-block",
                                    padding: "8px 12px",
                                    borderRadius: "16px",
                                    background: msg.from === "user" ? "#0078d4" : "#eee",
                                    color: msg.from === "user" ? "#fff" : "#000",
                                    maxWidth: "80%",
                                    fontSize: "14px"
                                }}>
                                    {msg.from === "bot" ? (
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    ) : (
                                        msg.text
                                    )}
                                </span>
                            </div>
                        ))}
                        {loading && (
                            <div style={{ marginBottom: "8px", textAlign: "left" }}>
                                <TypingDots />
                            </div>
                        )}
                    </div>
                    <form style={{ display: "flex", borderTop: "1px solid #eee", padding: "8px" }}>
                        <input
                            value={input}
                            style={{
                                flex: 1,
                                border: "none",
                                outline: "none",
                                padding: "8px",
                                borderRadius: "8px",
                                color: "#000",
                                background: "#fff",
                                fontSize: "14px"
                            }}
                            placeholder="Type a message..."
                            disabled
                            readOnly
                        />
                        <button
                            type="button"
                            style={{
                                marginLeft: "8px",
                                padding: "8px 16px",
                                borderRadius: "8px",
                                background: "#0078d4",
                                color: "#fff",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                            disabled
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M4 12h16M14 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}
            {/* Chat Window (only when open and not animating) */}
            {open && !animating && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "16px",
                        right: "16px",
                        width: "420px",
                        maxWidth: "90vw",
                        height: "600px",
                        maxHeight: "80vh",
                        background: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                        zIndex: 9999,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        opacity: 1,
                        transformOrigin: "bottom right",
                    }}
                >
                    <div style={{
                        padding: "12px",
                        borderBottom: "1px solid #eee",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        color: "#000",
                        fontSize: "16px"
                    }}>
                        Chat Assistant
                        <button
                            style={{
                                background: "none",
                                border: "none",
                                fontSize: "18px",
                                cursor: "pointer",
                                color: "#000"
                            }}
                            onClick={handleClose}
                            title="Close"
                        >
                            ×
                        </button>
                    </div>
                    <div
                        ref={messagesEndRef}
                        style={{
                            flex: 1,
                            padding: "12px",
                            overflowY: "auto",
                            background: "#fafafa",
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}
                        className="hide-scrollbar"
                    >
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{ marginBottom: "8px", textAlign: msg.from === "user" ? "right" : "left" }}>
                                <span style={{
                                    display: "inline-block",
                                    padding: "8px 12px",
                                    borderRadius: "16px",
                                    background: msg.from === "user" ? "#0078d4" : "#eee",
                                    color: msg.from === "user" ? "#fff" : "#000",
                                    maxWidth: "80%",
                                    fontSize: "14px"
                                }}>
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </span>
                            </div>
                        ))}
                        {loading && <div style={{ marginBottom: "8px", textAlign: "left", color: "#888" }}>
                            <TypingDots />
                        </div>}
                    </div>
                    <form onSubmit={handleSend} style={{ display: "flex", borderTop: "1px solid #eee", padding: "8px" }}>
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            style={{
                                flex: 1,
                                border: "none",
                                outline: "none",
                                padding: "8px",
                                borderRadius: "8px",
                                color: "#000",
                                background: "#fff",
                                fontSize: "14px"
                            }}
                            placeholder="Type a message..."
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            style={{
                                marginLeft: "8px",
                                padding: "8px 16px",
                                borderRadius: "8px",
                                background: "#0078d4",
                                color: "#fff",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                            disabled={loading}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M4 12h16M14 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}
            <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        @media (max-width: 600px) {
    .chat-header {
      font-size: 14px !important;
      padding: 8px !important;
    }
    .chat-message {
      font-size: 12px !important;
      padding: 6px 8px !important;
    }
    .chat-input {
      font-size: 12px !important;
      padding: 6px !important;
    }
  }
      `}</style>
        </>
    );
}