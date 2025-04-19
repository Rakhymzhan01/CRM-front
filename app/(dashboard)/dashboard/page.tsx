"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { mockDataService } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import type { Shop } from "@/types/shop"
import type { Employee } from "@/types/employee"
import type { Item } from "@/types/item"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    shops: 0,
    employees: 0,
    items: 0,
    totalInventoryValue: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)

        // Fetch shops based on user role
        let shops: Shop[] = []
        if (user?.role === "admin") {
          shops = await mockDataService.getShops()
        } else if (user?.role === "owner") {
          shops = await mockDataService.getShopsByOwner(user.id)
        }

        // Fetch employees and items for each shop
        let allEmployees: Employee[] = []
        let allItems: Item[] = []

        for (const shop of shops) {
          const employees = await mockDataService.getEmployeesByShop(shop.id)
          allEmployees = [...allEmployees, ...employees]

          const items = await mockDataService.getItemsByShop(shop.id)
          allItems = [...allItems, ...items]
        }

        // Calculate total inventory value
        const totalValue = allItems.reduce((sum, item) => sum + item.salePrice, 0)

        setStats({
          shops: shops.length,
          employees: allEmployees.length,
          items: allItems.length,
          totalInventoryValue: totalValue,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user])

  // Stat cards data
  const statCards = [
    {
      title: "Total Shops",
      value: isLoading ? "-" : stats.shops,
      icon: "shop",
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Total Employees",
      value: isLoading ? "-" : stats.employees,
      icon: "employee",
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Inventory Items",
      value: isLoading ? "-" : stats.items,
      icon: "item",
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Inventory Value",
      value: isLoading ? "-" : `$${stats.totalInventoryValue.toFixed(2)}`,
      icon: "tag",
      color: "bg-amber-100 text-amber-700",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome back, {user?.firstName}!</h2>
        <p className="text-muted-foreground">Here's an overview of your shop management system.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = Icons[stat.icon as keyof typeof Icons]

          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? <Icons.spinner className="h-5 w-5 animate-spin" /> : stat.value}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Icons.spinner className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Your recent activity will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Card className="cursor-pointer hover:bg-gray-50" onClick={() => (window.location.href = "/shops")}>
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <Icons.shop className="h-6 w-6 text-emerald-600 mb-2" />
                  <span className="text-sm font-medium">Manage Shops</span>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:bg-gray-50" onClick={() => (window.location.href = "/employees")}>
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <Icons.employee className="h-6 w-6 text-blue-600 mb-2" />
                  <span className="text-sm font-medium">Manage Employees</span>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:bg-gray-50" onClick={() => (window.location.href = "/items")}>
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <Icons.item className="h-6 w-6 text-purple-600 mb-2" />
                  <span className="text-sm font-medium">Manage Inventory</span>
                </CardContent>
              </Card>
              {user?.role === "admin" && (
                <Card className="cursor-pointer hover:bg-gray-50" onClick={() => (window.location.href = "/users")}>
                  <CardContent className="flex flex-col items-center justify-center p-4">
                    <Icons.user className="h-6 w-6 text-amber-600 mb-2" />
                    <span className="text-sm font-medium">Manage Users</span>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
