import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { CustomError, HTTPError } from '../interface/error';
import { PlaceRepository } from '../repositories/place';
import { UserRepository } from '../repositories/user';
import { createToken, passwdValidate } from '../services/auth';
import { UsersController } from './user';

jest.mock('../services/auth');

const userId = new Types.ObjectId();
const mockData = [
    {
        name: 'Pepe',
        email: 'pepe@gmail.com',
        id: userId,
        password: '1234',
    },
];
const mockResponse = { users: ['Marcos'] };

describe('Given the users controller,', () => {
    describe('When we instantiate it,', () => {
        let userRepo: UserRepository;
        let placeRepo: PlaceRepository;
        let userController: UsersController;
        let req: Partial<Request>;
        let res: Partial<Response>;
        let next: NextFunction;

        beforeEach(() => {
            userRepo = UserRepository.getInstance();
            placeRepo = PlaceRepository.getInstance();

            userRepo.create = jest.fn().mockResolvedValue(mockData[0]);
            userRepo.query = jest.fn().mockResolvedValue(mockData[0]);
            userRepo.get = jest.fn().mockResolvedValue(mockResponse);

            userController = new UsersController(userRepo, placeRepo);

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

        test('Then get should have been called', async () => {
            req.params = { id: '234' };
            await userController.get(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ users: mockResponse });
        });
    });
});

describe('Given the users controller, but', () => {
    const userRepo = UserRepository.getInstance();
    const placeRepo = PlaceRepository.getInstance();

    let error: CustomError;
    beforeEach(() => {
        error = new HTTPError(404, 'Not found', 'Not found id');
    });

    const mockResponse = { users: ['Marcos'] };

    userRepo.create = jest.fn().mockResolvedValue(['Roma']);
    userRepo.query = jest.fn().mockResolvedValue(mockData[0]);
    userRepo.get = jest.fn().mockResolvedValue(mockResponse);
    const userController = new UsersController(userRepo, placeRepo);

    const req: Partial<Request> = {};
    const res: Partial<Response> = {
        json: jest.fn(),
    };
    const next: NextFunction = jest.fn();

    describe('When something goes wrong', () => {
        test('Then register should throw an error', async () => {
            await userController.register(
                req as Request,
                res as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });

        test('Then login should throw an error', async () => {
            userRepo.query = jest.fn().mockResolvedValue({
                id: '637d1d346346f6ff04b55896',
                name: 'pepe',
                role: 'admin',
            });
            await userController.login(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(HTTPError);
        });
    });
});
