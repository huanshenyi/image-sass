import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgres://image_sass:image_sass@localhost:5432/image_sass",
  },
  verbose: true,
  strict: true,
});
