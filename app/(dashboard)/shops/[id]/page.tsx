"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { mockDataService } from "@/lib/mock-data"
import type { Shop } from "@/types/shop"
import type { Employee } from "@/types/employee"
import type { Item } from "@/types/item"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from "@/components/icons"
import { EmployeeList } from "@/components/employee-list"
import { ItemList } from "@/components/item-list"
import { useToast } from "@/hooks/use-toast"

export default function ShopDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const shopId = Number.parseInt(params.id as string)

  const [shop, setShop] = useState<Shop | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setIsLoading(true)

        // Fetch shop details
        const shopData = await mockDataService.getShopById(shopId)
        setShop(shopData)

        if (shopData) {
          // Fetch employees for this shop
          const employeesData = await mockDataService.getEmployeesByShop(shopId)
          setEmployees(employeesData)

          // Fetch items for this shop
          const itemsData = await mockDataService.getItemsByShop(shopId)
          setItems(itemsData)
        }
      } catch (error) {
        console.error("Error fetching shop data:", error)
        toast({
          title: "Error",
          description: "Failed to load shop data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (shopId) {
      fetchShopData()
    }
  }, [shopId, toast])

  const handleEmployeeUpdate = async () => {
    const updatedEmployees = await mockDataService.getEmployeesByShop(shopId)
    setEmployees(updatedEmployees)
  }

  const handleItemUpdate = async () => {
    const updatedItems = await mockDataService.getItemsByShop(shopId)
    setItems(updatedItems)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Icons.spinner className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Icons.alertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Shop not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The shop you're looking for doesn't exist or you don't have access.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/shops")}>
          Back to Shops
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" className="mb-2" onClick={() => router.push("/shops")}>
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            Back to Shops
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">{shop.name}</h2>
          <p className="text-muted-foreground">{shop.description}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employees.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{items.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${items.reduce((sum, item) => sum + item.salePrice, 0).toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Shop Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Shop ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{shop.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Owner ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{shop.ownerId}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Employees</CardTitle>
              <CardDescription>Manage employees for this shop</CardDescription>
            </CardHeader>
            <CardContent>
              <EmployeeList employees={employees} shopId={shopId} onUpdate={handleEmployeeUpdate} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>Manage inventory items for this shop</CardDescription>
            </CardHeader>
            <CardContent>
              <ItemList items={items} shopId={shopId} onUpdate={handleItemUpdate} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
