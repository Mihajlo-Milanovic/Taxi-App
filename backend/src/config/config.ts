import {configDotenv} from 'dotenv';

configDotenv();
export const port = Number(process.env.PORT) || 5000
export const redisURI = process.env.DB_URL || ""

// export const nextAuthUrl = process.env.NEXTAUTH_URL || ""

// export const emailUser = process.env.EMAIL_USER || ""
// export const emailAppPass = process.env.EMAIL_APP_PASS || ""