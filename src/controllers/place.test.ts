import { NextFunction, Request, Response } from 'express';
import { CustomError, HTTPError } from '../interface/error';
import { PlaceRepository } from '../repositories/place.js';
import { UserRepository } from '../repositories/user.js';
import { PlacesController } from './place.js';

const mockResponse = { places: ['Roma'] };

describe("Given the place's controller,", () => {
    const placeRepo = PlaceRepository.getInstance();
    const userRepo = UserRepository.getInstance();

    placeRepo.getAll = jest.fn().mockResolvedValue(['Roma']);

    const robotController = new PlacesController(placeRepo, userRepo);

    const req: Partial<Request> = {};
    const res: Partial<Response> = {
        json: jest.fn(),
    };
    const next: NextFunction = jest.fn();

    describe('When we instantiate getAll()', () => {
        test('It should return an array of all the places', async () => {
            await robotController.getAll(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith(mockResponse);
        });
    });

    describe('When productController is not valid', () => {
        let error: CustomError;
        beforeEach(() => {
            error = new HTTPError(404, 'Not found', 'Not found id');
        });
        PlaceRepository.prototype.getAll = jest
            .fn()
            .mockRejectedValue(['product']);

        const placeRepo = PlaceRepository.getInstance();
        const repoUser = UserRepository.getInstance();
        const productController = new PlacesController(placeRepo, repoUser);
        const req: Partial<Request> = {};
        const resp: Partial<Response> = {
            json: jest.fn(),
        };
        const next: NextFunction = jest.fn();

        test('should return an error', async () => {
            error.message = 'Not found id';
            error.statusCode = 404;
            error.statusMessage = 'Not found';
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
            expect(error).toHaveProperty('statusCode', 404);
            expect(error).toHaveProperty('statusMessage', 'Not found');
            expect(error).toHaveProperty('message', 'Not found id');
            expect(error).toHaveProperty('name', 'HTTPError');
        });

        test('Then getAll should return an error', async () => {
            placeRepo.getAll = jest.fn().mockRejectedValue('');
            error = new HTTPError(
                503,
                'Service unavailable',
                'Not found service'
            );
            await productController.getAll(
                req as Request,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });
    });
});
