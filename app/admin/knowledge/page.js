"use client";
import ProtectedRoute from "../../components/ProtectedRoute";
import KnowledgeManager from "../../components/admin/KnowledgeManager";
import Link from "next/link";
import { logout } from "@/utils/auth";
import "../../css/admin.css";
import "../../css/auth.css";

export default function KnowledgePage() {
    return (
        <ProtectedRoute>
            <div className="admin-container">
                <div className="admin-header">
                    <h1>Knowledge Base Management</h1>
                    <div className="admin-nav">
                        <Link href="/admin">Dashboard</Link>
                        <Link href="/">Home</Link>
                        <button onClick={logout}>Logout</button>
                    </div>
                </div>

                <div className="admin-content">
                    <KnowledgeManager />
                </div>
            </div>
        </ProtectedRoute>
    );
}
