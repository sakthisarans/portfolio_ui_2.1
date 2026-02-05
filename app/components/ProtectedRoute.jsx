"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/utils/auth";
import { useTokenVerification } from "@/utils/useTokenVerification";
import { PacmanLoader } from "react-spinners";

export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // Enable automatic token verification and refresh every 5 seconds
    useTokenVerification();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !isAuthenticated()) {
            router.push("/login");
        }
    }, [router, mounted]);

    // Don't render anything until mounted to avoid hydration mismatch
    if (!mounted) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <PacmanLoader color="#a78bfa" size={40} />
            </div>
        );
    }

    if (!isAuthenticated()) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <PacmanLoader color="#a78bfa" size={40} />
            </div>
        );
    }

    return <>{children}</>;
}
