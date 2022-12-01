import mongoose from 'mongoose';
import { dbConnect } from '../db.connect';
import { User } from '../entities/user';
import { PlaceRepository } from './place';
import { UserRepository } from './user';

describe('Given UserRepository', () => {
    const mockData = [
        {
            name: 'Pepe',
            email: 'pepe@gmail.com',
            password: 'pepe1234',
        },
        {
            name: 'Ernesto',
            email: 'ernest@gmail.com',
            password: '789ErnesT',
        },
    ];

    const userRepo = UserRepository.getInstance();
    PlaceRepository.getInstance();
    let testIds: Array<string>;

    beforeAll(async () => {
        await dbConnect();
        await User.deleteMany();
        await User.insertMany(mockData);
        const data = await User.find();
        testIds = [data[0].id, data[1].id];
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('When we instantiate get()', () => {
        test('Then it should return an user', async () => {
            const result = await userRepo.get(testIds[0]);
            expect(result.name).toEqual(mockData[0].name);
        });

        test('and receives an invalid id, it should return an error', async () => {
            expect(async () => {
                await userRepo.get(testIds[4]);
            }).rejects.toThrowError();
        });
    });

    describe('When we instantiate post()', () => {
        test('Then it should return a new user', async () => {
            const newUser = {
                name: 'Marcos',
                password: '123',
                email: 'marcos@gmail.com',
            };
            await userRepo.create(newUser);
            expect(newUser.name).toEqual('Marcos');
        });

        test('and receives an invalid data it should return an error', async () => {
            expect(async () => {
                await userRepo.create({ password: testIds[2] });
            }).rejects.toThrow();
        });
    });

    describe('When we instantiate find()', () => {
        test('Then it should return one user', async () => {
            await userRepo.query(mockData[0]);
            expect(mockData[0].name).toEqual('Pepe');
        });

        test('and receives an invalid id it should return an error', async () => {
            expect(async () => {
                await userRepo.query({ name: '' });
            }).rejects.toThrow();
        });
    });

    describe('When we instantiate update()', () => {
        test('Then it should return one user', async () => {
            await userRepo.update(testIds[0], mockData[0]);
            expect(mockData[0].name).toEqual('Pepe');
        });

        test('and receives an invalid id it should return an error', async () => {
            expect(async () => {
                await userRepo.update(testIds[4], mockData[5]);
            }).rejects.toThrow();
        });
    });
});
