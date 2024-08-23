CREATE TABLE IF NOT EXISTS "page-versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"pageId" varchar NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"title" varchar NOT NULL,
	"markdown" jsonb NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN "latestVersion" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pages" ADD CONSTRAINT "pages_latestVersion_page-versions_id_fk" FOREIGN KEY ("latestVersion") REFERENCES "public"."page-versions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "pages" DROP COLUMN IF EXISTS "title";--> statement-breakpoint
ALTER TABLE "pages" DROP COLUMN IF EXISTS "markdown";--> statement-breakpoint
ALTER TABLE "pages" DROP COLUMN IF EXISTS "content";