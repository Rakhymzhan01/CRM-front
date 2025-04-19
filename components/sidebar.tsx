"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Icons } from "@/components/icons"
import { useMobile } from "@/hooks/use-mobile"

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    href: string
    title: string
    icon: keyof typeof Icons
    roles?: string[]
  }[]
}

// Update the Sidebar component to accept a devUser prop
export function Sidebar({ devUser }: { devUser?: any }) {
  const { user } = useAuth()
  const isMobile = useMobile()
  const [open, setOpen] = useState(false)

  // Use devUser if provided (for development mode)
  const activeUser = devUser || user

  // Close the mobile sidebar when navigating
  const pathname = usePathname()
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const sidebarItems = [
    {
      href: "/dashboard",
      title: "Dashboard",
      icon: "dashboard",
    },
    {
      href: "/shops",
      title: "Shops",
      icon: "shop",
    },
    {
      href: "/employees",
      title: "Employees",
      icon: "employee",
      roles: ["admin", "owner"],
    },
    {
      href: "/items",
      title: "Inventory",
      icon: "item",
    },
    {
      href: "/users",
      title: "Users",
      icon: "user",
      roles: ["admin"],
    },
  ]

  // Filter items based on user role
  const filteredItems = sidebarItems.filter(
    (item) => !item.roles || (activeUser && item.roles.includes(activeUser.role)),
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40 md:hidden">
            <Icons.shoppingBag className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SidebarNav items={filteredItems} className="p-2" />
        </SheetContent>
      </Sheet>
    )
  }

  return <SidebarNav items={filteredItems} className="hidden md:block" />
}

function SidebarNav({ items, className, ...props }: SidebarNavProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <div className={cn("flex h-screen w-60 flex-col border-r bg-white", className)} {...props}>
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Icons.shoppingBag className="h-6 w-6 text-emerald-600" />
          <span className="font-semibold">Shop CRM</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {items.map((item) => {
            const Icon = Icons[item.icon]
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100",
                  isActive ? "bg-gray-100 text-emerald-600" : "text-gray-700",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t p-4">
        <Button variant="ghost" className="w-full justify-start gap-3 text-gray-700" onClick={logout}>
          <Icons.logout className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
