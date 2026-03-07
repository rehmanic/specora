"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Layout({ children }) {
    return (
        <ProtectedRoute>
            <AppLayout>
                {children}
            </AppLayout>
        </ProtectedRoute>
    );
}
