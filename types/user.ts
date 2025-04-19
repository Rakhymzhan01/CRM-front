export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
}

export interface UserFormData {
  firstName: string
  lastName: string
  email: string
  password?: string
  role: string
}
