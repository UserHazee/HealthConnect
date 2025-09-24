import mysql from "mysql2/promise";

let db;

export async function connectDB() {
  if (!db) {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log("✅ MySQL Connected");
  }
  return db;
}

export function getDB() {
  if (!db) throw new Error("Database not connected!");
  return db;
}
