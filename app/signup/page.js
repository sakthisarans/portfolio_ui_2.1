"use client";
import SignupForm from "../components/auth/SignupForm";
import Link from "next/link";
import "../css/auth.css";

export default function SignupPage() {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Sign up to create your portfolio</p>
                </div>

                <SignupForm />

                <div className="auth-footer">
                    Already have an account?{" "}
                    <Link href="/login">Login here</Link>
                </div>
            </div>
        </div>
    );
}
