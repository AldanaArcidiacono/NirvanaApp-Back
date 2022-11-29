import { Router } from 'express';
import { PlacesController } from '../controllers/place.js';
import { PlaceRepository } from '../repositories/place.js';
import { UserRepository } from '../repositories/user.js';

export const travelRouter = Router();

const controller = new PlacesController(
    PlaceRepository.getInstance(),
    UserRepository.getInstance()
);

travelRouter.get('/', controller.getAll.bind(controller));
// travelRouter.get('/:id', controller.get.bind(controller));
// travelRouter.post('/create', authorization, controller.post.bind(controller));
// travelRouter.patch(
//     '/update/:id',
//     authorization,
//     authentication,
//     controller.patch.bind(controller)
// );
// travelRouter.delete(
//     '/delete/:id',
//     authorization,
//     authentication,
//     controller.delete.bind(controller)
// );
