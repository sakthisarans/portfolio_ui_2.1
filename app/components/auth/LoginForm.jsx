"use client";
import { useState } from "react";
import { login } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                toast.success("Login successful!");
                router.push("/admin");
            } else {
                toast.error(result.error || "Login failed");
            }
        } catch (error) {
            toast.error("An error occurred during login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="form-input"
                />
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
                <label htmlFor="password">Password</label>
                <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="form-input"
                    style={{ paddingRight: '2.5rem' }}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                        position: 'absolute',
                        right: '0.5rem',
                        bottom: '0.5rem',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9ca3af',
                        fontSize: '1.1rem',
                        padding: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#4b5563'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                    title={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn-primary"
            >
                {loading ? "Logging in..." : "Login"}
            </button>
        </form>
    );
}
