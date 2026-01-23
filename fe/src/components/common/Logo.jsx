"use client";

import { cn } from "@/lib/utils";

export function Logo({ className, showText = true, size = "default" }) {
    const sizes = {
        sm: { icon: "w-8 h-8", text: "text-lg" },
        default: { icon: "w-10 h-10", text: "text-xl" },
        lg: { icon: "w-14 h-14", text: "text-2xl" },
        xl: { icon: "w-20 h-20", text: "text-3xl" },
    };

    const currentSize = sizes[size] || sizes.default;

    return (
        <div className={cn("flex items-center gap-3", className)}>
            {/* Logo Icon - Abstract "S" shape with gradient */}
            <div
                className={cn(
                    "relative flex items-center justify-center rounded-xl gradient-primary shadow-lg",
                    currentSize.icon
                )}
            >
                {/* Glowing effect */}
                <div className="absolute inset-0 rounded-xl gradient-primary opacity-50 blur-md" />

                {/* Icon shape */}
                <svg
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10 w-3/5 h-3/5"
                >
                    {/* Stylized "S" for Specora */}
                    <path
                        d="M28 12C28 12 24 8 18 8C12 8 8 12 8 16C8 20 12 22 18 24C24 26 28 28 28 32C28 36 24 40 18 40C12 40 8 36 8 36"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                    />
                    {/* Accent dot */}
                    <circle cx="32" cy="8" r="4" fill="white" opacity="0.8" />
                </svg>
            </div>

            {/* Logo Text */}
            {showText && (
                <span
                    className={cn(
                        "font-display font-bold tracking-tight",
                        currentSize.text
                    )}
                    style={{ fontFamily: "var(--font-display)" }}
                >
                    <span className="gradient-text">Spec</span>
                    <span className="text-foreground">ora</span>
                </span>
            )}
        </div>
    );
}

export function LogoMark({ className, size = "default" }) {
    return <Logo className={className} showText={false} size={size} />;
}

export default Logo;
