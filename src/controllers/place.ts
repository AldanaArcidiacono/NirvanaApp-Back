import { NextFunction, Request, Response } from 'express';
import { IPlace } from '../entities/place.js';
import { IUser } from '../entities/user.js';
import { PlacesRepo, UserRepo } from '../repositories/repo.js';
import createDebug from 'debug';
import { HTTPError } from '../interface/error.js';
import { ExtraRequest } from '../middleware/interceptor.js';
const debug = createDebug('FP2022:controllers:place');

export class PlacesController {
    constructor(
        public readonly placeRepo: PlacesRepo<IPlace>,
        public readonly userRepo: UserRepo<IUser>
    ) {
        debug('instance');
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            debug('getAll');
            const places = await this.placeRepo.getAll();
            res.json({ places });
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
            const places = await this.placeRepo.get(req.params.id);
            res.json({ places });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }

    async find(req: Request, res: Response, next: NextFunction) {
        try {
            debug('find');
            const places = await this.placeRepo.query(
                req.params.key,
                req.params.value
            );
            res.json({ places });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }

    async post(req: ExtraRequest, res: Response, next: NextFunction) {
        try {
            debug('post');
            if (!req.payload) {
                throw new Error('Invalid payload');
            }
            const user = await this.userRepo.get(req.payload.id);
            req.body.owner = user.id;
            const place = await this.placeRepo.create(req.body);

            user.createdPlaces.push(place.id);
            this.userRepo.update(user.id.toString(), {
                createdPlaces: user.createdPlaces,
            });

            res.status(201).json({ place });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }

    async patch(req: Request, res: Response, next: NextFunction) {
        try {
            debug('patch');
            const places = await this.placeRepo.update(req.params.id, req.body);
            res.json({ places });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            debug('delete');
            await this.placeRepo.destroyer(req.params.id);
            res.json({ id: req.params.id });
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
