"use client";
import ProtectedRoute from "../components/ProtectedRoute";
import Link from "next/link";
import { logout } from "@/utils/auth";
import "../css/admin.css";

export default function AdminPage() {
    return (
        <ProtectedRoute>
            <div className="admin-container">
                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <div className="admin-nav">
                        <Link href="/">Home</Link>
                        <Link href="/chat">Chat</Link>
                        <button onClick={logout}>Logout</button>
                    </div>
                </div>

                <div className="admin-content">
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem' }}>
                        Welcome to your Portfolio Admin
                    </h2>
                    <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                        Manage your portfolio content, knowledge base, and more.
                    </p>

                    <div className="admin-grid">
                        <div className="admin-card">
                            <div className="admin-card-icon">📝</div>
                            <h2>Portfolio Editor</h2>
                            <p>Edit your personal information, projects, experience, education, and skills.</p>
                            <Link href="/admin/portfolio" className="admin-card-btn">
                                Edit Portfolio
                            </Link>
                        </div>

                        <div className="admin-card">
                            <div className="admin-card-icon">🧠</div>
                            <h2>Knowledge Base</h2>
                            <p>Manage your AI knowledge base, upload documents, and train your LLM.</p>
                            <Link href="/admin/knowledge" className="admin-card-btn">
                                Manage Knowledge
                            </Link>
                        </div>

                        <div className="admin-card">
                            <div className="admin-card-icon">💬</div>
                            <h2>AI Chat</h2>
                            <p>Test and interact with your private LLM assistant.</p>
                            <Link href="/chat" className="admin-card-btn">
                                Open Chat
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
