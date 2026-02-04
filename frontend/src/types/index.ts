export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: string; //django envía decimales como strings
    stock: number;
    image: string | null;
    category: Category;
}

