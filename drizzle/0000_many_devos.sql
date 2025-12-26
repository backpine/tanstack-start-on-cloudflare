CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE TABLE `CenterImage` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`s3Key` text NOT NULL,
	`altText` text DEFAULT '' NOT NULL,
	`description` text,
	`displayOrder` integer DEFAULT 0 NOT NULL,
	`isActive` integer DEFAULT true NOT NULL,
	`dialysisCenterId` text NOT NULL,
	`createdAt` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`dialysisCenterId`) REFERENCES `DialysisCenter`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `centerImage_dialysisCenterId_idx` ON `CenterImage` (`dialysisCenterId`);--> statement-breakpoint
CREATE INDEX `centerImage_displayOrder_idx` ON `CenterImage` (`displayOrder`);--> statement-breakpoint
CREATE INDEX `centerImage_isActive_idx` ON `CenterImage` (`isActive`);--> statement-breakpoint
CREATE TABLE `DialysisCenter` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text DEFAULT '' NOT NULL,
	`dialysisCenterName` text DEFAULT '' NOT NULL,
	`sector` text DEFAULT '' NOT NULL,
	`drInCharge` text DEFAULT '' NOT NULL,
	`drInChargeTel` text DEFAULT '' NOT NULL,
	`address` text DEFAULT '' NOT NULL,
	`addressWithUnit` text DEFAULT '' NOT NULL,
	`tel` text DEFAULT '' NOT NULL,
	`fax` text,
	`panelNephrologist` text,
	`centreManager` text,
	`centreCoordinator` text,
	`email` text,
	`hepatitisBay` text,
	`longitude` real,
	`latitude` real,
	`phoneNumber` text DEFAULT '' NOT NULL,
	`website` text,
	`title` text DEFAULT '' NOT NULL,
	`units` text DEFAULT '' NOT NULL,
	`description` text,
	`benefits` text,
	`photos` text,
	`videos` text,
	`stateId` text NOT NULL,
	`town` text DEFAULT '' NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`createdAt` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`stateId`) REFERENCES `State`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `DialysisCenter_slug_unique` ON `DialysisCenter` (`slug`);--> statement-breakpoint
CREATE INDEX `dialysisCenter_sector_idx` ON `DialysisCenter` (`sector`);--> statement-breakpoint
CREATE INDEX `dialysisCenter_title_idx` ON `DialysisCenter` (`title`);--> statement-breakpoint
CREATE INDEX `dialysisCenter_town_idx` ON `DialysisCenter` (`town`);--> statement-breakpoint
CREATE INDEX `dialysisCenter_units_idx` ON `DialysisCenter` (`units`);--> statement-breakpoint
CREATE INDEX `dialysisCenter_drInCharge_idx` ON `DialysisCenter` (`drInCharge`);--> statement-breakpoint
CREATE INDEX `dialysisCenter_addressWithUnit_idx` ON `DialysisCenter` (`addressWithUnit`);--> statement-breakpoint
CREATE INDEX `dialysisCenter_address_idx` ON `DialysisCenter` (`address`);--> statement-breakpoint
CREATE INDEX `dialysisCenter_dialysisCenterName_idx` ON `DialysisCenter` (`dialysisCenterName`);--> statement-breakpoint
CREATE INDEX `dialysisCenter_slug_idx` ON `DialysisCenter` (`slug`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE TABLE `State` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`createdAt` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `State_name_unique` ON `State` (`name`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`role` text DEFAULT 'pic' NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `user_center_access` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`dialysis_center_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`dialysis_center_id`) REFERENCES `DialysisCenter`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `userCenterAccess_userId_idx` ON `user_center_access` (`user_id`);--> statement-breakpoint
CREATE INDEX `userCenterAccess_dialysisCenterId_idx` ON `user_center_access` (`dialysis_center_id`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);