// src/config/load-env.ts
import dotenv from 'dotenv';
dotenv.config({ path: 'env/.env.production' });
// optional: dotenv.config({ path: 'env/.env' });

if (!process.env.BASE_URL) {
  console.warn('WARN: BASE_URL tidak ke-load dari .env');
} else {
  console.log('BASE_URL loaded =', process.env.BASE_URL);
}
