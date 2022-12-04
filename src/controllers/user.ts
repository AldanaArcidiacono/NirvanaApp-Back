import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { IUser } from '../entities/user.js';
import { PlacesRepo, UserRepo } from '../repositories/repo.js';
import { IPlace } from '../entities/place.js';
import { HTTPError } from '../interface/error.js';
import { createToken, passwdValidate } from '../services/auth.js';
import { ExtraRequest } from '../middleware/interceptor.js';
const debug = createDebug('FP2022:controllers:user');

export class UsersController {
    constructor(
        public readonly userRepo: UserRepo<IUser>,
        public readonly placesRepo: PlacesRepo<IPlace>
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
            const user = await this.userRepo.find({ email: req.body.email });
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
            const user = await this.userRepo.get(req.params.id);
            res.json({ user });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }

    async addFav(req: ExtraRequest, res: Response, next: NextFunction) {
        try {
            if (!req.payload) {
                throw new Error('Invalid payload');
            }
            debug('patch - addFav');
            const user = await this.userRepo.get(req.payload.id);
            req.body.favPlaces = user.id;
            const fav = await this.userRepo.create(req.body);

            user.favPlaces.push(fav.id);
            this.userRepo.update(user.id.toString(), {
                favPlaces: user.favPlaces,
            });

            // const user = await this.userRepo.get(req.params.id);
            // user.favPlaces.push(req.body.id);
            // const userUpdated = await this.userRepo.update(req.params.id, user);

            // const user = await this.userRepo.find({ id: req.payload.id });
            // user.favPlaces.filter((fav) => fav.id.toString() !== req.params.id);
            // await this.userRepo.update(user.id.toString(), {
            //     favPlaces: user.favPlaces,
            // });
            // debug(user.id.toString(), {
            //     favPlaces: user.favPlaces,
            // });

            res.json({ user });
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
