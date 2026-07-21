ALTER TABLE "items" ADD COLUMN "title_en" text NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "title_uk" text NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "team_en" text NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "team_uk" text NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "number" text NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "country_en" text NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "country_uk" text NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "description_en" text;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "description_uk" text;--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "description";