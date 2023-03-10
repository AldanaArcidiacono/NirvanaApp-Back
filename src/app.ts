import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { usersRouter } from './router/users.js';
import { travelRouter } from './router/places.js';
import { errorManager } from './middleware/errors.js';

export const app = express();
app.disable('x-powered-by');

const corsOptions = {
    origin: '*',
};
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (_req, res) => {
    res.send('API rest of travels. Write /travels to access').end();
});

app.use('/users', usersRouter);
app.use('/travels', travelRouter);

app.use(errorManager);
