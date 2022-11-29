import jwt from 'jsonwebtoken';
import bc from 'bcryptjs';
import { SECRET } from '../config.js';

export type TokenPayload = {
    id: string;
    name: string;
};

export const getSecret = (secret = SECRET) => {
    if (typeof secret !== 'string' || secret === '') {
        throw new Error('Bad Secret for token creation');
    }
    return secret;
};

export const createToken = (payload: TokenPayload) => {
    return jwt.sign(payload, getSecret());
};

export const verifyToken = (token: string) => {
    const payload = jwt.verify(token, getSecret());
    return payload as jwt.JwtPayload;
};

export const passwdEncrypt = (passwd: string) => {
    return bc.hash(passwd, 10);
};

export const passwdValidate = (newPasswd: string, hash: string) => {
    return bc.compare(newPasswd, hash);
};
