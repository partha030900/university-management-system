import dotenv from "dotenv";
import path from "path";
import type { SignOptions } from "jsonwebtoken";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  port: process.env.PORT,

  database_url: process.env.DATABASE_URL,

  app_url: process.env.APP_URL,

  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

  jwt_access_secret: process.env.JWT_ACCESS_SECRET!,

  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,

  jwt_access_expires_in:
    process.env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],

  jwt_refresh_expires_in:
    process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],

  google_client_id: process.env.GOOGLE_CLIENT_ID!,
};

export default config;