CREATE TABLE `user` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`uuid` varchar(36),
	`email` varchar(255) NOT NULL,
	`salt` binary(8) NOT NULL,
	`password_hash` binary(32) NOT NULL,
	CONSTRAINT `user_id` PRIMARY KEY(`id`)
);
