import express, { Application, NextFunction, Request, Response } from "express";
import cors from 'cors'
import dotenv from 'dotenv';
import itemRoute from "./routes/item.route";
import { pool } from "./db/db";


dotenv.config();

const app: Application = express();

app.use(express.static('public'))
app.use(express.json());

app.use(cors())

app.get('/', (req: Request, res: Response): void => {
    res.send('API is running');
});

app.use('/api/items/', itemRoute);

app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT 1');
        res.json({ message: 'Database connection successful', result: result.rows });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ message: 'Database connection error', error});
    }
});

export default app;