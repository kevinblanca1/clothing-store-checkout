/**
 * Raw fakestoreapi.com `/products` shape (id, title, price, ...).
 */
export interface ApiProductFixture {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}


export const products: ApiProductFixture[] = [
  {
    id: 1,
    title: "Classic Cotton Tee",
    price: 24.99,
    description: "A breathable everyday t-shirt made from 100% combed cotton.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/classic-tee.jpg",
  },
  {
    id: 2,
    title: "Wool Blend Hoodie",
    price: 59.5,
    description: "Cozy mid-weight hoodie with a soft brushed interior.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/wool-hoodie.jpg",
  },
  {
    id: 3,
    title: "Slim Fit Chinos",
    price: 42,
    description: "Versatile stretch chinos that go from desk to dinner.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/chinos.jpg",
  },
];

export const firstProduct = products[0];
