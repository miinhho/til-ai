CREATE TABLE "tils" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tils_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(50) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
-- For trgm index
CREATE EXTENSION pg_trgm;

CREATE INDEX "title_idx" ON "tils" USING gin (title gin_trgm_ops);