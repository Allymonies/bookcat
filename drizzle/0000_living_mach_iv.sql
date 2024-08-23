CREATE TABLE IF NOT EXISTS "pages" (
	"identifier" varchar PRIMARY KEY NOT NULL,
	"created" timestamp DEFAULT now(),
	"markdown" jsonb,
	"content" text,
	"published" boolean DEFAULT false
);
