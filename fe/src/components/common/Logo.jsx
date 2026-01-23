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
            {showText ? (
                <img
                    src="/specora_logo.svg"
                    alt="Specora"
                    className={cn("h-auto w-auto max-h-12", currentSize.icon.replace("w-", "min-w-"))}
                    // Adjusting class to handle resizing gracefully, assuming the SVG has its own aspect ratio
                    style={{ height: 'auto', width: 'auto' }}
                />
            ) : (
                <img
                    src="/specora_favicon_circle.svg"
                    alt="Specora"
                    className={currentSize.icon}
                />
            )}
        </div>
    );
}

export function LogoMark({ className, size = "default" }) {
    return <Logo className={className} showText={false} size={size} />;
}


export default Logo;
// Force HMR update
