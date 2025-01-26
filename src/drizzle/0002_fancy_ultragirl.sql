ALTER TABLE `user` MODIFY COLUMN `salt` varchar(12) NOT NULL;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `password_hash` varchar(44) NOT NULL;