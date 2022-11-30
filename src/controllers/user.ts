import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { IUser } from '../entities/user.js';
import { BasicRepo, Repo } from '../repositories/repo.js';
import { IPlace } from '../entities/place.js';
import { HTTPError } from '../interface/error.js';
import { createToken, passwdValidate } from '../services/auth.js';
const debug = createDebug('FP2022:controllers:user');

export class UsersController {
    constructor(
        public readonly userRepo: BasicRepo<IUser>,
        public readonly placesRepo: Repo<IPlace>
    ) {
        debug('instance');
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            debug('register');
            const user = await this.userRepo.create(req.body);
            res.status(201).json({ user });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            debug('login', req.body.email);
            const user = await this.userRepo.query({ email: req.body.email });
            const isPasswdValid = await passwdValidate(
                req.body.password,
                user.password
            );
            if (!isPasswdValid) throw new Error();
            const token = createToken({
                id: user.id.toString(),
                name: user.name,
            });
            res.json({ token });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }

    async get(req: Request, res: Response, next: NextFunction) {
        try {
            debug('get');
            const users = await this.userRepo.get(req.params.id);
            res.json({ users });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }

    #createHttpError(error: Error) {
        if (error.message === 'Not found id') {
            const httpError = new HTTPError(404, 'Not Found', error.message);
            return httpError;
        }
        const httpError = new HTTPError(
            503,
            'Service unavailable',
            error.message
        );
        return httpError;
    }
}
