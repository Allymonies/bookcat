import { integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const featuredTags = pgTable("featured_tags", {
    id: serial("id").primaryKey(),
    tag: varchar("tag").notNull(),
    created: timestamp("created").defaultNow().notNull(),
    order: integer("order").notNull(),
});

export type DbFeaturedTag = typeof featuredTags.$inferSelect;
export type NewFeaturedTAg = typeof featuredTags.$inferInsert;