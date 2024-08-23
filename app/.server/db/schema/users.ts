import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { sessions } from "./sessions";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    uuid: varchar("uuid").notNull(),
    username: varchar("username").notNull(),
    email: varchar("email").notNull(),
    password: varchar("password").notNull(),
    created: timestamp("created").defaultNow().notNull(),
});

export type DbUser = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const usersRelations = relations(users, ({ many }) => ({
    sessionUser: many(sessions, { relationName: 'sessionUser' }),
}));