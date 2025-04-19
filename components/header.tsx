"use client"

import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"

// Update the Header component to accept a devUser prop
export function Header({ devUser }: { devUser?: any }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  // Use devUser if provided (for development mode)
  const activeUser = devUser || user

  // Format the pathname for display
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard"

    // Remove leading slash and capitalize
    const path = pathname.split("/")[1]
    return path.charAt(0).toUpperCase() + path.slice(1)
  }

  // Handle the case when user is null
  const displayName = activeUser
    ? `${activeUser.firstName?.charAt(0) || ""}${activeUser.lastName?.charAt(0) || ""}`
    : "DV"
  const fullName = activeUser ? `${activeUser.firstName || ""} ${activeUser.lastName || ""}`.trim() : "Dev User"
  const email = activeUser?.email || "dev@example.com"

  const handleLogout = () => {
    // If in dev mode, clear dev-specific storage
    if (process.env.NODE_ENV !== "production" && localStorage.getItem("auth_token") === "dev-token") {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("dev_user")
      window.location.href = "/login"
      return
    }

    // Otherwise use the normal logout
    logout()
  }

  // Rest of the component remains the same, but use handleLogout instead of logout
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
      <h1 className="text-lg font-semibold md:text-xl">{getPageTitle()}</h1>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                {displayName}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{fullName}</p>
                <p className="text-xs leading-none text-gray-500">{email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <Icons.logout className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
