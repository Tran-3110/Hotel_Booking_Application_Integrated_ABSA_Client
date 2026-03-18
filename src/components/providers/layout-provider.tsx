"use client";

import {ThemeProvider} from "@/components/providers/theme-provider";
import {Toaster} from "sonner";
import {AuthProvider} from "@/context/auth-context";
import {Provider} from "react-redux";
import {store} from "@/store/store";

export default function LayoutProvider({children}: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AuthProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster richColors closeButton/>
                </ThemeProvider>
            </AuthProvider>
        </Provider>
    );
}