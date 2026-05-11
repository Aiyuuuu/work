import mysql, { type Pool, type ResultSetHeader, type RowDataPacket } from "mysql2/promise";
import type { ExecResult, MySqlConfig, QueryResult } from "@/types/grocery";

type MySqlParam = string | number | boolean | Date | null;

const databaseName = process.env.MYSQL_DATABASE ?? "grocery_app";

const config: MySqlConfig = {
  host: process.env.MYSQL_HOST ?? "localhost",
  user: process.env.MYSQL_USER ?? "root",
  password: process.env.MYSQL_PASSWORD ?? "",
  database: databaseName,
  port: Number(process.env.MYSQL_PORT ?? 3306),
  connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT ?? 10),
};

let mysqlPool: Pool | null = null;
let initPromise: Promise<Pool> | null = null;

async function createMysqlPool(): Promise<Pool> {
  const adminPool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    port: config.port,
    connectionLimit: 1,
  });

  try {
    if (databaseName) {
      await adminPool.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    }
  } finally {
    await adminPool.end();
  }

  return mysql.createPool(config);
}

async function getMysqlPool(): Promise<Pool> {
  if (mysqlPool) {
    return mysqlPool;
  }

  if (!initPromise) {
    initPromise = createMysqlPool().then((pool) => {
      mysqlPool = pool;
      return pool;
    });
  }

  return initPromise;
}

export async function pingMySql(): Promise<void> {
  const pool = await getMysqlPool();
  const connection = await pool.getConnection();
  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}

export async function queryMySql<T extends RowDataPacket>(
  sql: string,
  params: MySqlParam[] = []
): Promise<QueryResult<T>> {
  const pool = await getMysqlPool();
  const [rows] = await pool.query<T[]>(sql, params);
  return { rows };
}

export async function executeMySql(
  sql: string,
  params: MySqlParam[] = []
): Promise<ExecResult> {
  const pool = await getMysqlPool();
  const [result] = await pool.execute<ResultSetHeader>(sql, params);
  return {
    affectedRows: result.affectedRows,
    insertId: result.insertId,
  };
}
