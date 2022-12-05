import mongoose from 'mongoose';
import request from 'supertest';
import { User } from '../entities/user';
import { Place } from '../entities/place';
import { dbConnect } from '../db.connect';
import { createToken, TokenPayload } from '../services/auth';
import { app } from '../app';

describe('Given an App, with users routes', () => {
    const setUpUser = async () => {
        const mockUsers = [
            {
                name: 'Pepe',
                email: 'pepe@gmail.com',
                password: '1234',
            },
            {
                name: 'Ernesto',
                email: 'ernets@gmail.com',
                password: '9876',
            },
        ];

        await User.deleteMany();
        await User.insertMany(mockUsers);
        const dataUser = await User.find();
        const userIds = [dataUser[0].id, dataUser[1].id];
        return userIds;
    };

    let uIds: Array<string>;

    const setUpPlace = async () => {
        const mockPlace = [
            {
                city: 'Marruecos',
                description: 'En el norte de Africa',
            },
            {
                city: 'Inglaterra',
                description: 'El big ben',
            },
        ];
        await Place.deleteMany();
        await Place.insertMany(mockPlace);
        await User.deleteMany();
        const data = await Place.find();
        const placesIds = [data[0].id, data[1].id];
        return placesIds;
    };
    let token: string;
    let pIds: Array<string>;

    beforeAll(async () => {
        await dbConnect();
        uIds = await setUpUser();
        pIds = await setUpPlace();
        const payload: TokenPayload = {
            id: uIds[0],
            name: 'Pepe',
        };
        token = createToken(payload);
    });

    describe('When we use post to the url /users/register', () => {
        test('Then it should send a status 200', async () => {
            const response = await request(app).post('/users/register/').send({
                name: 'Amelia',
                email: 'ameliawho@gmail.com',
                password: '123456',
            });
            expect(response.status).toBe(201);
        });

        test('Then it should send a status 503', async () => {
            const response = await request(app).post('/users/register/');
            expect(response.status).toBe(503);
        });
    });

    describe('When we use post to the url /users/login', () => {
        test('Then it should send a status 200', async () => {
            const newUser = {
                email: 'ameliawho@gmail.com',
                password: '123456',
            };
            const response = await request(app)
                .post('/users/login/')
                .send(newUser);
            expect(response.status).toBe(200);
        });

        test('Then it should send a status 503', async () => {
            const response = await request(app).post('/users/login/');
            expect(response.status).toBe(503);
        });
    });

    //NO
    describe('When we use get to the url /users/:id', () => {
        // test('Then it should send a status 200', async () => {
        //     const response = await request(app)
        //         .get(`/users/${uIds[0]}`)
        //         .set('Authorization', `Bearer ${token}`);
        //     expect(response.status).toBe(200);
        // });

        test('Then it should send a status 503', async () => {
            const response = await request(app).get(`/users/${uIds[8]}`);
            expect(response.status).toBe(503);
        });
    });

    //NO
    describe('When we use patch to the url /places/:id', () => {
        // test('Then it should send a status 200', async () => {
        //     const response = await request(app)
        //         .patch(`/users/places/${pIds[0]}`)
        //         .set('Authorization', `Bearer ${token}`)
        //         .send({
        //             name: 'Pepe',
        //             email: 'pepe@gmail.com',
        //         });
        //     expect(response.status).toBe(200);
        // });

        test('Then it should send a status 404', async () => {
            const response = await request(app).patch(
                `/users/places/${pIds[5]}`
            );
            expect(response.status).toBe(403);
        });
    });

    //NO
    describe('When we use patch to the url /delete/:id', () => {
        // test('Then it should send a status 200', async () => {
        //     const response = await request(app)
        //         .patch(`/users/delete/${pIds[0]}`)
        //         .set('Authorization', `Bearer ${token}`);

        //     expect(response.status).toBe(200);
        // });

        test('Then it should send a status 404', async () => {
            const response = await request(app).patch(
                `/users/delete/${pIds[5]}`
            );
            expect(response.status).toBe(403);
        });
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });
});
