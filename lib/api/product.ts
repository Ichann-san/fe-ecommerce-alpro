import { products } from "@/fakedata/fakeproduct"
import { Category, Product } from "@/types/product"

export const ProductAPI = {
  getAll: async (): Promise<Product[]> => {
    return products
  },

  getById: async (id: string): Promise<Product | undefined> => {
    return products.find((p) => p.id === Number(id))
  },

  getCategories: async (): Promise<Category[]> => {
    return [...new Set(products.map((p) => p.category))].map((name, index) => ({
      id: index + 1,
      name,
    }))
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    return products.filter((p) => p.category === category)
  },
}