CREATE TABLE IF NOT EXISTS "featured_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag" varchar NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"order" integer NOT NULL
);
