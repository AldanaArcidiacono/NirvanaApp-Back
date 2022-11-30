import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { CustomError, HTTPError } from '../interface/error';
import { PlaceRepository } from '../repositories/place';
import { UserRepository } from '../repositories/user';
import { createToken, passwdValidate } from '../services/auth';
import { UsersController } from './user';

jest.mock('../services/auth');

describe('Given the users controller,', () => {
    describe('When we instantiate it,', () => {
        const userRepo = UserRepository.getInstance();
        const placeRepo = PlaceRepository.getInstance();

        const userId = new Types.ObjectId();

        const mockData = [
            {
                name: 'Pepe',
                email: 'pepe@gmail.com',
                id: userId,
                password: '1234',
            },
        ];

        userRepo.create = jest.fn().mockResolvedValue(mockData[0]);
        userRepo.query = jest.fn().mockResolvedValue(mockData[0]);

        const userController = new UsersController(userRepo, placeRepo);

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
            expect(res.json).toHaveBeenCalledWith({ user: mockData[0] });
        });

        test('Then login should have been called', async () => {
            req.body = { email: mockData[0].email };
            await userRepo.query({ email: req.body.email });
            (passwdValidate as jest.Mock).mockResolvedValue(true);
            (createToken as jest.Mock).mockReturnValue('token');
            req.body = mockData[0].password;
            await userController.login(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ token: 'token' });
        });
    });
});

describe('Given the users controller, but', () => {
    describe('When something goes wrong', () => {
        const error404: CustomError = new HTTPError(
            404,
            'Not found id',
            'message of error'
        );

        const error503: CustomError = new HTTPError(
            503,
            'Service unavailable',
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

        test('Then register should throw an error', async () => {
            await userController.login(req as Request, res as Response, next);
            expect(error503).toBeInstanceOf(HTTPError);
        });

        test('Then if something went wrong login should throw an error', async () => {
            await userController.login(req as Request, res as Response, next);
            expect(error404).toBeInstanceOf(HTTPError);
        });

        test('Then if there is not password login should throw an error', async () => {
            userRepo.query = jest.fn().mockResolvedValue({
                id: '637d1d346346f6ff04b55896',
                name: 'pepe',
                role: 'admin',
            });

            await userController.login(req as Request, res as Response, next);

            expect(error404).toBeInstanceOf(HTTPError);
        });
    });
});
