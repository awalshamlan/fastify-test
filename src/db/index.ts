import dotenv from "dotenv"
import {drizzle} from "drizzle-orm/mysql2"

dotenv.config()
const db = drizzle(process.env.DATABASE_URL || "Missing from env")

export default db