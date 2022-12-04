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
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
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
            const fav = await this.placesRepo.get(req.params.id);

            if (
                user.favPlaces.find(
                    (item) => item.id.toString() === req.params.id
                )
            ) {
                throw Error('Duplicate favorites');
            }

            user.favPlaces.push(fav.id);

            this.userRepo.update(user.id.toString(), {
                favPlaces: user.favPlaces,
            });

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

    async deleteFav(req: ExtraRequest, res: Response, next: NextFunction) {
        try {
            if (!req.payload) {
                throw new Error('Invalid payload');
            }
            debug('patch - deleteFav');

            const user = await this.userRepo.get(req.payload.id);

            console.log(user.favPlaces, 'REQ', req.params);
            user.favPlaces = await user.favPlaces.filter(
                (item) => item.id.toString() !== req.params.id
            );

            this.userRepo.update(user.id.toString(), {
                favPlaces: user.favPlaces,
            });

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
}
