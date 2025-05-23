import { integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const images = pgTable("images", {
    id: serial("id").primaryKey(),
    author: integer("author").notNull().references(() => users.id),
    mimeType: varchar("mimeType").notNull(),
    filename: varchar("filename").notNull(),
    path: varchar("path").notNull(),
    created: timestamp("created").defaultNow().notNull(),
});

export type DbImage = typeof images.$inferSelect;
export type DbNewImage = typeof images.$inferInsert;