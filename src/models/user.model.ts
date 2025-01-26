import { Static, Type } from "@sinclair/typebox";
import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";
import jwt from "jsonwebtoken"
import { eq } from "drizzle-orm"
import { createInsertSchema } from "drizzle-typebox";
import crypto from "node:crypto"
import db from "../db";
import server from "..";
import { uuid } from "drizzle-orm/pg-core";

const secret_key = process.env.JWT_SECRET_KEY
type TokenPayload = {
    id: string,
    time: string
}

export const usersTable = mysqlTable('user',
    {
        id: serial().primaryKey(),
        uuid: varchar({ length: 36 }).notNull(),
        email: varchar({ length: 255 }).notNull().unique(),
        salt: varchar({ length: 12 }).notNull(), // 8 random bytes to base64 always seems to procude length of 12
        password_hash: varchar({ length: 44 }).notNull() // SHA-256 digested to base64 always produces length of 44
    }
)

const UserInsertSchema = createInsertSchema(usersTable) // Used to create DTOs

export const UserInputDTO = Type.Object({
    email: UserInsertSchema.properties.email,
    password: Type.String({ maxLength: 255, minLength: 8 }) // somewhat arbitrary
})
export const UserOutputDTO = Type.Object({
    email: UserInsertSchema.properties.email,
    uuid: UserInsertSchema.properties.uuid
})

export async function getUserProfile(uuid: string): Promise<Static<typeof UserOutputDTO>> {
    try {
        const result = await db.select({
            email: usersTable.email,
            uuid: usersTable.uuid
        }).from(usersTable).where(eq(usersTable.uuid, uuid));
        return result[0];
    } catch (err) {
        server.log.error("Unable to get user details!");
        throw err;
    }
}

export async function login(input: Static<typeof UserInputDTO>): Promise<string> {
    const userData = await db.select({
        hash: usersTable.password_hash,
        salt: usersTable.salt,
        uuid: usersTable.uuid
    })
        .from(usersTable)
        .where(eq(usersTable.email, input.email))
        .then(result => result[0])
        .catch(err => {
            server.log.error(err, "Unable to login")
            throw err
        });
    if (!userData) {
        // email doesn't exist; throw unauthorized.
        throw new Error("Unauthorized");
    }
    const hashAttempt = sha256SaltedHash(input.password, userData.salt);
    if (hashAttempt != userData.hash) {
        throw new Error("Unauthorized");
    }
    // guard clause end; generate jwt

    if (typeof (secret_key) != 'string') {
        throw new Error("Secret key missing");
    }
    const data: TokenPayload = { time: Date(), id: userData.uuid }
    const token = jwt.sign(data, secret_key)
    return token;
}

export async function registerUser(input: Static<typeof UserInputDTO>): Promise<Static<typeof UserOutputDTO>> {
    const email = input.email;
    const uuid = crypto.randomUUID()
    const salt = crypto.randomBytes(8).toString("base64");
    const password_hash = sha256SaltedHash(input.password, salt)
    const userInsert: typeof usersTable.$inferInsert = {
        salt,
        password_hash,
        email,
        uuid
    }
    try {
        const insertedValue = await db.insert(usersTable).values(userInsert);
        server.log.info(insertedValue, "Created new user");
        return { uuid, email };
    } catch (err) {
        server.log.error(err, "Unable to create new user");
        throw err;
    }
}

function sha256SaltedHash(password: string, salt: string) {
    // simple sha256 hash w/salt implementation;
    // in production use bcrypt or scrypt or something more secure
    const data = password.concat(salt)
    return crypto.createHash('sha256').update(data).digest("base64")
}

export function validateToken(token: string) {
    if (typeof (secret_key) != 'string') {
        throw new Error("Secret key missing");
    }
    return jwt.verify(token, secret_key) as TokenPayload
}
