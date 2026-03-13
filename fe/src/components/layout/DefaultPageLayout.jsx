import { cn } from "@/lib/utils";

export function DefaultPageLayout({ children }) {
    return (
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <div className="mx-auto w-full h-full max-w-[1400px]">
                {children}
            </div>
        </div>
    );
}
