import { NextFunction, Request, Response } from 'express';
import { CustomError, HTTPError } from '../interface/error';
import { ExtraRequest } from '../middleware/interceptor';
import { PlaceRepository } from '../repositories/place.js';
import { UserRepository } from '../repositories/user.js';
import { PlacesController } from './place.js';
import { Types } from 'mongoose';

describe("Given the place's controller,", () => {
    const mockPlace = {
        places: [{ city: 'Roma', description: 'super-cute' }],
    };

    const mockUser = {
        users: { id: '1a', name: 'Sergio', email: 'sergio@gmil.com' },
    };

    const mockResponse = { places: ['Madrid'] };

    const placeRepo = PlaceRepository.getInstance();
    const userRepo = UserRepository.getInstance();

    const userId = new Types.ObjectId();

    userRepo.get = jest.fn().mockResolvedValue({
        id: userId,
        name: 'Sergio',
        email: 'sergio@gmil.com',
        createdPlaces: [],
    });
    userRepo.update = jest.fn().mockResolvedValue(mockPlace);

    const placeController = new PlacesController(placeRepo, userRepo);

    const req: Partial<Request> = {};
    const res: Partial<Response> = {
        json: jest.fn(),
        status: jest.fn(),
    };
    const next: NextFunction = jest.fn();

    describe('When we instantiate getAll()', () => {
        placeRepo.getAll = jest
            .fn()
            .mockResolvedValue([{ city: 'Roma', description: 'super-cute' }]);
        test('It should return an array of all the places', async () => {
            await placeController.getAll(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith(mockPlace);
        });
    });

    describe('When we instantiate get()', () => {
        placeRepo.get = jest.fn().mockResolvedValue(mockResponse);
        test('It should return one place', async () => {
            req.params = { id: '9' };
            await placeController.get(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith(mockPlace);
        });
    });

    describe('When we instantiate find()', () => {
        req.params = { key: 'category' };
        req.params = { value: 'beach' };
        placeRepo.query = jest.fn().mockResolvedValue({ category: 'beach' });
        test('It should return the place search by params', async () => {
            await placeController.find(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({
                places: { category: 'beach' },
            });
        });
    });

    describe('When we instantiate post()', () => {
        placeRepo.create = jest.fn().mockResolvedValue({
            ...mockPlace.places[0],
            id: '123456789012345678901234',
        });
        test('It should return one place', async () => {
            (req as ExtraRequest).payload = { id: userId };
            req.body = {};

            await placeController.post(
                req as ExtraRequest,
                res as Response,
                next
            );

            await userRepo.get(mockUser.users.id);
            await placeRepo.create(mockPlace.places[0]);

            expect(res.json).toHaveBeenCalledWith(mockPlace);
        });
    });

    describe('When we instantiate patch()', () => {
        test('It should return one place', async () => {
            const updatedMock = {
                places: [{ city: 'Roma', description: 'very cute' }],
            };
            placeRepo.update = jest.fn().mockResolvedValue(updatedMock.places);

            await placeController.patch(
                req as ExtraRequest,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalledWith(updatedMock);
        });
    });

    describe('When we instantiate delete()', () => {
        test('It should return the deleted id', async () => {
            (req as ExtraRequest).params = { id: '123456789012345678901234' };
            req.body = {};
            placeRepo.destroyer = jest.fn().mockResolvedValue(mockPlace);

            await placeController.delete(
                req as ExtraRequest,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalledWith({
                id: '123456789012345678901234',
            });
        });
    });
});

describe("Given the place's controller but,", () => {
    describe('When placeController is not valid', () => {
        let error: CustomError;
        beforeEach(() => {
            error = new HTTPError(404, 'Not found', 'Not found id');
        });

        const placeRepo = PlaceRepository.getInstance();
        const repoUser = UserRepository.getInstance();
        const placeController = new PlacesController(placeRepo, repoUser);
        const req: Partial<Request> = {};
        const resp: Partial<Response> = {
            json: jest.fn(),
        };
        const next: NextFunction = jest.fn();

        test('Then getAll() should return an error', async () => {
            placeRepo.getAll = jest.fn().mockRejectedValue('');
            error = new HTTPError(
                503,
                'Service unavailable',
                'Not found service'
            );
            await placeController.getAll(
                req as Request,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });

        test('Then get() should return an error', async () => {
            placeRepo.get = jest.fn().mockRejectedValue('');
            error = new HTTPError(
                503,
                'Service unavailable',
                'Not found service'
            );
            await placeController.get(req as Request, resp as Response, next);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });

        test('Then find() should return an error', async () => {
            placeRepo.query = jest.fn().mockRejectedValue('');
            error = new HTTPError(
                503,
                'Service unavailable',
                'Not found service'
            );
            await placeController.find(req as Request, resp as Response, next);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });

        test('Then post() should return an error', async () => {
            placeRepo.create = jest.fn().mockRejectedValue('');
            error = new HTTPError(
                503,
                'Service unavailable',
                'Not found service'
            );
            await placeController.post(req as Request, resp as Response, next);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });

        test('Then patch() should return an error', async () => {
            placeRepo.update = jest.fn().mockRejectedValue('');
            error = new HTTPError(
                503,
                'Service unavailable',
                'Not found service'
            );
            await placeController.patch(req as Request, resp as Response, next);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });

        test('Then delete() should return an error', async () => {
            placeRepo.destroyer = jest.fn().mockRejectedValue('');
            error = new HTTPError(
                503,
                'Service unavailable',
                'Not found service'
            );
            await placeController.delete(
                req as Request,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });
    });
});
