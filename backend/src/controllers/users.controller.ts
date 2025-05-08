import { Request, Response } from "express";
import * as bcrypt from 'bcryptjs';
import {v4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { loginUserRequestSchema, signUpUserSchema, UserCreateRequest } from "../models/users.model";
import { config } from "../config/env";
import { createUser, findByEmail } from '../services/users.service';
import { ZodError } from "zod";

const signUpUser = async (req: Request, res: Response) => {
    try{
        const validUserSignUpData = signUpUserSchema.parse(req.body);

        const exist = await findByEmail(validUserSignUpData.email);
        if (exist) {
            res.status(422).json({ message: "User already exists" })
            return;
        }

        let hashedPassword;

        try {
            hashedPassword = await bcrypt.hash(validUserSignUpData.password, 12);
        } catch (error) {
            res.status(500).json({ message: "Could not create user, please try again." });
        }

        const newUser: UserCreateRequest = {
            id: v4(),
            name: validUserSignUpData.name,
            email: validUserSignUpData.email,
            password: hashedPassword!
        }

        try {
            const result = await createUser(newUser);

            if (!result) {
                res.status(500).json({ message: "Could not create user, please try again." });
                return;
            }

            const token = jwt.sign(
                {
                    id: newUser.id,
                    email: newUser.email
                },
                config.JWT_KEY,  // secret key
                { expiresIn: '1h' } // token expires in 1 hour
            );

            res.status(201).json(
                {
                    token: token,
                    id: newUser.id,
                    email: newUser.email
                }
            );
        } catch (error) {
            res.status(500).json({ message: "SignUp failed" });
        }
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({ message: error.issues[0].message });
            return;
        }
        if (error instanceof Error) {
            if ('errors' in error) {
                res.status(400).json({ message: "Missing a value" });
                return;
            }
        }
        return;
    }
}

const loginUser = async (req: Request, res: Response) => {
    let validUserLoginData;
    try{
        validUserLoginData = loginUserRequestSchema.parse(req.body);
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({ message: error.issues[0].message });
            return;
        }
        if (error instanceof Error) {
            if ('errors' in error) {
                res.status(500).json({ message: "Missing a value" });
                return;
            }
        }
        return;
    }

    let identifiedUser;
    try {
        const data = await findByEmail(validUserLoginData.email);
        if (!data){
            res.status(401).json({ message: 'Could not identify user, credentials seem to be wrong.'});
            return;
        }
        identifiedUser = data;

    } catch (error) {
        res.status(500).json({ message: "Login failed" });
        return;
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(validUserLoginData.password, identifiedUser.password);


    } catch (error) {
        res.status(500).json({ message:'Could not log you in, please check your credentials and try again.'});
        return;
    }

    if (!isValidPassword){
        res.status(401).json({ message: 'Could not identify user, credentials seem to be wrong.'});
        return;
    }

    let token;
    try {
        token = jwt.sign(
            {
                id: identifiedUser.id,
                email: identifiedUser.email
            },
            config.JWT_KEY,  // secret key
            { expiresIn: '1h' } // token expires in 1 hour
        )
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong with the login, please try again' });
        return;
    }

    res.status(200).json(
        {
            token: token,
            id: identifiedUser.id,
            email: identifiedUser.email
        }
    )
}

export { signUpUser, loginUser };