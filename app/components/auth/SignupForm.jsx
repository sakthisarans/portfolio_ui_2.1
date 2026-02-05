"use client";
import { useState } from "react";
import { signup, verifyAccount } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function SignupForm() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: signup, 2: verify OTP
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        domain: "",
        profession: "",
    });
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signup(formData);

            if (result.success) {
                toast.success("Signup successful! Please check your email for OTP.");
                setStep(2);
            } else {
                toast.error(result.error || "Signup failed");
            }
        } catch (error) {
            toast.error("An error occurred during signup");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await verifyAccount(formData.email, otp);

            if (result.success) {
                toast.success("Account verified! You can now login.");
                router.push("/login");
            } else {
                toast.error(result.error || "Verification failed");
            }
        } catch (error) {
            toast.error("An error occurred during verification");
        } finally {
            setLoading(false);
        }
    };

    if (step === 2) {
        return (
            <form onSubmit={handleVerify} className="auth-form">
                <div className="form-group">
                    <label htmlFor="otp">Enter OTP</label>
                    <input
                        type="text"
                        id="otp"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        placeholder="Enter the OTP sent to your email"
                        className="form-input"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                >
                    {loading ? "Verifying..." : "Verify Account"}
                </button>

                <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-secondary"
                >
                    Back to Signup
                </button>
            </form>
        );
    }

    return (
        <form onSubmit={handleSignup} className="auth-form">
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="first_name">First Name</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        placeholder="First name"
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="last_name">Last Name</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        placeholder="Last name"
                        className="form-input"
                    />
                </div>
            </div>

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
                    minLength={6}
                    placeholder="Enter your password (min 6 characters)"
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

            <div className="form-group">
                <label htmlFor="domain">Domain</label>
                <input
                    type="text"
                    id="domain"
                    name="domain"
                    value={formData.domain}
                    onChange={handleChange}
                    required
                    placeholder="Your domain (e.g., johndoe)"
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label htmlFor="profession">Profession</label>
                <input
                    type="text"
                    id="profession"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    required
                    placeholder="Your profession"
                    className="form-input"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn-primary"
            >
                {loading ? "Signing up..." : "Sign Up"}
            </button>
        </form>
    );
}
