import jwt from 'jsonwebtoken';
import bc from 'bcryptjs';
import {
    createToken,
    getSecret,
    passwdEncrypt,
    passwdValidate,
    verifyToken,
} from './auth';
import { SECRET } from '../config';

jest.mock('../config.js', () => ({
    SECRET: 'Secretos',
}));

const mockPayload = { id: '12asd', name: 'Pepe' };

describe('Given getSecret()', () => {
    describe('When it is not string', () => {
        test('Then an error should be throw', () => {
            expect(() => {
                getSecret('');
            }).toThrowError();
        });
    });
});

describe('Given createToken(), when we instantiate it', () => {
    test('Then the token is created', () => {
        const signSpy = jest.spyOn(jwt, 'sign');
        const result = createToken(mockPayload);
        expect(typeof result).toBe('string');
        expect(signSpy).toHaveBeenCalledWith(mockPayload, SECRET);
    });
});

describe('Given verifyToken(), when we instantiate it', () => {
    describe('When token is valid', () => {
        const token = createToken(mockPayload);
        test('Then it should verify the given token', () => {
            const result = verifyToken(token);
            expect(result.id).toBe(mockPayload.id);
        });
    });

    describe('When token is not valid...', () => {
        const token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlBlcGUiLCJpYXQiOjE2Njg3NzMwNTR9.P1oitfdk-xVzRUFj9gumqs3bPo1OCzgEhh-1YXQ_WN7';
        test('Then it should throw an error', () => {
            expect(() => {
                verifyToken(token);
            }).toThrow();
        });
    });

    describe('When token is bad formatted', () => {
        test('Then if the token is empty it should throw an error', () => {
            const token = '';
            expect(() => {
                verifyToken(token);
            }).toThrow();
        });
    });
});

describe('Given passwdEncrypt() and passwdValidate(), when we instantiate it', () => {
    const spyBcHash = jest.spyOn(bc, 'hash');
    const spyBcCompare = jest.spyOn(bc, 'compare');
    describe('When we call passwdEncrypt()', () => {
        test('Bcrypt.hash should be call', async () => {
            await passwdEncrypt('12345');
            expect(spyBcHash).toHaveBeenCalled();
        });
    });

    describe('When we call passwdValidate()', () => {
        describe('and the password and its encryption are compared', () => {
            let hash: string;
            const password = '12345';
            const badPassword = '00000';

            beforeEach(async () => {
                hash = await passwdEncrypt(password);
            });

            test('Then a valid password should be detected', async () => {
                const result = await passwdValidate(password, hash);
                expect(spyBcCompare).toHaveBeenCalled();
                expect(result).toBe(true);
            });

            test('Then a valid password should be detected', async () => {
                const result = await passwdValidate(badPassword, hash);
                expect(spyBcCompare).toHaveBeenCalled();
                expect(result).toBe(false);
            });
        });
    });
});
