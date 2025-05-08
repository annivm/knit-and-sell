import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "../app";
import { ItemCreateRequest } from "../models/items.model";
import { pool } from "../db/db";

const loggedInUser = {
    id: '',
    email: '',
    token: ''
};

beforeAll( async() => {
    await pool.query('DELETE FROM users WHERE email = $1', ['john.doe@domain.com'])

    const data = {
        name: 'John Doe',
        email: 'john.doe@domain.com',
        password: '12345'
    }

    const response = await request(app)
        .post('/api/users/signup')
        .set('Accept', 'application/json')
        .send(data)
    loggedInUser.id = response.body.id
    loggedInUser.email = response.body.email
    loggedInUser.token = response.body.token

    console.log(loggedInUser);

})

afterEach( async () => {
    await pool.query("DELETE FROM items WHERE name LIKE 'Test name' OR price LIKE 'Test Price' OR description LIKE 'Test desc'")

});

afterAll( async () => {
    await pool.query("DELETE FROM items WHERE name LIKE 'Test name' OR price LIKE 'Test Price' OR description LIKE 'Test desc'")
    await pool.query("DELETE FROM items WHERE name LIKE 'Updated name'")
    await pool.end()
});

describe('GET items endpoint', () => {
    test('should return 200', (done) =>{
        request(app)
            .get('/api/items')
            .expect(200)
            .end(done)
    })
    test('should return 200 and valid JSON', async () =>{
        const response = await request(app)
            .get('/api/items')
            .set('Accept', 'application/json')
        expect(response.status).toEqual(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                  id: 1,
                  name: 'Autumn Breeze Sweater',
                  price: '49.90',
                }),
                expect.objectContaining({
                  id: 2,
                  name: 'Winter Comfort Blanket',
                  price: '89.00',
                }),
              ]),
        )
    })
})

describe('GET item by id endpoint', () =>{
    test('should return 200', (done) =>{
        request(app)
            .get('/api/items/2')
            .expect(200)
            .end(done)
    })

    test('should return 200 and an item', async() => {
        const response = await request(app)
            .get('/api/items/2')
            .set('Accept', 'application/json')
        expect(response.status).toEqual(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toEqual(
                expect.objectContaining({
                  id: 2,
                  name: 'Winter Comfort Blanket',
                  price: '89.00',
                })
        )
    })

    test('should return 404 and not found', async () =>{
        const response = await request(app)
            .get('/api/items/202')
            .set('Accept', 'application/json');
            expect(response.status).toEqual(404);
            expect(response.body).toEqual( {'message': 'Item not found'});
    })
})


describe('POST item endpoint', () => {
    test('should create a new item', async () =>{

        const item: ItemCreateRequest = {
            name: 'Test name',
            price: 'Test price',
            description: 'Test desc',
            owner_id: loggedInUser.id
        }

        const response = await request(app)
            .post('/api/items')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + loggedInUser.token)
            .set('Content', 'application/json')
            .send(item)
        expect(response.status).toEqual(201)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body.id).toBeTruthy() // tarkistaa vain onko olemassa
        expect(response.body.name).toEqual('Test name')
        expect(response.body.price).toEqual('Test price')
        expect(response.body.description).toEqual('Test desc')
    })

    test('should not allow a duplicate item', async () => {
        const item = {
            name: 'Winter Comfort Blanket',
            price: '89.00',
            description: 'Extra soft crocheted blanket to keep you warm through the Nordic winters'
        };
        const response = await request(app)
        .post('/api/items')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + loggedInUser.token)
        .send(item);
        expect(response.status).toEqual(400);
        expect(response.body.error.some((e: any) => e.message.includes('Item with this name already exist'))).toBeTruthy();
    });

    test('should not allow no name property', async () =>{
        const item = {
            price: 'Test price',
            description: 'Test desc'
        };
        const response = await request(app)
            .post('/api/items')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + loggedInUser.token)
            .send(item)
        expect(response.status).toEqual(400);
        expect(response.body.error.some((e: any) => e.message.includes('Required'))).toBeTruthy();
    })

    test('should not allow no price property', async () =>{
        const item = {
            name: 'Test name',
            description: 'Test desc'
        };
        const response = await request(app)
            .post('/api/items')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + loggedInUser.token)
            .send(item)
        expect(response.status).toEqual(400);
        expect(response.body.error.some((e: any) => e.message.includes('Required'))).toBeTruthy();
    })

    test('should not allow no description property', async () =>{
        const item = {
            name: 'Test name',
            price: 'Test price'
        };
        const response = await request(app)
            .post('/api/items')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + loggedInUser.token)
            .send(item)
        expect(response.status).toEqual(400);
        expect(response.body.error.some((e: any) => e.message.includes('Required'))).toBeTruthy();
    })

    test('should not allow empty name property', async () =>{
        const item = {
            name: '',
            price: 'Test price',
            description: 'Test desc'
        };
        const response = await request(app)
            .post('/api/items')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + loggedInUser.token)
            .send(item)
        expect(response.status).toEqual(400);
        expect(response.body.error.some((e: any) => e.message.includes('Name must be at least 2 character'))).toBeTruthy();
    })

    test('should not allow empty price property', async () =>{
        const item = {
            name: 'Test name',
            price: '',
            description: 'Test desc'
        };
        const response = await request(app)
            .post('/api/items')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + loggedInUser.token)
            .send(item)
        expect(response.status).toEqual(400);
        expect(response.body.error.some((e: any) => e.message.includes('Price must be at least 1 character'))).toBeTruthy();
    })

    test('should not allow empty description property', async () =>{
        const item = {
            name: 'Test name',
            price: 'Test price',
            description: ''
        };
        const response = await request(app)
            .post('/api/items')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + loggedInUser.token)
            .send(item)
        expect(response.status).toEqual(400);
        expect(response.body.error.some((e: any) => e.message.includes('Description must be at least 4 character'))).toBeTruthy();
    })


    test('should not allow too short name', async () => {
        const item = {
            name: 'T',
            price: 'Test price',
            description: 'Test desc'
        };
        const response = await request(app)
        .post('/api/items')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + loggedInUser.token)
        .send(item);
        expect(response.status).toEqual(400);
        expect(response.body.error.some((e: any) => e.message.includes('Name must be at least 2 character'))).toBeTruthy();
    });

    test('should not allow too short price', async () => {
        const item = {
            name: 'Test name',
            price: '',
            description: 'Test desc'
        };
        const response = await request(app)
        .post('/api/items')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + loggedInUser.token)
        .send(item);
        expect(response.status).toEqual(400);
        expect(response.body.error.some((e: any) => e.message.includes('Price must be at least 1 character'))).toBeTruthy();
    });

    test('should not allow too short desc', async () => {
        const item = {
            name: 'Test name',
            price: 'Test price',
            description: 'T'
        };
        const response = await request(app)
        .post('/api/items')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + loggedInUser.token)
        .send(item);
        expect(response.status).toEqual(400);
        expect(response.body.error.some((e: any) => e.message.includes('Description must be at least 4 character'))).toBeTruthy();
    });
})

describe('DELETE item endpoint', () => {
    test('should delete item by id', async() => {
        const item = {
            name: 'Test name',
            price: 'Test price',
            description: 'Test desc',
            owner_id: loggedInUser.id
        };
        const postResponse = await request(app)
        .post('/api/items')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + loggedInUser.token)
        .set('Content', 'application/json')
        .send(item)

        const postId = postResponse.body.id

        const response = await request(app)
            .delete(`/api/items/${postId}`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + loggedInUser.token)
        expect(response.status).toEqual(200)
        expect(response.body).toEqual({ message: "Item deleted successfully" })
    });

    test('should not allow delete non-existing item', async() => {
        const response = await request(app)
            .delete('/api/items/10000001')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + loggedInUser.token)

        expect(response.status).toEqual(404)
        expect(response.body).toEqual({ message: "Item not found" })
    });

    test('should not allow delete without authentication', async() => {
        const response = await request(app)
            .delete('/api/items/1')
            .set('Accept', 'application/json');
        expect(response.status).toEqual(401);
        expect(response.body).toEqual({ message: 'Authentication failed: No token provided'});
    });

    test('should not allow delete if not owner', async() => {
        const response = await request(app)
            .delete('/api/items/1')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + loggedInUser.token);
        expect(response.status).toEqual(403);
        expect(response.body).toEqual({ message: 'Forbidden' });
    });

})

describe('PUT item endpoint', () => {
    test('should update item by id', async() => {
        const item = {
            name: 'Test name',
            price: 'Test price',
            description: 'Test desc',
            owner_id: loggedInUser.id
        };
        const postResponse = await request(app)
            .post('/api/items')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + loggedInUser.token)
            .set('Content', 'application/json')
            .send(item)

        const postId = postResponse.body.id

        const updatedItem = {
            id: postId,
            name: 'Updated name',
            price: 'Updated price',
            description: 'Updated desc'
        }

        const response = await request(app)
            .put(`/api/items`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + loggedInUser.token)
            .send(updatedItem)

        expect(response.status).toEqual(200)
        expect(response.body).toEqual(
                expect.objectContaining({
                  id: postId,
                  name: 'Updated name',
                  price: 'Updated price',
                })
        )
    })

    test('should not allow update non-existing item', async() => {
        const updatedItem = {
            id: 10000001,
            name: 'Test name',
            price: 'Test price',
            description: 'Test desc'
        }

        const response = await request(app)
            .put(`/api/items`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + loggedInUser.token)
            .send(updatedItem)

        expect(response.status).toEqual(400)
        expect(response.body).toEqual({ error: "Trying to update a non existing item" })
    })

    test('should not allow update withou authentication', async() => {
        const updatedItem = {
            id: 1,
            name: 'Test name',
            price: 'Test price',
            description: 'Test desc'
        }

        const response = await request(app)
            .put(`/api/items`)
            .set('Accept', 'application/json')
            .send(updatedItem)

        expect(response.status).toEqual(401)
        expect(response.body).toEqual({ message: 'Authentication failed: No token provided'})
    })

    test('should not allow update if not owner', async() => {
        const updatedItem = {
            id: 1,
            name: 'Test name',
            price: 'Test price',
            description: 'Test desc'
        }

        const response = await request(app)
            .put(`/api/items`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + loggedInUser.token)
            .send(updatedItem)

        expect(response.status).toEqual(403)
        expect(response.body).toEqual({ error: 'Forbidden' })
    })
})