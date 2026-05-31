import { apiClient } from "@/api/client";
import type { ApiProduct, Product } from "@/types/product";

function mapProduct(api: ApiProduct): Product {
  return {
    id: api.id,
    name: api.title,
    price: api.price,
    description: api.description,
    category: api.category,
    image: api.image,
  };
}

export async function getProducts(): Promise<Product[]> {
  const { data } = await apiClient.get<ApiProduct[]>("/products");
  return data.map(mapProduct);
}

export async function getProductById(id: number): Promise<Product> {
  const { data } = await apiClient.get<ApiProduct | null>(`/products/${id}`);

  if (!data || data.id == null) {
    throw new Error("Product not found");
  }
  return mapProduct(data);
}
