CREATE TABLE `activities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`weight` integer NOT NULL,
	`recurrence_rule` text,
	`is_private` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`archived_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `activities_user_id_idx` ON `activities` (`user_id`);--> statement-breakpoint
CREATE INDEX `activities_user_archived_idx` ON `activities` (`user_id`,`archived_at`);--> statement-breakpoint
CREATE TABLE `commitments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`activity_id` integer NOT NULL,
	`date` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`activity_id`) REFERENCES `activities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `commitments_user_date_idx` ON `commitments` (`user_id`,`date`);--> statement-breakpoint
CREATE UNIQUE INDEX `commitments_user_activity_date_unique` ON `commitments` (`user_id`,`activity_id`,`date`);--> statement-breakpoint
CREATE TABLE `entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`commitment_id` integer NOT NULL,
	`activity_id` integer NOT NULL,
	`date` text NOT NULL,
	`completed_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`commitment_id`) REFERENCES `commitments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`activity_id`) REFERENCES `activities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `entries_user_date_idx` ON `entries` (`user_id`,`date`);--> statement-breakpoint
CREATE UNIQUE INDEX `entries_commitment_unique` ON `entries` (`commitment_id`);--> statement-breakpoint
CREATE TABLE `friendships` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`friend_id` integer NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`friend_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `friendships_user_id_idx` ON `friendships` (`user_id`);--> statement-breakpoint
CREATE INDEX `friendships_friend_id_idx` ON `friendships` (`friend_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `friendships_user_friend_unique` ON `friendships` (`user_id`,`friend_id`);--> statement-breakpoint
CREATE TABLE `passive_wins` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`note` text NOT NULL,
	`source` text NOT NULL,
	`date` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `passive_wins_user_date_idx` ON `passive_wins` (`user_id`,`date`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`display_name` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);