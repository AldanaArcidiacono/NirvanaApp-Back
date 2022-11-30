import { IUser, User } from '../entities/user.js';
import { id, BasicRepo } from './repo.js';
import createDebug from 'debug';
import { passwdEncrypt } from '../services/auth.js';
const debug = createDebug('FP2022:repositories:user');

export class UserRepository implements BasicRepo<IUser> {
    static instance: UserRepository;

    public static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance;
    }

    #Model = User;

    private constructor() {
        debug('instance');
    }

    async get(id: id): Promise<IUser> {
        debug('get', id);
        const result = await this.#Model
            .findById(id)
            .populate('favPlaces')
            .populate('createdPlaces');
        if (!result) throw new Error('Not found id');
        return result;
    }

    async create(data: Partial<IUser>): Promise<IUser> {
        debug('create', data);
        if (typeof data.password !== 'string') throw new Error('No info found');
        data.password = await passwdEncrypt(data.password);
        const result = await this.#Model.create(data);
        return result;
    }

    async query(search: Partial<IUser>): Promise<IUser> {
        debug('query', { search });
        const result = await this.#Model.findOne(search);
        if (!result) throw new Error('Not found id');
        return result;
    }

    async update(id: id, data: Partial<IUser>): Promise<IUser> {
        debug('patch', id);
        const result = await this.#Model.findByIdAndUpdate(id, data, {
            new: true,
        });
        if (!result) throw new Error('Not found id');
        return result;
    }
}
