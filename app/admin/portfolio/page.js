"use client";
import ProtectedRoute from "../../components/ProtectedRoute";
import PortfolioEditor from "../../components/admin/PortfolioEditor";
import Link from "next/link";
import { logout } from "@/utils/auth";
import "../../css/admin.css";
import "../../css/auth.css";
import { useEffect, useState } from "react";

export default function PortfolioEditorPage() {
    const [domain, setDomain] = useState("");

    useEffect(() => {
        // Get domain from window location or use default
        if (typeof window !== "undefined") {
            const hostname = window.location.hostname;
            if (hostname.includes(".")) {
                if (hostname.split(".")[0] === "www") {
                    setDomain(hostname.split(".")[1]);
                } else {
                    setDomain(hostname.split(".")[0]);
                }
            } else {
                setDomain(hostname);
            }
        }
    }, []);

    return (
        <ProtectedRoute>
            <div className="admin-container">
                <div className="admin-header">
                    <h1>Portfolio Editor</h1>
                    <div className="admin-nav">
                        <Link href="/admin">Dashboard</Link>
                        <Link href="/">Home</Link>
                        <button onClick={logout}>Logout</button>
                    </div>
                </div>

                <div className="admin-content">
                    {domain ? (
                        <PortfolioEditor domain={domain} />
                    ) : (
                        <div>Loading...</div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
