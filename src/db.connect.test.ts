import mongoose from 'mongoose';
import { dbConnect } from './db.connect';

describe('Given dbConnect', () => {
    test('When we instantiate it should make a connection', async () => {
        const result = await dbConnect();
        expect(typeof result).toBe(typeof mongoose);
        mongoose.disconnect();
    });

    test('When we instantiate it should make a connection, with the given .env', async () => {
        process.env.NODE_ENV = 'FinalProject';
        const result = await dbConnect();
        expect(typeof result).toBe(typeof mongoose);
        mongoose.disconnect();
    });
});
