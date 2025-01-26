ALTER TABLE `user` MODIFY COLUMN `salt` varchar(8) NOT NULL;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `password_hash` varchar(32) NOT NULL;