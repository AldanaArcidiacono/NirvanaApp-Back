import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { usersRouter } from './router/users.js';
import { travelRouter } from './router/places.js';
import { setCors } from './middleware/cors.js';
import { errorManager } from './middleware/errors.js';

export const app = express();
app.disable('x-powered-by');

const corsOptions = {
    origin: '*',
};
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());

app.use(setCors);

app.get('/', (_req, res) => {
    res.send('API rest of travels. Write /travels to access').end();
});

// Place.insertMany([
//     {
//         city: 'Venecia',
//         description: 'En Italia con',
//         mustVisit: '',
//         img: 'url',
//         category: 'city',
//     },
//     {
//         city: 'Croacia',
//         description: 'sdfgd',
//         mustVisit: '',
//         img: 'url',
//         category: 'city',
//     },
//     {
//         city: 'Inglaterra',
//         description: 'El Big Ben',
//         mustVisit: '',
//         img: 'url',
//         category: 'city',
//     },
//     {
//         city: 'Marruecos',
//         description: 'En el norte de Africa',
//         mustVisit: '',
//         img: 'url',
//         category: 'city',
//     },
//     {
//         city: 'Japón',
//         description: 'En Asia',
//         mustVisit: '',
//         img: 'url',
//         category: 'city',
//     },
// ]);
app.use('/users', usersRouter);
app.use('/travels', travelRouter);

app.use(errorManager);
