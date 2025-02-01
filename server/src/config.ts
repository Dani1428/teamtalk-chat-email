import dotenv from 'dotenv';

dotenv.config();

export const {
  PORT = 5000,
  DB_HOST = 'localhost',
  DB_PORT = 5432,
  DB_NAME = 'teamtalk',
  DB_USER = 'postgres',
  DB_PASSWORD = 'postgres',
  JWT_SECRET = 'votre_secret_jwt_super_securise',
  CLIENT_URL = 'http://localhost:3000',
  ADMIN_USER = 'admin',
  ADMIN_PASS = 'admin_password_securise',
} = process.env;
