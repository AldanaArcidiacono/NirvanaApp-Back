export type id = string;

export interface BasicRepo<T> {
    get: (id: id) => Promise<T>;
    create: (data: Partial<T>) => Promise<T>;
    query: (data: Partial<T>) => Promise<T>;
    update: (id: id, data: Partial<T>) => Promise<T>;
}

export interface ExtraRepo<T> {
    getAll: () => Promise<Array<T>>;
    update: (id: id, data: Partial<T>) => Promise<T>;
    delete: (id: id) => Promise<id>;
}

export interface Repo<T> extends BasicRepo<T> {
    getAll: () => Promise<Array<T>>;
    delete: (id: id) => Promise<id>;
}
