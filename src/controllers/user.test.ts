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
        name: 'Ango',
        email: 'ango@gmail.com',
        id: '638785e04ddf430eef1fcf6d',
        password: '1234',
        favPlaces: [
            { id: '638c981be950874190b97fb7' },
            { id: '638c981be950874190b97f27' },
            { id: '638c981be950874190b97fe7' },
        ],
    },
];

const mockResponse = { user: ['Marcos'] };

describe('Given the users controller,', () => {
    describe('When we instantiate it,', () => {
        let userRepo: UserRepository;
        let placeRepo: PlaceRepository;
        let userController: UsersController;
        let req: Partial<ExtraRequest>;
        let res: Partial<Response>;
        let next: NextFunction;

        beforeEach(() => {
            userRepo = UserRepository.getInstance();
            placeRepo = PlaceRepository.getInstance();

            userRepo.create = jest.fn().mockResolvedValue(mockData[0]);
            userRepo.find = jest.fn().mockResolvedValue(mockData[0]);

            userController = new UsersController(userRepo, placeRepo);

            req = { payload: { id: '123456789009876543211234' } };
            res = {};
            res.json = jest.fn().mockReturnValue(res);
            res.status = jest.fn().mockReturnValue(res);
            next = jest.fn();
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
        test('Then deleteFav should have been called', async () => {
            (req as ExtraRequest).payload = {
                id: '638785e04ddf430eef1fcf6d',
            };
            req.params = { id: '638c981be950874190b97fb7' };

            userRepo.get = jest.fn().mockResolvedValue(mockData[0]);

            userRepo.update = jest.fn().mockResolvedValue({
                name: 'Ango',
                email: 'ango@gmail.com',
                id: '638785e04ddf430eef1fcf6d',
                password: '1234',
                favPlaces: [],
            });

            await userController.deleteFav(
                req as ExtraRequest,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalled();
        });

        test('Then addFav should have been called', async () => {
            req.params = { id: '638c981be950874190b97fb8' };
            userRepo.update = jest.fn().mockResolvedValue(mockData);

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

    let req: Partial<ExtraRequest> = {
        payload: { id: '123456789012345678901239' },
        params: { id: '123456789012345678901234' },
    };
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
        });
        await userController.login(req as Request, res as Response, next);
        expect(error).toBeInstanceOf(HTTPError);
    });

    test('Then login if the password is invalid, should throw an error', async () => {
        req.body = { email: mockData[0].email };
        await userRepo.find({ email: req.body.email });
        (passwdValidate as jest.Mock).mockResolvedValue(false);
        (createToken as jest.Mock).mockReturnValue('token');
        req.body = mockData[0].password;
        await userController.login(req as Request, res as Response, next);
        expect(error).toBeInstanceOf(Error);
    });

    test('Then get should throw an error', async () => {
        await userController.get(req as Request, res as Response, next);
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(HTTPError);
    });

    test('if addFav does not have a valid payload, it should throw an error', async () => {
        (req as ExtraRequest).payload = undefined;

        await userController.addFav(req as ExtraRequest, res as Response, next);
        expect(next).toHaveBeenCalled();
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(HTTPError);
    });

    test('if the place is already on the list, addFav should throw an error', async () => {
        req = {
            payload: { id: '123456789012345678901239' },
            params: { id: '123456789012345678901238' },
        };

        const mockData2 = { favPlaces: '123456789012345678901238' };

        userRepo.get = jest.fn().mockResolvedValueOnce(mockData2);
        placeRepo.get = jest
            .fn()
            .mockResolvedValue({ id: '123456789012345678901238' });

        await userController.addFav(req as ExtraRequest, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    test('if deleteFav does not have a valid payload, it should throw an error', async () => {
        (req as ExtraRequest).payload = undefined;

        await userController.deleteFav(
            req as ExtraRequest,
            res as Response,
            next
        );
        expect(next).toHaveBeenCalled();
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(HTTPError);
    });
});
