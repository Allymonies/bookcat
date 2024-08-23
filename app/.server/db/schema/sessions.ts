import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const sessions = pgTable("sessions", {
    sessionToken: varchar("sessionToken").primaryKey(),
    userId: integer("userId").notNull(),
    created: timestamp("created").defaultNow().notNull(),
    expires: timestamp("expires").notNull(),
});

export type DbSession = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export const sessionsRelations = relations(sessions, ({ one }) => ({
    sessionUser: one(users, {
      fields: [sessions.userId],
      references: [users.id],
      relationName: 'sessionUser',
    }),
}));