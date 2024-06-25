import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

// for query purposes
const queryClient = postgres(
  "postgres://image_sass:image_sass@localhost:5432/image_sass"
);
export const db = drizzle(queryClient, { schema });
