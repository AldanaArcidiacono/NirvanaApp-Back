import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../interface/error';
import { UserRepository } from '../repositories/user';
import { authentication, authorization, ExtraRequest } from './interceptor';

describe('Given the interceptor authorization ', () => {
    describe('When we instantiate it', () => {
        test('Then  if verifyToken() reads a correct token, it should return the payload', () => {
            const req: Partial<ExtraRequest> = {
                get: jest
                    .fn()
                    .mockReturnValueOnce(
                        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzODc4NWUwNGRkZjQzMGVlZjFmY2Y2ZCIsIm5hbWUiOiJBbmdvIiwiaWF0IjoxNjcwMTU0MDY1fQ.wgbJEv9s8B_CFcqzOimpWHrGuo9DFOJ09_V4Tep52Pc'
                    ),
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();

            authorization(req as ExtraRequest, res as Response, next);
            expect(next).toHaveBeenCalled();

            expect(req.payload).toStrictEqual({
                id: expect.any(String),
                iat: expect.any(Number),
                name: 'Ango',
            });
        });

        test('and authString is empty, it should throw an error', () => {
            const req: Partial<Request> = {
                get: jest.fn().mockReturnValueOnce(false),
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();

            authorization(req as Request, res as Response, next);
            expect(next).toHaveBeenCalled();
        });

        test('Then if verifyToken() checks the token and its not valid, then it should throw an error', () => {
            const req: Partial<Request> = {
                get: jest.fn().mockReturnValueOnce('Bearer token'),
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();

            authorization(req as Request, res as Response, next);
            expect(next).toHaveBeenCalled();
        });
    });
});

describe('Given the interceptor authentication', () => {
    describe('When we instantiate it', () => {
        const userRepo = UserRepository.getInstance();

        test('Then if the payload is correct, it should pass the next function with the data', async () => {
            const req: Partial<ExtraRequest> = {
                payload: {
                    id: '638785e04ddf430eef1fcf6d',
                    name: 'Ango',
                },
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();

            userRepo.get = jest
                .fn()
                .mockResolvedValue({ id: '638785e04ddf430eef1fcf6d' });

            await authentication(req as ExtraRequest, res as Response, next);
            expect(next).toHaveBeenCalled();
        });

        test('if the req.payload is not correct, then it should throw an error', async () => {
            const req: Partial<ExtraRequest> = {
                payload: {
                    payload: {
                        id: '638785e04ddf730eef9fcf6d',
                        name: 'Ango',
                    },
                },
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();

            await authentication(req as ExtraRequest, res as Response, next);
            expect(next).toHaveBeenCalled();
        });

        test('if the req.payload is not correct, then it should throw an error', async () => {
            const error = new HTTPError(404, 'Not found', 'Not found id');
            const req: Partial<ExtraRequest> = {
                payload: {
                    payload: {
                        id: '638785e04ddf730eef9fcf6d',
                        name: 'Ango',
                    },
                },
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();
            await authentication(req as ExtraRequest, res as Response, next);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });
    });
});
