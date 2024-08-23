CREATE TABLE IF NOT EXISTS "pageTags" (
	"id" serial PRIMARY KEY NOT NULL,
	"page" varchar,
	"tag" varchar NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pageTags" ADD CONSTRAINT "pageTags_page_pages_identifier_fk" FOREIGN KEY ("page") REFERENCES "public"."pages"("identifier") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
