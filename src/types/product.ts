/** Shape returned by https://fakestoreapi.com/products (and /products/:id). */
export interface ApiProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

/** App-facing product model (we alias `title` -> `name` for clarity). */
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export type SortKey = "relevance" | "name" | "price" | "category";
export type SortDir = "asc" | "desc";
