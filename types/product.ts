export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string | null;
    inventory: number;
    visible: boolean;
    category_id: string;
    category_name: string;
    supplier: string | null;
    description?: string;
  }