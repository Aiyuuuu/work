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
