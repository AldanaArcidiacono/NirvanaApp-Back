import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { CustomError, HTTPError } from '../interface/error';
import { PlaceRepository } from '../repositories/place';
import { UserRepository } from '../repositories/user';
import { UsersController } from './user';

jest.mock('../services/auth');

describe('Given the users controller,', () => {
    describe('When we instantiate it,', () => {
        const userRepo = UserRepository.getInstance();
        const placeRepo = PlaceRepository.getInstance();

        const userId = new Types.ObjectId();
        const userController = new UsersController(userRepo, placeRepo);

        const mockData = [
            { name: 'Pepe', id: userId },
            { name: 'Ernesto', id: userId },
        ];

        userRepo.post = jest.fn().mockResolvedValue({
            id: userId,
            name: 'Pepe',
        });

        let req: Partial<Request>;
        let res: Partial<Response>;
        let next: NextFunction;
        beforeEach(() => {
            req = {};
            res = {};
            res.status = jest.fn().mockReturnValue(res);
            next = jest.fn();
            res.json = jest.fn();
        });

        test('Then register should have been called', async () => {
            await userController.register(
                req as Request,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalledWith({
                user: {
                    id: userId,
                    name: 'Pepe',
                },
            });
        });

        test('Then login should have been called', async () => {
            req.body = { mockData };
            await userController.register(
                req as Request,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalledWith({ user: mockData[0] });
        });
    });

    describe('when we dont instantiate it', () => {
        const error: CustomError = new HTTPError(
            404,
            'Not found id',
            'message of error'
        );
        const userRepo = UserRepository.getInstance();
        const placeRepo = PlaceRepository.getInstance();

        const userController = new UsersController(userRepo, placeRepo);

        const req: Partial<Request> = {};
        const res: Partial<Response> = {
            json: jest.fn(),
        };
        const next: NextFunction = jest.fn();

        test('Then if something went wrong register should throw an error', async () => {
            await userController.register(
                req as Request,
                res as Response,
                next
            );
            expect(error).toBeInstanceOf(HTTPError);
        });

        test('Then if something went wrong login should throw an error', async () => {
            await userController.login(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(HTTPError);
        });

        test('Then if there is not password login should throw an error', async () => {
            userRepo.find = jest.fn().mockResolvedValue({
                id: '637d1d346346f6ff04b55896',
                name: 'pepe',
                role: 'admin',
            });

            await userController.login(req as Request, res as Response, next);

            expect(error).toBeInstanceOf(HTTPError);
        });
    });
});
