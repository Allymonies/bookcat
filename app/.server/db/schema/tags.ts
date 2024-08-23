import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { pages } from "./pages";
import { relations } from "drizzle-orm";

export const pageTags = pgTable("page_tags", {
    id: serial("id").primaryKey(),
    page: varchar("page").references(() => pages.identifier),
    tag: varchar("tag").notNull(),
});

export type DbPageTag = typeof pageTags.$inferSelect;
export type NewPageTag = typeof pageTags.$inferInsert;

export const pageTagsRelations = relations(pageTags, ({ many }) => ({
    pageTags: many(pages, { relationName: 'pageTags' })
}));