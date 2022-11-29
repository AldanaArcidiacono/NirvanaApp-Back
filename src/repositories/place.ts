import createDebug from 'debug';
import { IPlace, Place } from '../entities/place.js';
import { Repo } from './repo.js';
const debug = createDebug('FP2022:repositories:place');

export class PlaceRepository implements Repo<IPlace> {
    static instance: PlaceRepository;

    public static getInstance(): PlaceRepository {
        if (!PlaceRepository.instance) {
            PlaceRepository.instance = new PlaceRepository();
        }
        return PlaceRepository.instance;
    }

    #Model = Place;

    private constructor() {
        debug('instance');
    }

    async getAll(): Promise<Array<IPlace>> {
        debug('getAll');
        const result = this.#Model.find();
        return result;
    }

    patch!: (id: string, data: Partial<IPlace>) => Promise<IPlace>;
    delete!: (id: string) => Promise<string>;
    get!: (id: string) => Promise<IPlace>;
    post!: (data: Partial<IPlace>) => Promise<IPlace>;
    find!: (data: Partial<IPlace>) => Promise<IPlace>;
}
