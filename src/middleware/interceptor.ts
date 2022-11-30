import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { HTTPError } from '../interface/error.js';
import { verifyToken } from '../services/auth.js';
import createDebug from 'debug';
import { PlaceRepository } from '../repositories/place.js';
const debug = createDebug('W7CH:middleware:interceptor');

export interface ExtraRequest extends Request {
    payload?: JwtPayload;
}

export const authorization = (
    req: ExtraRequest,
    res: Response,
    next: NextFunction
) => {
    debug('authorization');
    const authString = req.get('Authorization');
    if (!authString || !authString?.startsWith('Bearer')) {
        next(new HTTPError(403, 'Forbidden', 'Incorrect user or password'));
        return;
    }
    try {
        const token = authString.slice(7);
        req.payload = verifyToken(token);
        next();
    } catch (error) {
        next(new HTTPError(403, 'Forbidden', 'Incorrect user or password'));
    }
};

export const authentication = async (
    req: ExtraRequest,
    _res: Response,
    next: NextFunction
) => {
    debug('authentication');
    const placeRepo = PlaceRepository.getInstance();
    try {
        const robot = await placeRepo.get(req.params.id);
        if (!req.payload || robot.favUser._id.toString() !== req.payload.id) {
            next(
                new HTTPError(
                    403,
                    'Forbidden',
                    'Usuario o contraseña incorrecto'
                )
            );
        }
        next();
    } catch (error) {
        next(error);
    }
};
