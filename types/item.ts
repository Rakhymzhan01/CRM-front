export interface Item {
  id: number
  shopId: number
  name: string
  brand: string
  category: string
  size: string
  purchasePrice: number
  salePrice: number
  photoUrl: string
  createdAt: string
  updatedAt: string
}

export interface ItemFormData {
  name: string
  brand: string
  category: string
  size: string
  purchasePrice: number
  salePrice: number
  photoUrl: string
}
