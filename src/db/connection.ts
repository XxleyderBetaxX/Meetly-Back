import {drizzle} from "drizzle-orm/node-postgres";
import {Pool} from "pg";
import * as schema from "./schema";
import env from "../../env";

const createPool = ()=> {
    return new Pool({
        connectionString: env.DATABASE_URL,
    });
}

export const db = drizzle(createPool(), {schema});

export default db; 