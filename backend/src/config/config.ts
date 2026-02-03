import {configDotenv} from 'dotenv';

configDotenv();
export const PORT = Number(process.env.PORT) || 5000
export const SWAGGER_PORT = Number(process.env.SWAGGER_PORT) || 3000
export const REDIS_URI = `${process.env.REDIS_HOST || "NO_HOST"}:${process.env.REDIS_PORT || "NO_PORT"}`;

// export const nextAuthUrl = process.env.NEXTAUTH_URL || ""

// export const emailUser = process.env.EMAIL_USER || ""
// export const emailAppPass = process.env.EMAIL_APP_PASS || ""