import { NextFunction, Request, Response } from 'express';

export const setCors = (req: Request, res: Response, next: NextFunction) => {
    const origin = req.header('Origin') || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    next();
};
