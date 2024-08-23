import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import "dotenv/config";

const { Client } = pg;

const client = new Client({
    port: parseInt(process.env.BOOKCAT_DB_PORT ?? "5432"),
    host: process.env.BOOKCAT_DB_HOST ?? "localhost",
    database: process.env.BOOKCAT_DB_NAME ?? "bookcat",
    password: process.env.BOOKCAT_DB_PASSWORD,
    ssl: false,
    user: process.env.BOOKCAT_DB_USER ?? "bookcat",
})
await client.connect();
export const db = drizzle(client);