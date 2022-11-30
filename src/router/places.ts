import { Router } from 'express';
import { PlacesController } from '../controllers/place.js';
import { authorization } from '../middleware/interceptor.js';
import { PlaceRepository } from '../repositories/place.js';
import { UserRepository } from '../repositories/user.js';

export const travelRouter = Router();

const placeController = new PlacesController(
    PlaceRepository.getInstance(),
    UserRepository.getInstance()
);

travelRouter.get('/', placeController.getAll.bind(placeController));
travelRouter.get('/:id', placeController.get.bind(placeController));
travelRouter.post(
    '/',
    authorization,
    placeController.post.bind(placeController)
);
// travelRouter.patch(
//     '/update/:id',
//     authorization,
//     authentication,
//     placeController.patch.bind(placeController)
// );
// travelRouter.delete(
//     '/delete/:id',
//     authorization,
//     authentication,
//     placeController.delete.bind(placeController)
// );
