ALTER TABLE `user` MODIFY COLUMN `uuid` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `user_email_unique` UNIQUE(`email`);