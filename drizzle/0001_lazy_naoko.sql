ALTER TABLE "pages" ALTER COLUMN "created" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pages" ALTER COLUMN "markdown" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pages" ALTER COLUMN "content" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pages" ALTER COLUMN "published" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN "title" varchar NOT NULL;