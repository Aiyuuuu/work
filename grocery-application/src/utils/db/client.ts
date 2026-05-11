import type { RowDataPacket } from "mysql2/promise";
import type { ExecResult, QueryResult } from "@/types/grocery";
import { executeMySql as executeMysql, pingMySql as pingMysql, queryMySql as queryMysql } from "@/utils/mysql/client";
import { executeSqlite, pingSqlite, querySqlite } from "@/utils/sqlite/client";

type DbParam = string | number | boolean | Date | null;

const dbDriver = (process.env.DB_DRIVER ?? "mysql").toLowerCase();
const useSqlite = dbDriver === "sqlite";

export async function pingMySql(): Promise<void> {
  if (useSqlite) {
    return pingSqlite();
  }

  return pingMysql();
}

export async function queryMySql<T extends RowDataPacket>(
  sql: string,
  params: DbParam[] = []
): Promise<QueryResult<T>> {
  if (useSqlite) {
    return querySqlite<T>(sql, params);
  }

  return queryMysql<T>(sql, params);
}

export async function executeMySql(
  sql: string,
  params: DbParam[] = []
): Promise<ExecResult> {
  if (useSqlite) {
    return executeSqlite(sql, params);
  }

  return executeMysql(sql, params);
}
