CREATE TABLE IF NOT EXISTS "images" (
	"id" serial PRIMARY KEY NOT NULL,
	"author" integer NOT NULL,
	"mimeType" varchar NOT NULL,
	"filename" varchar NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "page-versions" RENAME TO "page_versions";--> statement-breakpoint
ALTER TABLE "pageTags" RENAME TO "page_tags";--> statement-breakpoint
ALTER TABLE "pages" DROP CONSTRAINT "pages_latestVersion_page-versions_id_fk";
--> statement-breakpoint
ALTER TABLE "page_tags" DROP CONSTRAINT "pageTags_page_pages_identifier_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images" ADD CONSTRAINT "images_author_users_id_fk" FOREIGN KEY ("author") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pages" ADD CONSTRAINT "pages_latestVersion_page_versions_id_fk" FOREIGN KEY ("latestVersion") REFERENCES "public"."page_versions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "page_tags" ADD CONSTRAINT "page_tags_page_pages_identifier_fk" FOREIGN KEY ("page") REFERENCES "public"."pages"("identifier") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
