export type id = string;

export interface BasicRepo<T> {
    get: (id: id) => Promise<T>;
    create: (data: Partial<T>) => Promise<T>;
    update: (id: id, data: Partial<T>) => Promise<T>;
}

export interface UserRepo<T> extends BasicRepo<T> {
    find: (data: Partial<T>) => Promise<T>;
}

export interface PlacesRepo<T> extends BasicRepo<T> {
    getAll: () => Promise<Array<T>>;
    query: (key: string, value: string) => Promise<Array<T>>;
    destroyer: (id: id) => Promise<id>;
}
