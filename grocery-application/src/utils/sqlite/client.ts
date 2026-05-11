import fs from "fs";
import path from "path";
import type { Database as SqliteDatabase } from "better-sqlite3";
import type { ExecResult, QueryResult } from "@/types/grocery";

type DbParam = string | number | boolean | Date | null;

const sqlitePath = process.env.SQLITE_PATH ?? path.join(process.cwd(), "data", "dev.sqlite");

let sqliteDb: SqliteDatabase | null = null;
let sqliteInitPromise: Promise<void> | null = null;

const sqliteSchema = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  CHECK (role IN ('user', 'admin'))
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email TEXT NOT NULL UNIQUE,
  token TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL DEFAULT 0,
  unit TEXT DEFAULT '',
  description TEXT DEFAULT '',
  tag TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS cart_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email TEXT NOT NULL,
  item_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_email, item_id)
);

CREATE TRIGGER IF NOT EXISTS cart_items_updated_at
AFTER UPDATE ON cart_items
FOR EACH ROW
BEGIN
  UPDATE cart_items SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

INSERT OR REPLACE INTO items VALUES (1, 'apple', 300, 'kg', 'good apple', 'fruits');
INSERT OR REPLACE INTO items VALUES (2, 'banana', 120, 'kg', 'fresh bananas', 'fruits');
INSERT OR REPLACE INTO items VALUES (3, 'mango', 450, 'kg', 'sweet mangoes', 'fruits');
INSERT OR REPLACE INTO items VALUES (4, 'orange', 200, 'kg', 'juicy oranges', 'fruits');
INSERT OR REPLACE INTO items VALUES (5, 'grapes', 350, 'kg', 'seedless grapes', 'fruits');
INSERT OR REPLACE INTO items VALUES (6, 'pineapple', 500, 'kg', 'tropical pineapple', 'fruits');
INSERT OR REPLACE INTO items VALUES (7, 'strawberry', 600, 'kg', 'fresh strawberries', 'fruits');
INSERT OR REPLACE INTO items VALUES (8, 'watermelon', 150, 'kg', 'large watermelon', 'fruits');
INSERT OR REPLACE INTO items VALUES (9, 'papaya', 180, 'kg', 'ripe papaya', 'fruits');
INSERT OR REPLACE INTO items VALUES (10, 'guava', 220, 'kg', 'green guava', 'fruits');
INSERT OR REPLACE INTO items VALUES (11, 'pear', 270, 'kg', 'soft pears', 'fruits');
INSERT OR REPLACE INTO items VALUES (12, 'peach', 400, 'kg', 'juicy peaches', 'fruits');
INSERT OR REPLACE INTO items VALUES (13, 'plum', 330, 'kg', 'fresh plums', 'fruits');
INSERT OR REPLACE INTO items VALUES (14, 'cherry', 800, 'kg', 'sweet cherries', 'fruits');
INSERT OR REPLACE INTO items VALUES (15, 'kiwi', 700, 'kg', 'tangy kiwi', 'fruits');
INSERT OR REPLACE INTO items VALUES (16, 'pomegranate', 550, 'kg', 'red pomegranate', 'fruits');
INSERT OR REPLACE INTO items VALUES (17, 'melon', 160, 'kg', 'honeydew melon', 'fruits');
INSERT OR REPLACE INTO items VALUES (18, 'fig', 900, 'kg', 'fresh figs', 'fruits');
INSERT OR REPLACE INTO items VALUES (19, 'dates', 650, 'kg', 'dry dates', 'fruits');
INSERT OR REPLACE INTO items VALUES (20, 'apricot', 420, 'kg', 'ripe apricots', 'fruits');

INSERT OR REPLACE INTO items VALUES (21, 'carrot', 90, 'kg', 'fresh carrots', 'vegetables');
INSERT OR REPLACE INTO items VALUES (22, 'potato', 60, 'kg', 'organic potatoes', 'vegetables');
INSERT OR REPLACE INTO items VALUES (23, 'onion', 110, 'kg', 'red onions', 'vegetables');
INSERT OR REPLACE INTO items VALUES (24, 'tomato', 130, 'kg', 'ripe tomatoes', 'vegetables');
INSERT OR REPLACE INTO items VALUES (25, 'cucumber', 140, 'kg', 'green cucumbers', 'vegetables');
INSERT OR REPLACE INTO items VALUES (26, 'spinach', 80, 'kg', 'fresh spinach', 'vegetables');
INSERT OR REPLACE INTO items VALUES (27, 'cabbage', 100, 'kg', 'green cabbage', 'vegetables');
INSERT OR REPLACE INTO items VALUES (28, 'cauliflower', 170, 'kg', 'white cauliflower', 'vegetables');
INSERT OR REPLACE INTO items VALUES (29, 'broccoli', 300, 'kg', 'fresh broccoli', 'vegetables');
INSERT OR REPLACE INTO items VALUES (30, 'capsicum', 250, 'kg', 'bell peppers', 'vegetables');

INSERT OR REPLACE INTO items VALUES (31, 'chicken', 900, 'kg', 'fresh chicken', 'meat');
INSERT OR REPLACE INTO items VALUES (32, 'beef', 1200, 'kg', 'premium beef', 'meat');
INSERT OR REPLACE INTO items VALUES (33, 'mutton', 1500, 'kg', 'fresh mutton', 'meat');
INSERT OR REPLACE INTO items VALUES (34, 'fish', 800, 'kg', 'sea fish', 'seafood');
INSERT OR REPLACE INTO items VALUES (35, 'prawns', 1100, 'kg', 'fresh prawns', 'seafood');

INSERT OR REPLACE INTO items VALUES (36, 'rice', 200, 'kg', 'basmati rice', 'grains');
INSERT OR REPLACE INTO items VALUES (37, 'wheat', 150, 'kg', 'whole wheat', 'grains');
INSERT OR REPLACE INTO items VALUES (38, 'corn', 180, 'kg', 'sweet corn', 'grains');
INSERT OR REPLACE INTO items VALUES (39, 'lentils', 220, 'kg', 'red lentils', 'grains');
INSERT OR REPLACE INTO items VALUES (40, 'beans', 260, 'kg', 'kidney beans', 'grains');

INSERT OR REPLACE INTO items VALUES (41, 'milk', 140, 'liter', 'fresh milk', 'dairy');
INSERT OR REPLACE INTO items VALUES (42, 'cheese', 700, 'kg', 'cheddar cheese', 'dairy');
INSERT OR REPLACE INTO items VALUES (43, 'butter', 600, 'kg', 'cream butter', 'dairy');
INSERT OR REPLACE INTO items VALUES (44, 'yogurt', 120, 'kg', 'plain yogurt', 'dairy');
INSERT OR REPLACE INTO items VALUES (45, 'cream', 500, 'kg', 'fresh cream', 'dairy');

INSERT OR REPLACE INTO items VALUES (46, 'sugar', 100, 'kg', 'white sugar', 'essentials');
INSERT OR REPLACE INTO items VALUES (47, 'salt', 40, 'kg', 'table salt', 'essentials');
INSERT OR REPLACE INTO items VALUES (48, 'oil', 300, 'liter', 'cooking oil', 'essentials');
INSERT OR REPLACE INTO items VALUES (49, 'tea', 850, 'kg', 'black tea', 'beverages');
INSERT OR REPLACE INTO items VALUES (50, 'coffee', 900, 'kg', 'ground coffee', 'beverages');
`;

async function getSqliteDb(): Promise<SqliteDatabase> {
  if (sqliteDb) {
    return sqliteDb;
  }

  const { default: Database } = await import("better-sqlite3");
  const dir = path.dirname(sqlitePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  sqliteDb = new Database(sqlitePath);
  return sqliteDb;
}

async function ensureSqliteReady(): Promise<SqliteDatabase> {
  const db = await getSqliteDb();

  if (!sqliteInitPromise) {
    sqliteInitPromise = Promise.resolve().then(() => {
      db.exec(sqliteSchema);
    });
  }

  await sqliteInitPromise;
  return db;
}

function shouldSkipSqlite(sql: string): boolean {
  return /^\s*(CREATE TABLE|ALTER TABLE|CREATE DATABASE|USE)\b/i.test(sql);
}

export async function pingSqlite(): Promise<void> {
  const db = await ensureSqliteReady();
  db.prepare("SELECT 1").get();
}

export async function querySqlite<T>(
  sql: string,
  params: DbParam[] = []
): Promise<QueryResult<T>> {
  const db = await ensureSqliteReady();
  const rows = db.prepare(sql).all(params) as T[];
  return { rows };
}

export async function executeSqlite(
  sql: string,
  params: DbParam[] = []
): Promise<ExecResult> {
  if (shouldSkipSqlite(sql)) {
    return { affectedRows: 0, insertId: 0 };
  }

  const db = await ensureSqliteReady();
  const result = db.prepare(sql).run(params);
  return {
    affectedRows: result.changes,
    insertId: Number(result.lastInsertRowid ?? 0),
  };
}
