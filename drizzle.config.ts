import { defineConfig } from "drizzle-kit";
import 'dotenv/config';

export default defineConfig({
    dialect: "postgresql",
    schema: "./app/.server/db/schema/*.ts",
    out: "./drizzle",
    dbCredentials: {
        host: process.env.BOOKCAT_DB_HOST ?? "localhost",
        port: parseInt(process.env.BOOKCAT_DB_PORT ?? "5432"),
        database: process.env.BOOKCAT_DB_NAME ?? "bookcat",
        password: process.env.BOOKCAT_DB_PASSWORD,
        ssl: false,
        user: process.env.BOOKCAT_DB_USER ?? "bookcat",
    }
});