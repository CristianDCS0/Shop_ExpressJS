export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    img: string;
    created_at: Date;
    updated_at: Date;
}