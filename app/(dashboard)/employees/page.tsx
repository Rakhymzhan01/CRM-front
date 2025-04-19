"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { mockDataService } from "@/lib/mock-data"
import type { Employee } from "@/types/employee"
import type { Shop } from "@/types/shop"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export default function EmployeesPage() {
  const { user } = useAuth()
  const [shops, setShops] = useState<Shop[]>([])
  const [employeesByShop, setEmployeesByShop] = useState<Record<number, Employee[]>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch shops based on user role
        let fetchedShops: Shop[] = []
        if (user?.role === "admin") {
          fetchedShops = await mockDataService.getShops()
        } else if (user?.role === "owner") {
          fetchedShops = await mockDataService.getShopsByOwner(user.id)
        }

        setShops(fetchedShops)

        // Fetch employees for each shop
        const employeesData: Record<number, Employee[]> = {}

        for (const shop of fetchedShops) {
          const employees = await mockDataService.getEmployeesByShop(shop.id)
          employeesData[shop.id] = employees
        }

        setEmployeesByShop(employeesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  // Redirect if not admin or owner
  if (user && user.role !== "admin" && user.role !== "owner") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Icons.alertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Access Denied</h3>
        <p className="mt-1 text-sm text-gray-500">You don't have permission to access this page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Employees</h2>
        <p className="text-muted-foreground">Manage employees across all your shops</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Icons.spinner className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : shops.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Icons.shop className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No shops found</h3>
          <p className="mt-1 text-sm text-gray-500">Create a shop first to manage employees.</p>
          <Button variant="outline" className="mt-4" onClick={() => (window.location.href = "/shops")}>
            Go to Shops
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {shops.map((shop) => {
            const employees = employeesByShop[shop.id] || []

            return (
              <Card key={shop.id}>
                <CardHeader>
                  <CardTitle>{shop.name}</CardTitle>
                  <CardDescription>{shop.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {employees.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <p className="text-sm text-gray-500">No employees found for this shop.</p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {employees.map((employee) => (
                            <TableRow key={employee.id}>
                              <TableCell className="font-medium">{employee.name}</TableCell>
                              <TableCell>{employee.email}</TableCell>
                              <TableCell className="capitalize">{employee.role}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="bg-gray-50 border-t">
                  <Button variant="ghost" className="w-full" asChild>
                    <a href={`/shops/${shop.id}?tab=employees`}>
                      <Icons.arrowRight className="mr-2 h-4 w-4" />
                      Manage Employees
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
