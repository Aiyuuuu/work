export type GroceryItem = {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  tag: string;
};

export type CartItem = GroceryItem & { quantity: number };
