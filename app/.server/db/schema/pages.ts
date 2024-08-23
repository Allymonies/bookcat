import { boolean, integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { pageVersions } from "./pageVersions";
import { relations } from "drizzle-orm";

export const pages = pgTable("pages", {
    identifier: varchar("identifier").primaryKey(),
    created: timestamp("created").defaultNow().notNull(),
    published: boolean("published").default(false).notNull(),
    latestVersion: integer("latestVersion").references(() => pageVersions.id),
});

export type DbPage = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;

export const pagesRelations = relations(pages, ({ many }) => ({
    pageVersions: many(pageVersions, { relationName: 'pageVersions' })
}));