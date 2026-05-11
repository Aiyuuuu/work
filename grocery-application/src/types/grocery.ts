export type GroceryItem = {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  tag: string;
};

export type CartItem = GroceryItem & { quantity: number };

// MySQL Configuration and Result Types
export interface MySqlConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
  connectionLimit: number;
}

export interface QueryResult<T> {
  rows: T[];
}

export interface ExecResult {
  affectedRows: number;
  insertId: number;
}
