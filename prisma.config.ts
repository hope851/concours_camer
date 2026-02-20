import * as dotenv from 'dotenv';
dotenv.config(); // Charge le .env manuellement

import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Utilise process.env plutôt que l'utilitaire env() pour tester
    url: process.env.DATABASE_URL, 
  },
});

