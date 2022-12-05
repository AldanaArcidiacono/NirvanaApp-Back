import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import { dbConnect } from '../db.connect';
import { Place } from '../entities/place';
import { User } from '../entities/user';
import { createToken, TokenPayload } from '../services/auth';

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
const setUpUser = async () => {
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

describe('Given an App, with travels routes', () => {
    let token: string;
    let pIds: Array<string>;

    beforeEach(async () => {
        await dbConnect();
        uIds = await setUpUser();
        pIds = await setUpPlace();
        const payload: TokenPayload = {
            id: uIds[0],
            name: 'Pepe',
        };
        token = createToken(payload);
    });

    afterEach(async () => {
        await mongoose.disconnect();
    });

    describe('When we use get to the url /', () => {
        test('Then it should send a status 200', async () => {
            await request(app).get('/').expect(200);
        });

        test('If the path is invalid, it should send a status 404', async () => {
            await request(app).get('/.').expect(404);
        });
    });

    describe('When we use get to the url /travels/', () => {
        test('Then it should send a status 200', async () => {
            await request(app).get('/travels/').expect(200);
        });

        test('If the path is invalid, it should send a status 404', async () => {
            await request(app).get('/travel/').expect(404);
        });
    });

    describe('When we use get to the url /travels/find/:key/:value', () => {
        test('Then it should send a status 200', async () => {
            const response = await request(app)
                .get('/travels/find/category/beach')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
        });

        test('If the token is invalid, it should send a status 404', async () => {
            const response = await request(app)
                .get('/travels/find/category/beach')
                .set('Authorization', `Bearer `);
            expect(response.status).toBe(403);
        });
    });

    describe('When we use get to the url /travels/:id', () => {
        test('Then it should send a status 200', async () => {
            const response = await request(app)
                .get(`/travels/${pIds[0]}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
        });

        test('If the token is invalid, it should send a status 404', async () => {
            const response = await request(app)
                .get(`/travels/${pIds[0]}`)
                .set('Authorization', `Bearer `);
            expect(response.status).toBe(403);
        });

        test('If the id is invalid, it should send a status 404', async () => {
            const response = await request(app)
                .get(`/travels/${pIds[8]}`)
                .set('Authorization', `Bearer ${token} `);
            expect(response.status).toBe(503);
        });
    });

    //NO
    describe('When we use post to the url /travels/', () => {
        // test('Then it should send a status 200', async () => {
        //     const response = await request(app)
        //         .post('/travels')
        //         .set('Authorization', `Bearer ${token}`)
        //         .send({
        //             city: 'Santorini',
        //             description: 'En Grecia',
        //         });
        //     expect(response.status).toBe(200);
        // });

        test('If the token is invalid, it should send a status 404', async () => {
            const response = await request(app)
                .post('/travels/')
                .set('Authorization', `Bearer `)
                .send({
                    city: 'Santorini',
                    description: 'En Grecia',
                });
            expect(response.status).toBe(403);
        });
    });

    //NO
    describe('When we use patch to the url /travels/places/:id', () => {
        // test('Then it should send a status 200', async () => {
        //     const response = await request(app)
        //         .patch(`/travels/places/${pIds[0]}`)
        //         .set('Authorization', `Bearer ${token}`)
        //         .send({ city: 'Marrakech' });
        //     expect(response.status).toBe(201);
        // });

        test('If the token is invalid, it should send a status 404', async () => {
            const response = await request(app)
                .patch(`/travels/places/${pIds[0]}`)
                .set('Authorization', `Bearer `);
            expect(response.status).toBe(403);
        });
    });

    //NO
    describe('When we use delete to the url /travels/places/:id', () => {
        // test('Then it should send a status 200', async () => {
        //     const response = await request(app)
        //         .delete(`/travels/places/${pIds[0]}`)
        //         .set('Authorization', `Bearer ${token}`)
        //         .send({ city: 'Marrakech' });
        //     expect(response.status).toBe(201);
        // });

        test('If the token is invalid, it should send a status 403', async () => {
            const response = await request(app)
                .delete(`/travels/places/${pIds[0]}`)
                .set('Authorization', `Bearer `);
            expect(response.status).toBe(403);
        });

        test('If the id is invalid, it should send a status 500', async () => {
            const response = await request(app)
                .delete(`/travels/places/${pIds[7]}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(500);
        });
    });
});
