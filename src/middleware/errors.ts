import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../interface/error.js';
import createDebug from 'debug';
const debug = createDebug('FP2022:middleware:errors');

export const errorManager = (
    error: CustomError,
    _req: Request,
    resp: Response,
    _next: NextFunction
) => {
    debug(error.name, error.message);
    let status = error.statusCode || 500;
    if (error.name === 'Validation Error') {
        status = 406;
    }
    const result = {
        status: status,
        type: error.name,
        error: error.message,
    };
    resp.status(status).json(result).end();
};
