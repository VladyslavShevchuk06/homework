ALTER TABLE "items" ALTER COLUMN "team_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "number" SET DATA TYPE integer USING "number"::integer;--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "team_en";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "team_uk";