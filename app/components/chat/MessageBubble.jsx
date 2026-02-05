"use client";
import ReactMarkdown from "react-markdown";

export default function MessageBubble({ message, isUser }) {
    return (
        <div className={`message-bubble ${isUser ? 'message-user' : 'message-assistant'}`}>
            {isUser ? (
                <div>{message.content}</div>
            ) : (
                <ReactMarkdown>{message.content}</ReactMarkdown>
            )}
        </div>
    );
}
