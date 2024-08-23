import { jsonb, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { TokensList } from "marked";
import { pages } from "./pages";
import { relations } from "drizzle-orm";

export const pageVersions = pgTable("page_versions", {
    id: serial("id").primaryKey(),
    pageId: varchar("pageId").notNull(),
    created: timestamp("created").defaultNow().notNull(),
    title: varchar("title").notNull(),
    markdown: jsonb("markdown").$type<TokensList>().notNull(),
    content: text("content").notNull(),
});

export type DbPageVersion = typeof pageVersions.$inferSelect;
export type NewPageVersion = typeof pageVersions.$inferInsert;

export const pageVersionsRelations = relations(pageVersions, ({ one }) => ({
    pageVersions: one(pages, {
      fields: [pageVersions.pageId],
      references: [pages.identifier],
      relationName: 'pageVersions',
    }),
    pageLatestVersion: one(pages),
}));