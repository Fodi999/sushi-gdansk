// Типы для админ панели
export interface AdminStats {
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  totalProducts: number
  activeUsers: number
  newUsersThisMonth: number
  adminCount: number
}

export interface Order {
  id: string
  status: string
  total: number
  createdAt: string
  deliveryAddress: string
  phone: string
  notes?: string
  user: {
    name: string
    email: string
    phone?: string
  }
  orderItems: {
    id: string
    quantity: number
    price: number
    product: {
      name: string
    }
  }[]
}

export interface Product {
  id: string
  name: string
  price: number
  weight: string
  available: boolean
  category: {
    name: string
  }
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  _count: {
    orders: number
  }
}

export interface StockItem {
  id: string
  ingredientId: string
  quantity: number
  unit: string
  grossWeight?: number
  netWeight?: number
  purchasePrice?: number
  supplier?: string
  expiryDate?: string
  receivedDate: string
  ingredient: {
    id: string
    name: string
    category: string
    unit: string
  }
}

export interface StockMovement {
  id: string
  type: string
  productName: string
  quantity: number
  unit: string
  price?: number
  supplier?: string
  notes?: string
  createdBy?: string
  createdAt: string
}

export interface Ingredient {
  id: string
  name: string
  category: string
  unit: string
  currentStock: number
  minStock: number
  purchasePrice: number
  stockItems?: StockItem[]
}
