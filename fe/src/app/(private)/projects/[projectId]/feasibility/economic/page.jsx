"use client";

import { DollarSign } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute allowedRoles={["manager", "requirements_engineer", "developer"]}>
            <main className="w-full p-6 lg:p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold font-display">Economic Feasibility</h1>
                            <p className="text-muted-foreground mt-1">
                                Analyze cost-benefit and financial viability
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                            <DollarSign className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold font-display mb-2">Coming Soon</h3>
                        <p className="text-muted-foreground max-w-md">
                            This section is currently under development. Check back later for updates.
                        </p>
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    );
}
