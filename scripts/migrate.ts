import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

config({ path: ".env" });

const sql = neon(process.env.NEON_DATABASE_URL!);
const db1 = drizzle(sql);

const main = async () => {
  try {
    await migrate(db1, { migrationsFolder: "drizzle" });
  } catch (error) {
    console.log("error during migration", error);
    process.exit(1);
  }
};

main();