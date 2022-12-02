import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../services/auth';
import { ExtraRequest } from './interceptor';
jest.mock('../services/auth');

describe("Given the place's controller,", () => {
    const req: Partial<ExtraRequest> = {};
    const res: Partial<Response> = {
        json: jest.fn(),
    };
    const next: NextFunction = jest.fn();

    req.get = jest.fn().mockResolvedValue({
        Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzODc4NWUwNGRkZjQzMGVlZjFmY2Y2ZCIsIm5hbWUiOiJBbmdvIiwiaWF0IjoxNjY5ODI2MDY5fQ.wreGdK6IE8dVIlOczs-j6sgxj-iyKL6Jc-jJsuPQB80',
    });
    (verifyToken as jest.Mock).mockReturnValue(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzODc4NWUwNGRkZjQzMGVlZjFmY2Y2ZCIsIm5hbWUiOiJBbmdvIiwiaWF0IjoxNjY5ODI2MDY5fQ.wreGdK6IE8dVIlOczs-j6sgxj-iyKL6Jc-jJsuPQB80'
    );

    describe('When we instantiate authorization()', () => {
        test('It should check the provided token', async () => {
            const token =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzODc4NWUwNGRkZjQzMGVlZjFmY2Y2ZCIsIm5hbWUiOiJBbmdvIiwiaWF0IjoxNjY5ODI2MDY5fQ.wreGdK6IE8dVIlOczs-j6sgxj-iyKL6Jc-jJsuPQB80';
            req.payload = verifyToken(token);
            expect(req.payload).toBe(token);
        });
    });
});
