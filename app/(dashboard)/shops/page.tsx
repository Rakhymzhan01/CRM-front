"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { mockDataService } from "@/lib/mock-data"
import type { Shop } from "@/types/shop"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"

const shopFormSchema = z.object({
  name: z.string().min(2, { message: "Shop name must be at least 2 characters" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters" }),
})

type ShopFormValues = z.infer<typeof shopFormSchema>

export default function ShopsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [shops, setShops] = useState<Shop[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ShopFormValues>({
    resolver: zodResolver(shopFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const fetchShops = async () => {
    try {
      setIsLoading(true)
      let fetchedShops: Shop[] = []

      if (user?.role === "admin") {
        fetchedShops = await mockDataService.getShops()
      } else if (user?.role === "owner") {
        fetchedShops = await mockDataService.getShopsByOwner(user.id)
      }

      setShops(fetchedShops)
    } catch (error) {
      console.error("Error fetching shops:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchShops()
    }
  }, [user])

  const onSubmit = async (data: ShopFormValues) => {
    try {
      setIsSubmitting(true)

      // Create shop with owner ID if user is owner
      const shopData = {
        ...data,
        ownerId: user?.role === "owner" ? user.id : 2, // Default to owner ID 2 if admin
      }

      await mockDataService.createShop(shopData)

      toast({
        title: "Success",
        description: "Shop created successfully",
      })

      form.reset()
      setIsDialogOpen(false)
      fetchShops()
    } catch (error) {
      console.error("Error creating shop:", error)
      toast({
        title: "Error",
        description: "Failed to create shop",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Shops</h2>
          <p className="text-muted-foreground">Manage your retail locations</p>
        </div>

        {(user?.role === "admin" || user?.role === "owner") && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Icons.add className="mr-2 h-4 w-4" />
                Add Shop
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Shop</DialogTitle>
                <DialogDescription>Add a new retail location to your management system.</DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shop Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter shop name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter shop description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Shop"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Icons.spinner className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : shops.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Icons.shop className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No shops found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new shop.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <Card key={shop.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle>{shop.name}</CardTitle>
                <CardDescription className="line-clamp-2">{shop.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-500">
                  <Icons.user className="mr-1 h-4 w-4" />
                  <span>Owner ID: {shop.ownerId}</span>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 px-6 py-3">
                <Button variant="ghost" className="w-full" asChild>
                  <a href={`/shops/${shop.id}`}>
                    <Icons.arrowRight className="mr-2 h-4 w-4" />
                    Manage Shop
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
