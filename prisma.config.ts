import { defineConfig } from "@prisma/internals";

export default defineConfig({
  schema: "./packages/db/prisma/schema.prisma",
  generator: {
    client: {
      output: "./packages/db/node_modules/.prisma/client",
    },
  },
});
