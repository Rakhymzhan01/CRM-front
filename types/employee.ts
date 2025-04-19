export interface Employee {
  id: number
  name: string
  email: string
  shopId: number
  role: string
}

export interface EmployeeFormData {
  name: string
  email: string
  password?: string
  role: string
}
