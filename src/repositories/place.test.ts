import mongoose from 'mongoose';
import { dbConnect } from '../db.connect';
import { Place } from '../entities/place';
import { PlaceRepository } from './place';

describe("Given the Place's repository,", () => {
    const mockData = [
        { city: 'Madrid', description: 'cute' },
        { city: 'Buenos Aires', description: 'nice' },
    ];
    const newMockData = { city: 'jamaica', description: 'very nice' };

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
            const result = await placeRepo.create(newMockData);
            expect(result.city).toEqual('jamaica');
        });

        test('and receives an invalid data, it should return an error', async () => {
            expect(async () => {
                await placeRepo.create(mockData[5]);
            }).rejects.toThrowError();
        });
    });

    describe('When we instantiate query()', () => {
        test('Then it should query return the search place', async () => {
            const result = await placeRepo.query('city', 'jamaica');
            expect(result[0].city).toEqual(newMockData.city);
        });
    });

    describe('When we instantiate update()', () => {
        const updatedMockData = {
            city: 'Barcelona',
            description: 'very very nice',
        };
        test('Then it should update a city', async () => {
            const result = await placeRepo.update(testIds[0], updatedMockData);
            expect(result.city).toEqual('Barcelona');
        });

        test('and receives an invalid id, it should return an error', async () => {
            expect(async () => {
                await placeRepo.update(
                    '123456789012345678901234',
                    updatedMockData
                );
            }).rejects.toThrowError();
        });
    });

    describe('When we instantiate destroyer()', () => {
        test('Then it should destroyer return the search place', async () => {
            const result = await placeRepo.destroyer(testIds[0]);
            expect(result).toEqual({ id: testIds[0] });
        });

        test('and receives an invalid id, it should return an error', async () => {
            expect(async () => {
                await placeRepo.destroyer('pepe');
            }).rejects.toThrowError();
        });
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });
});
