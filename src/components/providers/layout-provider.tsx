"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/auth-context";

export default function LayoutProvider({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
                <Toaster richColors closeButton />
            </ThemeProvider>
        </AuthProvider>
    );
}