import mongoose from 'mongoose';
import { dbConnect } from '../db.connect';
import { Place } from '../entities/place';
import { PlaceRepository } from './place';

describe("Given the Place's repository,", () => {
    const mockData = [
        { city: 'Madrid', description: 'cute' },
        { city: 'Buenos Aires', description: 'nice' },
    ];

    const setUp = async () => {
        await dbConnect();
        await Place.deleteMany();
        await Place.insertMany(mockData);
        const data = await Place.find();
        return [data[0].id, data[1].id];
    };

    const repository = PlaceRepository.getInstance();

    beforeAll(async () => {
        await setUp();
    });

    describe('When we instantiate getAll() and it has called Model.find', () => {
        test('Then it return all the places', async () => {
            const spyModel = jest.spyOn(Place, 'find');
            const result = await repository.getAll();
            expect(spyModel).toHaveBeenCalled();
            expect(result[0].city).toEqual(mockData[0].city);
        });
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });
});
