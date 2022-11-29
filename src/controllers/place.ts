import { NextFunction, Request, Response } from 'express';
import { IPlace } from '../entities/place.js';
import { IUser } from '../entities/user.js';
import { BasicRepo, Repo } from '../repositories/repo.js';
import createDebug from 'debug';
import { HTTPError } from '../interface/error.js';
const debug = createDebug('FP2022:controllers:place');

export class PlacesController {
    constructor(
        public readonly placeRepo: Repo<IPlace>,
        public readonly userRepo: BasicRepo<IUser>
    ) {
        debug('instance');
    }
    async getAll(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('getAll');
            const places = await this.placeRepo.getAll();
            resp.json({ places });
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
