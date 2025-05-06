import express, { Application, NextFunction, Request, Response } from "express";
import cors from 'cors'
import dotenv from 'dotenv';
import itemRoutes from "./routes/item.route";
import usersRoutes from "./routes/users.route";
import path from "path";
import fs from 'fs';

const uploadPath = path.join(__dirname,'..', 'uploads', 'images');
fs.mkdirSync(uploadPath, { recursive: true });

dotenv.config();

const app: Application = express();

app.use(express.static('public'))
app.use(express.static('uploads'))
app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.options('*', cors());

app.get('/', (req: Request, res: Response): void => {
    res.send('API is running');
});

app.use('/api/items/', itemRoutes);
app.use('/api/users', usersRoutes);


export default app;