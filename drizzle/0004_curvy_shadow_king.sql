CREATE TABLE IF NOT EXISTS "sessions" (
	"sessionToken" varchar PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"expires" timestamp NOT NULL
);
