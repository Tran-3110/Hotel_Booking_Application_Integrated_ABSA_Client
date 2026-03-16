"use client";

import { AuthUser } from "@/common/types/auth";
import { createContext, useState } from "react";
import Cookies from "js-cookie"

interface AuthContextType {
    user: AuthUser | null
    isLoading: boolean

    login: (data: AuthUser) => void
    logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [{ user, isLoading }, setAuthState] = useState<{
        user: AuthUser | null,
        isLoading: boolean
    }>(() => {
        if (typeof window !== "undefined") {
            const savedUser = localStorage.getItem("user_data")
            //Save and get jwt token from 1st party Cookie
            const token = Cookies.get("token")
            if (savedUser && token) {
                try {
                    return { user: JSON.parse(savedUser), isLoading: false }
                }
                catch {
                    return { user: null, isLoading: false }
                }
            }
        }
        return { user: null, isLoading: false }
    })

    const login = (data: AuthUser) => {
        if (!data.jwtToken) return
        setAuthState({ user: data, isLoading: false })
        Cookies.set("token", data.jwtToken, { expires: 7 }) //Expired in 7 days
        localStorage.setItem("user_data", JSON.stringify(data))
    }

    const logout = () => {
        setAuthState({ user: null, isLoading: false })
        Cookies.remove("token")
        localStorage.removeItem("user_data")
        window.location.href = "/"
    }

    return <AuthContext.Provider value={{ user, login, logout, isLoading }}>
        {children}
    </AuthContext.Provider>
}