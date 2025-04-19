"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { mockDataService } from "@/lib/mock-data"
import type { Item } from "@/types/item"
import type { Shop } from "@/types/shop"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export default function ItemsPage() {
  const { user } = useAuth()
  const [shops, setShops] = useState<Shop[]>([])
  const [itemsByShop, setItemsByShop] = useState<Record<number, Item[]>>({})
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

        // Fetch items for each shop
        const itemsData: Record<number, Item[]> = {}

        for (const shop of fetchedShops) {
          const items = await mockDataService.getItemsByShop(shop.id)
          itemsData[shop.id] = items
        }

        setItemsByShop(itemsData)
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Inventory</h2>
        <p className="text-muted-foreground">Manage inventory items across all your shops</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Icons.spinner className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : shops.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Icons.shop className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No shops found</h3>
          <p className="mt-1 text-sm text-gray-500">Create a shop first to manage inventory.</p>
          <Button variant="outline" className="mt-4" onClick={() => (window.location.href = "/shops")}>
            Go to Shops
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {shops.map((shop) => {
            const items = itemsByShop[shop.id] || []

            return (
              <Card key={shop.id}>
                <CardHeader>
                  <CardTitle>{shop.name}</CardTitle>
                  <CardDescription>{shop.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <p className="text-sm text-gray-500">No inventory items found for this shop.</p>
                    </div>
                  ) : (
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Brand</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Purchase Price</TableHead>
                            <TableHead>Sale Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>{item.brand}</TableCell>
                              <TableCell className="capitalize">{item.category}</TableCell>
                              <TableCell>{item.size}</TableCell>
                              <TableCell>${item.purchasePrice.toFixed(2)}</TableCell>
                              <TableCell>${item.salePrice.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="bg-gray-50 border-t">
                  <Button variant="ghost" className="w-full" asChild>
                    <a href={`/shops/${shop.id}?tab=inventory`}>
                      <Icons.arrowRight className="mr-2 h-4 w-4" />
                      Manage Inventory
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
