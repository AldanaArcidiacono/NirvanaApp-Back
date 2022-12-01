import mongoose from 'mongoose';
import { dbConnect } from '../db.connect';
import { Place } from '../entities/place';
import { PlaceRepository } from './place';

describe("Given the Place's repository,", () => {
    const mockData = [
        { city: 'Madrid', description: 'cute' },
        { city: 'Buenos Aires', description: 'nice' },
    ];
    let testIds: Array<string>;

    const setUp = async () => {
        await dbConnect();
        await Place.deleteMany();
        await Place.insertMany(mockData);
        const data = await Place.find();
        testIds = [(data[0].id, data[1].id)];
        return testIds;
    };

    const placeRepo = PlaceRepository.getInstance();

    beforeAll(async () => {
        await setUp();
    });

    describe('When we instantiate getAll() and it has called Model.find', () => {
        test('Then it return all the places', async () => {
            const spyModel = jest.spyOn(Place, 'find');
            const result = await placeRepo.getAll();
            expect(spyModel).toHaveBeenCalled();
            expect(result[0].city).toEqual(mockData[0].city);
        });
    });

    describe('When we instantiate get()', () => {
        test('Then it should return a city', async () => {
            const result = await placeRepo.get(testIds[0]);
            expect(result.city).toEqual(mockData[1].city);
        });

        test('and receives an invalid id, it should return an error', async () => {
            expect(async () => {
                await placeRepo.get(testIds[4]);
            }).rejects.toThrowError();
        });
    });

    describe('When we instantiate create()', () => {
        test('Then it should create a new city', async () => {
            const newMockData = { city: 'Jamaica', description: 'very nice' };
            const result = await placeRepo.create(newMockData);
            expect(result.city).toEqual('Jamaica');
        });

        test('and receives an invalid data, it should return an error', async () => {
            expect(async () => {
                await placeRepo.create(mockData[5]);
            }).rejects.toThrowError();
        });
    });

    describe('When we instantiate update()', () => {
        test('Then it should update a city', async () => {
            const updatedMockData = {
                city: 'Barcelona',
                description: 'very very nice',
            };
            const result = await placeRepo.update(testIds[0], updatedMockData);
            expect(result.city).toEqual('Barcelona');
        });

        test('and receives an invalid id, it should return an error', async () => {
            expect(async () => {
                const updatedMockData = {
                    city: 'Barcelona',
                    description: 'very very nice',
                };
                await placeRepo.update(testIds[0], updatedMockData);
            }).rejects.toThrowError();
        });
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });
});
