import {defineConfig} from "drizzle-kit"
import dotenv from "dotenv"

dotenv.config()

export default defineConfig({
    out: './drizzle',
    schema: './db/schema.ts',
    dialect: 'mysql',
    dbCredentials: {
        url: process.env.DATABASE_URL || "DATABASE_URL Missing from env"
    }
})