import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

import { config } from "../config/env";

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    if (req.method === 'OPTIONS') {
        next();
        return;
    }

    try {
        // checking if there is a header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: "Authentication failed: No token provided" });
            return;
        }
        // checking if the token is in the right format
        const token = authHeader.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: "Authentication failed: Invalid token format" });
            return;
        }

        const decodedToken = jwt.verify(token, config.JWT_KEY) as JwtPayload;

        if (!decodedToken || typeof decodedToken !== 'object' || !decodedToken.id) {
            res.status(401).json({ message: "Authentication failed: Token could not be verified" });
            return;
        }

        req.userData = { userId: decodedToken.id };
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Authentication failed" });
        return;
    }
}