import createDebug from 'debug';
import { IPlace, Place } from '../entities/place.js';
import { id, PlacesRepo } from './repo.js';
const debug = createDebug('FP2022:repositories:place');

export class PlaceRepository implements PlacesRepo<IPlace> {
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

    async get(id: id): Promise<IPlace> {
        debug('get', id);
        const result = await this.#Model.findById(id);
        if (!result) throw new Error('Not found id');
        return result;
    }

    async create(data: Partial<IPlace>): Promise<IPlace> {
        debug('create', data);
        return await this.#Model.create(data);
    }

    async query(key: string, value: string): Promise<Array<IPlace>> {
        debug('query', { [key]: value });
        const result = await this.#Model.find({ [key]: value.toLowerCase() });
        if (!result) throw new Error('Not found');
        return result as unknown as Array<IPlace>;
    }

    async update(id: id, data: Partial<IPlace>): Promise<IPlace> {
        debug('update', id);
        const result = await this.#Model.findByIdAndUpdate(id, data, {
            new: true,
        });
        if (!result) throw new Error('Not found id');
        return result;
    }

    delete!: (id: string) => Promise<string>;
}
