// import 'dotenv/config';
// import { defineConfig } from 'drizzle-kit';

// export default defineConfig({

//     schema: './configs/schema.ts',
//     dialect: 'postgresql',
//     dbCredentials: {
//         url: process.env.NEXT_PUBLIC_NEON_DB_CONNECTION_STRING!,
//     },
// });

export default {
  dialect: "postgresql",
  schema: "./configs/schema.ts",
  out: "./drizzle",

  dbCredentials: {
    url: process.env.NEXT_PUBLIC_NEON_DB_CONNECTION_STRING,
    connectionString: process.env.NEXT_PUBLIC_NEON_DB_CONNECTION_STRING,
  },
};
