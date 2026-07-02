ALTER TABLE "items" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_slug_unique" UNIQUE("slug");