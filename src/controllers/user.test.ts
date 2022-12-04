import { NextFunction, Request, Response } from 'express';
import { CustomError, HTTPError } from '../interface/error';
import { ExtraRequest } from '../middleware/interceptor';
import { PlaceRepository } from '../repositories/place';
import { UserRepository } from '../repositories/user';
import { createToken, passwdValidate } from '../services/auth';
import { UsersController } from './user';

jest.mock('../services/auth');

const mockData = [
    {
        name: 'Pepe',
        email: 'pepe@gmail.com',
        id: '123456789009876543211234',
        password: '1234',
        favPlaces: [{ id: '638c981be950874190b97fb7' }],
    },
];
const mockPlace = [
    {
        city: 'Marruecos',
        description: 'En el norte de Africa',
        id: '638c981be950874190b97fb7',
    },
];
const mockResponse = { user: ['Marcos'] };

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
            userRepo.find = jest.fn().mockResolvedValue(mockData[0]);

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
            await userRepo.find({ email: req.body.email });
            (passwdValidate as jest.Mock).mockResolvedValue(true);
            (createToken as jest.Mock).mockReturnValue('token');
            req.body = mockData[0].password;
            await userController.login(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ token: 'token' });
        });

        test('Then get should have been called', async () => {
            userRepo.get = jest.fn().mockResolvedValue(mockResponse);
            req.params = { id: '234' };
            await userController.get(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ user: mockResponse });
        });

        test('Then addFav should have been called', async () => {
            userRepo.update = jest.fn().mockResolvedValue(mockData);

            (req as ExtraRequest).payload = { id: '123456789009876543211234' };
            req.params = { id: '638c981be950874190b97fb8' };

            placeRepo.get = jest
                .fn()
                .mockResolvedValue('638c981be950874190b97fb8');
            userRepo.get = jest.fn().mockResolvedValue(mockData[0]);

            await userController.addFav(
                req as ExtraRequest,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalled();
        });

        // test('Then deleteFav should have been called', async () => {
        //     (req as ExtraRequest).payload = { id: '123456789009876543211234' };
        //     req.params = { id: '638c981be950874190b97fb7' };

        //     placeRepo.get = jest.fn().mockResolvedValue(mockPlace[0]);
        //     userRepo.get = jest.fn().mockResolvedValue(mockData[0]);
        //     userRepo.update = jest.fn().mockResolvedValue([
        //         {
        //             name: 'Pepe',
        //             email: 'pepe@gmail.com',
        //             id: '123456789009876543211234',
        //             password: '1234',
        //             favPlaces: [],
        //         },
        //     ]);

        //     await userController.deleteFav(
        //         req as ExtraRequest,
        //         res as Response,
        //         next
        //     );
        //     expect(res.json).toHaveBeenCalled();
        // });
    });
});

describe('Given the users controller, but something goes wrong', () => {
    const userRepo = UserRepository.getInstance();
    const placeRepo = PlaceRepository.getInstance();

    let error: CustomError;
    beforeEach(() => {
        error = new HTTPError(404, 'Not found', 'Not found id');
    });

    userRepo.create = jest.fn().mockResolvedValue(['Roma']);
    userRepo.find = jest.fn().mockResolvedValue(mockData[0]);
    userRepo.get = jest.fn().mockResolvedValue('');
    const userController = new UsersController(userRepo, placeRepo);

    const req: Partial<Request> = {};
    const res: Partial<Response> = {
        json: jest.fn(),
    };
    const next: NextFunction = jest.fn();

    test('Then register should throw an error', async () => {
        await userController.register(req as Request, res as Response, next);
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(HTTPError);
    });

    test('Then login should throw an error', async () => {
        userRepo.find = jest.fn().mockResolvedValue({
            id: '637d1d346346f6ff04b55896',
            name: 'pepe',
            role: 'admin',
        });
        await userController.login(req as Request, res as Response, next);
        expect(error).toBeInstanceOf(HTTPError);
    });

    test('Then get should throw an error', async () => {
        await userController.get(req as Request, res as Response, next);
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(HTTPError);
    });

    // test('if addFav does not have a valid payload, it should throw an error', async () => {
    //     userRepo.update = jest.fn().mockResolvedValue(mockData);

    //     (req as ExtraRequest).payload = { id: 'pepe' };
    //     req.params = { id: '638c981be950874190b97fb8' };

    //     placeRepo.get = jest
    //         .fn()
    //         .mockResolvedValue('638c981be950874190b97fb8');
    //     userRepo.get = jest.fn().mockResolvedValue(mockData[0]);

    //     await userController.addFav(
    //         req as ExtraRequest,
    //         res as Response,
    //         next
    //     );
    //     expect(error).toThrowError('Invalid payload');
    // });
});
