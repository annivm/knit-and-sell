import dotenv from 'dotenv';

dotenv.config();

interface Config {
APP_PORT: number;
DB_USER: string;
DB_HOST: string;
DB_NAME: string;
DB_PASSWORD: string;
DB_PORT: number;
JWT_KEY: string;
}

export const config: Config = {
    APP_PORT: Number(process.env.APP_PORT) || 5000,
    DB_USER: process.env.DB_USER || 'postgres',
    DB_HOST: process.env.DB_HOST || 'db',
    DB_NAME: process.env.DB_NAME || 'market_db',
    DB_PASSWORD: process.env.DB_PASSWORD || 'market_password',
    DB_PORT: Number(process.env.DB_PORT) || 5432,
    JWT_KEY: process.env.JWT_KEY || 'my_secret_jwt_key'
};
