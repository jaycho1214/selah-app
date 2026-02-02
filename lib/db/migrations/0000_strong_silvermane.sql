CREATE TABLE `bookmarks` (
	`id` text PRIMARY KEY NOT NULL,
	`verse_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`synced_at` integer
);
--> statement-breakpoint
CREATE TABLE `highlights` (
	`id` text PRIMARY KEY NOT NULL,
	`verse_id` text NOT NULL,
	`color` text NOT NULL,
	`created_at` integer NOT NULL,
	`synced_at` integer
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` text PRIMARY KEY NOT NULL,
	`verse_id` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`synced_at` integer
);
--> statement-breakpoint
CREATE TABLE `translations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`version` text,
	`downloaded_at` integer
);
--> statement-breakpoint
CREATE TABLE `verses` (
	`id` text PRIMARY KEY NOT NULL,
	`translation_id` text NOT NULL,
	`book` text NOT NULL,
	`chapter` integer NOT NULL,
	`verse` integer NOT NULL,
	`text` text NOT NULL
);
