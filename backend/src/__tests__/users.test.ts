import request from "supertest";
import { pool } from "../db/db";
import app from "../app";

afterEach( async () => {
    await pool.query("DELETE FROM items WHERE name LIKE 'Test name' OR price LIKE 'Test Price' OR description LIKE 'Test desc'")
    const result = await pool.query('DELETE FROM users WHERE email = $1', ['john.doe@domain.com'])
    await pool.query('DELETE FROM users WHERE email = $1', ['jane.doe@domain.com'])
});

afterAll( async () => {
    await pool.query("DELETE FROM items WHERE name LIKE 'Test name' OR price LIKE 'Test Price' OR description LIKE 'Test desc'")
    const result = await pool.query('DELETE FROM users WHERE email = $1', ['jd@domain.com'])
    await pool.query('DELETE FROM users WHERE email = $1', ['jane.doe@domain.com'])
    await pool.end()
});

describe('User signup and login', () => {
    test('should create a new user', async () => {
        const data = {
            id: '',
            name: 'John Doe',
            email: 'jd@domain.com',
            password: '12345',
            token: ''
        }
        const response = await request(app)
            .post('/api/users/signup')
            .set('Accept', 'application/json')
            .send(data)
        data.id = response.body.id
        data.name = response.body.name
        data.email = response.body.email
        data.token = response.body.token
        //console.log(response.body);

        expect(response.status).toEqual(201)
        expect(response.body.id).toBeTruthy()
        expect(response.body.name).toEqual(data.name)
        expect(response.body.email).toEqual(data.email)
        expect(response.body.token).toBeTruthy()
    })

    test('should not allow create user with missing fields', async () => {
        const data = {
            name: 'John Doe',
            email: '', // Missing email
            password: '12345'
        };

        const response = await request(app)
            .post('/api/users/signup')
            .set('Accept', 'application/json')
            .send(data);

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({ error: 'Missing a value' });
    })

    test('should not create a user with duplicate email', async () => {
        const data = {
            name: 'John Doe',
            email: 'john.doe@domain.com',
            password: '12345'
        };

        // First signup
        await request(app)
            .post('/api/users/signup')
            .set('Accept', 'application/json')
            .send(data);

        // Second signup with the same email
        const response = await request(app)
            .post('/api/users/signup')
            .set('Accept', 'application/json')
            .send(data);

        expect(response.status).toEqual(422);
        expect(response.body).toEqual({ error: 'User already exists' });
    });

    test('should login a user', async () => {
        const data = {
            id: '',
            name: 'John Doe',
            email: 'john.doe@domain.com',
            password: '12345',
            token: ''
        }
        const responseSignup = await request(app)
            .post('/api/users/signup')
            .set('Accept', 'application/json')
            .send(data)

        const loginData = {
            email: responseSignup.body.email,
            password: '12345'
        }

        const response = await request(app)
            .post('/api/users/login')
            .set('Accept', 'application/json')
            .send(loginData)

        expect(response.status).toEqual(200)
        expect(response.body.email).toEqual(loginData.email)
    })

    test('should not login a user with wrong password', async () => {
        const data = {
            id: '',
            name: 'John Doe',
            email: 'john.doe@domain.com',
            password: '12345',
            token: ''
        }
        const responseSignup = await request(app)
            .post('/api/users/signup')
            .set('Accept', 'application/json')
            .send(data)

        const loginData = {
            email: responseSignup.body.email,
            password: '123'
        }

        const response = await request(app)
            .post('/api/users/login')
            .set('Accept', 'application/json')
            .send(loginData)

        expect(response.status).toEqual(401)
        expect(response.body).toEqual({ message: 'Could not identify user, credentials seem to be wrong' });
    })

    test('should not login a user with wrong email', async () => {
        const data = {
            id: '',
            name: 'John Doe',
            email: 'john.doe@domain.com',
            password: '12345',
            token: ''
        }
        const responseSignup = await request(app)
            .post('/api/users/signup')
            .set('Accept', 'application/json')
            .send(data)

        const loginData = {
            email: 'jane.doe@domail.com',
            password: '12345'
        }

        const response = await request(app)
            .post('/api/users/login')
            .set('Accept', 'application/json')
            .send(loginData)

        expect(response.status).toEqual(401)
        expect(response.body).toEqual({ message: 'Could not identify user, credentials seem to be wrong' });
    })
})

