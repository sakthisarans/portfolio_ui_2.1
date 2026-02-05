"use client";
import LoginForm from "../components/auth/LoginForm";
import Link from "next/link";
import "../css/auth.css";

export default function LoginPage() {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Login to manage your portfolio</p>
                </div>

                <LoginForm />

                <div className="auth-footer">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup">Sign up here</Link>
                </div>
            </div>
        </div>
    );
}
