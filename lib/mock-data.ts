import type { User } from "@/types/user"
import type { Shop } from "@/types/shop"
import type { Employee } from "@/types/employee"
import type { Item } from "@/types/item"

// Mock Users
export const mockUsers: User[] = [
  {
    id: 1,
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    role: "admin",
  },
  {
    id: 2,
    firstName: "Shop",
    lastName: "Owner",
    email: "owner@example.com",
    role: "owner",
  },
  {
    id: 3,
    firstName: "Regular",
    lastName: "User",
    email: "user@example.com",
    role: "user",
  },
]

// Mock Shops
export const mockShops: Shop[] = [
  {
    id: 1,
    name: "Downtown Boutique",
    description: "A trendy clothing store in the heart of downtown",
    ownerId: 2,
  },
  {
    id: 2,
    name: "Suburban Outlet",
    description: "Large outlet store with a wide variety of products",
    ownerId: 2,
  },
  {
    id: 3,
    name: "Mall Kiosk",
    description: "Small kiosk specializing in accessories",
    ownerId: 2,
  },
  {
    id: 4,
    name: "Online Store",
    description: "E-commerce platform for digital sales",
    ownerId: 2,
  },
]

// Mock Employees
export const mockEmployees: Employee[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    shopId: 1,
    role: "manager",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    shopId: 1,
    role: "employee",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    shopId: 2,
    role: "manager",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    shopId: 2,
    role: "employee",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david@example.com",
    shopId: 3,
    role: "employee",
  },
  {
    id: 6,
    name: "Jessica Taylor",
    email: "jessica@example.com",
    shopId: 4,
    role: "manager",
  },
  {
    id: 7,
    name: "Ryan Martinez",
    email: "ryan@example.com",
    shopId: 4,
    role: "employee",
  },
]

// Mock Items
export const mockItems: Item[] = [
  {
    id: 1,
    shopId: 1,
    name: "Designer T-Shirt",
    brand: "FashionBrand",
    category: "shirts",
    size: "M",
    purchasePrice: 15.99,
    salePrice: 29.99,
    photoUrl: "https://placehold.co/300x300",
    createdAt: new Date(2023, 1, 15).toISOString(),
    updatedAt: new Date(2023, 1, 15).toISOString(),
  },
  {
    id: 2,
    shopId: 1,
    name: "Slim Fit Jeans",
    brand: "DenimCo",
    category: "pants",
    size: "32",
    purchasePrice: 25.5,
    salePrice: 49.99,
    photoUrl: "https://placehold.co/300x300",
    createdAt: new Date(2023, 2, 10).toISOString(),
    updatedAt: new Date(2023, 2, 10).toISOString(),
  },
  {
    id: 3,
    shopId: 1,
    name: "Leather Jacket",
    brand: "UrbanStyle",
    category: "jackets",
    size: "L",
    purchasePrice: 89.99,
    salePrice: 149.99,
    photoUrl: "https://placehold.co/300x300",
    createdAt: new Date(2023, 3, 5).toISOString(),
    updatedAt: new Date(2023, 3, 5).toISOString(),
  },
  {
    id: 4,
    shopId: 2,
    name: "Running Shoes",
    brand: "SportyStep",
    category: "shoes",
    size: "42",
    purchasePrice: 45.0,
    salePrice: 79.99,
    photoUrl: "https://placehold.co/300x300",
    createdAt: new Date(2023, 2, 20).toISOString(),
    updatedAt: new Date(2023, 2, 20).toISOString(),
  },
  {
    id: 5,
    shopId: 2,
    name: "Backpack",
    brand: "TravelGear",
    category: "accessories",
    size: "One Size",
    purchasePrice: 29.99,
    salePrice: 59.99,
    photoUrl: "https://placehold.co/300x300",
    createdAt: new Date(2023, 3, 15).toISOString(),
    updatedAt: new Date(2023, 3, 15).toISOString(),
  },
  {
    id: 6,
    shopId: 3,
    name: "Silver Necklace",
    brand: "GlamJewels",
    category: "jewelry",
    size: "One Size",
    purchasePrice: 12.5,
    salePrice: 24.99,
    photoUrl: "https://placehold.co/300x300",
    createdAt: new Date(2023, 4, 1).toISOString(),
    updatedAt: new Date(2023, 4, 1).toISOString(),
  },
  {
    id: 7,
    shopId: 3,
    name: "Sunglasses",
    brand: "SunStyle",
    category: "accessories",
    size: "One Size",
    purchasePrice: 9.99,
    salePrice: 19.99,
    photoUrl: "https://placehold.co/300x300",
    createdAt: new Date(2023, 4, 10).toISOString(),
    updatedAt: new Date(2023, 4, 10).toISOString(),
  },
  {
    id: 8,
    shopId: 4,
    name: "Wireless Headphones",
    brand: "AudioTech",
    category: "electronics",
    size: "One Size",
    purchasePrice: 45.99,
    salePrice: 89.99,
    photoUrl: "https://placehold.co/300x300",
    createdAt: new Date(2023, 5, 5).toISOString(),
    updatedAt: new Date(2023, 5, 5).toISOString(),
  },
  {
    id: 9,
    shopId: 4,
    name: "Smartphone Case",
    brand: "TechProtect",
    category: "accessories",
    size: "iPhone 13",
    purchasePrice: 8.99,
    salePrice: 19.99,
    photoUrl: "https://placehold.co/300x300",
    createdAt: new Date(2023, 5, 10).toISOString(),
    updatedAt: new Date(2023, 5, 10).toISOString(),
  },
]

// Helper function to get the next available ID for a collection
function getNextId<T extends { id: number }>(items: T[]): number {
  return Math.max(0, ...items.map((item) => item.id)) + 1
}

// Mock data service to replace API calls
class MockDataService {
  private users: User[] = [...mockUsers]
  private shops: Shop[] = [...mockShops]
  private employees: Employee[] = [...mockEmployees]
  private items: Item[] = [...mockItems]

  // Simulate async behavior
  private async delay(ms = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // User methods
  async getUsers(): Promise<User[]> {
    await this.delay()
    return [...this.users]
  }

  async createUser(userData: Omit<User, "id">): Promise<User> {
    await this.delay()
    const newUser = {
      ...userData,
      id: getNextId(this.users),
    }
    this.users.push(newUser)
    return newUser
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    await this.delay()
    const index = this.users.findIndex((user) => user.id === id)
    if (index === -1) {
      throw new Error("User not found")
    }
    this.users[index] = { ...this.users[index], ...userData }
    return this.users[index]
  }

  async deleteUser(id: number): Promise<void> {
    await this.delay()
    const index = this.users.findIndex((user) => user.id === id)
    if (index === -1) {
      throw new Error("User not found")
    }
    this.users.splice(index, 1)
  }

  async getUserByEmail(email: string): Promise<User | null> {
    await this.delay()
    const user = this.users.find((user) => user.email === email)
    return user || null
  }

  // Shop methods
  async getShops(): Promise<Shop[]> {
    await this.delay()
    return [...this.shops]
  }

  async getShopsByOwner(ownerId: number): Promise<Shop[]> {
    await this.delay()
    return this.shops.filter((shop) => shop.ownerId === ownerId)
  }

  async getShopById(id: number): Promise<Shop | null> {
    await this.delay()
    const shop = this.shops.find((shop) => shop.id === id)
    return shop || null
  }

  async createShop(shopData: Omit<Shop, "id">): Promise<Shop> {
    await this.delay()
    const newShop = {
      ...shopData,
      id: getNextId(this.shops),
    }
    this.shops.push(newShop)
    return newShop
  }

  async updateShop(id: number, shopData: Partial<Shop>): Promise<Shop> {
    await this.delay()
    const index = this.shops.findIndex((shop) => shop.id === id)
    if (index === -1) {
      throw new Error("Shop not found")
    }
    this.shops[index] = { ...this.shops[index], ...shopData }
    return this.shops[index]
  }

  async deleteShop(id: number): Promise<void> {
    await this.delay()
    const index = this.shops.findIndex((shop) => shop.id === id)
    if (index === -1) {
      throw new Error("Shop not found")
    }
    this.shops.splice(index, 1)
    // Also delete related employees and items
    this.employees = this.employees.filter((employee) => employee.shopId !== id)
    this.items = this.items.filter((item) => item.shopId !== id)
  }

  // Employee methods
  async getEmployeesByShop(shopId: number): Promise<Employee[]> {
    await this.delay()
    return this.employees.filter((employee) => employee.shopId === shopId)
  }

  async createEmployee(employeeData: Omit<Employee, "id">): Promise<Employee> {
    await this.delay()
    const newEmployee = {
      ...employeeData,
      id: getNextId(this.employees),
    }
    this.employees.push(newEmployee)
    return newEmployee
  }

  async updateEmployee(id: number, employeeData: Partial<Employee>): Promise<Employee> {
    await this.delay()
    const index = this.employees.findIndex((employee) => employee.id === id)
    if (index === -1) {
      throw new Error("Employee not found")
    }
    this.employees[index] = { ...this.employees[index], ...employeeData }
    return this.employees[index]
  }

  async deleteEmployee(id: number): Promise<void> {
    await this.delay()
    const index = this.employees.findIndex((employee) => employee.id === id)
    if (index === -1) {
      throw new Error("Employee not found")
    }
    this.employees.splice(index, 1)
  }

  // Item methods
  async getItemsByShop(shopId: number): Promise<Item[]> {
    await this.delay()
    return this.items.filter((item) => item.shopId === shopId)
  }

  async createItem(itemData: Omit<Item, "id" | "createdAt" | "updatedAt">): Promise<Item> {
    await this.delay()
    const now = new Date().toISOString()
    const newItem = {
      ...itemData,
      id: getNextId(this.items),
      createdAt: now,
      updatedAt: now,
    }
    this.items.push(newItem)
    return newItem
  }

  async updateItem(id: number, itemData: Partial<Omit<Item, "id" | "createdAt" | "updatedAt">>): Promise<Item> {
    await this.delay()
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error("Item not found")
    }
    this.items[index] = {
      ...this.items[index],
      ...itemData,
      updatedAt: new Date().toISOString(),
    }
    return this.items[index]
  }

  async deleteItem(id: number): Promise<void> {
    await this.delay()
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error("Item not found")
    }
    this.items.splice(index, 1)
  }

  // Authentication methods
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await this.delay()
    // In a real app, we would validate the password
    // Here we just check if the email exists
    const user = await this.getUserByEmail(email)
    if (!user) {
      throw new Error("Invalid email or password")
    }
    return {
      user,
      token: `mock-token-${user.id}`,
    }
  }

  async getCurrentUser(): Promise<User | null> {
    await this.delay()
    // In a real app, we would validate the token
    // Here we just return the user based on the stored user ID
    const userId = localStorage.getItem("userId")
    if (!userId) {
      return null
    }
    const user = this.users.find((user) => user.id === Number.parseInt(userId))
    return user || null
  }
}

// Export a singleton instance
export const mockDataService = new MockDataService()
