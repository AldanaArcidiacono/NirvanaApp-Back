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
        const result = await this.#Model.findById(id);
        if (!result) throw new Error('Not found id');
        return result;
    }

    async post(data: Partial<IUser>): Promise<IUser> {
        debug('post', data);
        if (typeof data.password !== 'string') throw new Error('No info found');
        data.password = await passwdEncrypt(data.password);
        const result = await this.#Model.create(data);
        return result;
    }

    async find(search: Partial<IUser>): Promise<IUser> {
        debug('find', { search });
        const result = await this.#Model.findOne(search);
        if (!result) throw new Error('Not found id');
        return result;
    }
}
