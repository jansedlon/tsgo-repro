import { drizzle } from "drizzle-orm/node-postgres";
import type { DBQueryConfig, BuildQueryResult } from "drizzle-orm";
import type { PgRelationalQuery } from "drizzle-orm/pg-core/query-builders/query";
import { schema } from "./schema";



const db = drizzle("", { schema: schema });

const posts= await db.query.posts.findMany({
  columns: {
    id: true,
  },
  with: {
    attachments: {
      id: true,
      type: true,
      location: true,
      filename: true,
      size: true,
      orderBy(fields, { asc }) {
        return asc(fields.createdAt);
      },
    }
  }
})