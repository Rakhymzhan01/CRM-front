"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { LoadingScreen } from "@/components/loading-screen"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading, user } = useAuth()
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Show loading screen while checking authentication
  if (!isMounted || isLoading) {
    return <LoadingScreen />
  }

  // If we're in development mode and using the dev login, create a mock user
  if (process.env.NODE_ENV !== "production" && localStorage.getItem("auth_token") === "dev-token") {
    // Try to get the dev user from localStorage
    let devUser = null
    try {
      const storedUser = localStorage.getItem("dev_user")
      if (storedUser) {
        devUser = JSON.parse(storedUser)
      }
    } catch (e) {
      console.error("Error parsing dev user:", e)
    }

    return (
      <div className="flex h-screen overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="bg-yellow-100 p-4 text-yellow-800 text-center">
            <p className="font-medium">Development Mode - Backend Not Connected</p>
            <p className="text-sm">You are viewing the UI without a backend connection.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                localStorage.removeItem("auth_token")
                localStorage.removeItem("dev_user")
                router.push("/login")
              }}
            >
              <Icons.logout className="mr-2 h-4 w-4" />
              Exit Dev Mode
            </Button>
          </div>
          <div className="flex h-screen overflow-hidden">
            <Sidebar devUser={devUser} />
            <div className="flex flex-col flex-1 overflow-hidden">
              <Header devUser={devUser} />
              <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
                <div className="mx-auto max-w-7xl">{children}</div>
              </main>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
