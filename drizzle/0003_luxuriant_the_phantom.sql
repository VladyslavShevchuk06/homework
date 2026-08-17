CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name_en" text NOT NULL,
	"name_uk" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "teams_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "team_id" uuid;--> statement-breakpoint
INSERT INTO "teams" ("slug", "name_en", "name_uk") SELECT DISTINCT ON ("team_en") trim(both '-' from lower(regexp_replace("team_en", '[^a-zA-Z0-9]+', '-', 'g'))), "team_en", "team_uk" FROM "items" ORDER BY "team_en";--> statement-breakpoint
UPDATE "items" SET "team_id" = "teams"."id" FROM "teams" WHERE "teams"."name_en" = "items"."team_en";--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "items_team_id_idx" ON "items" USING btree ("team_id");
