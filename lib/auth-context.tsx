"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { User } from "@/types/user"
import { mockDataService } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Skip auth check on login page
        if (pathname === "/login") {
          setIsLoading(false)
          return
        }

        const currentUser = await mockDataService.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Auth check error:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname])

  useEffect(() => {
    if (!isLoading) {
      const publicRoutes = ["/login"]

      if (!user && !publicRoutes.includes(pathname)) {
        router.push("/login")
      } else if (user && publicRoutes.includes(pathname)) {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const { user, token } = await mockDataService.login(email, password)

      // Store user ID in localStorage for persistence
      localStorage.setItem("userId", user.id.toString())

      setUser(user)
      router.push("/dashboard")

      toast({
        title: "Login successful",
        description: `Welcome back, ${user.firstName}!`,
      })
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("userId")
    setUser(null)
    router.push("/login")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
