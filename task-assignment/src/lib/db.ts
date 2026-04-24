import { readFile, writeFile } from 'fs/promises';
import path from 'path';

export type User = {
  id: string;
  email: string;
  password: string;
  role: 'MANAGER' | 'EMPLOYEE';
  name: string;
};

export type Task = {
  id: number;
  title: string;
  assignedTo: string;
  employeeName: string;
  status: string;
};

type Database = {
  users: User[];
  tasks: Task[];
};

const dbFilePath = path.join(process.cwd(), 'src', 'lib', 'db.json');

async function readDatabase(): Promise<Database> {
  const fileContents = await readFile(dbFilePath, 'utf8');
  return JSON.parse(fileContents) as Database;
}

async function writeDatabase(database: Database) {
  await writeFile(dbFilePath, JSON.stringify(database, null, 2), 'utf8');
}

export async function getUsers() {
  const database = await readDatabase();
  return database.users;
}

export async function getTasks() {
  const database = await readDatabase();
  return database.tasks;
}

export async function getEmployees() {
  const users = await getUsers();
  return users.filter((user) => user.role === 'EMPLOYEE');
}

export async function findUserByCredentials(email: string, password: string) {
  const users = await getUsers();
  return users.find((user) => user.email === email && user.password === password);
}

export async function addTask(task: Task) {
  const database = await readDatabase();
  database.tasks.push(task);
  await writeDatabase(database);
  return task;
}

export async function updateTaskStatus(taskId: number, status: string) {
  const database = await readDatabase();
  const task = database.tasks.find((entry) => entry.id === taskId);

  if (!task) {
    return null;
  }

  task.status = status;
  await writeDatabase(database);
  return task;
}


