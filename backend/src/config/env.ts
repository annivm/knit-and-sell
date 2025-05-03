import dotenv from 'dotenv';

dotenv.config();

interface Config {
PORT: number;
DB_USER: string;
DB_HOST: string;
DB_NAME: string;
DB_PASSWORD: string;
DB_PORT: number;
JWT_KEY: string;
FRONTEND_URL: string;
CLOUDINARY_CLOUD_NAME: string;
CLOUDINARY_API_KEY: string;
CLOUDINARY_API_SECRET: string;
}

export const config: Config = {
    PORT: Number(process.env.PORT) || 5002,
    DB_USER: process.env.DB_USER || 'postgres',
    DB_HOST: process.env.DB_HOST || 'db',
    DB_NAME: process.env.DB_NAME || 'market_db',
    DB_PASSWORD: process.env.DB_PASSWORD || 'market_password',
    DB_PORT: Number(process.env.DB_PORT) || 5432,
    JWT_KEY: process.env.JWT_KEY || 'my_secret_jwt_key',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
};
