import { Router } from 'express';
import { PlacesController } from '../controllers/place.js';
import { authentication, authorization } from '../middleware/interceptor.js';
import { PlaceRepository } from '../repositories/place.js';
import { UserRepository } from '../repositories/user.js';

export const travelRouter = Router();

const placeController = new PlacesController(
    PlaceRepository.getInstance(),
    UserRepository.getInstance()
);

travelRouter.get('/', placeController.getAll.bind(placeController));

travelRouter.get(
    '/find/:key/:value',
    authorization,
    placeController.find.bind(placeController)
);

travelRouter.get(
    '/:id',
    authorization,
    placeController.get.bind(placeController)
);

travelRouter.post(
    '/',
    authorization,
    authentication,
    placeController.post.bind(placeController)
);

travelRouter.patch(
    '/places/:id',
    authorization,
    authentication,
    placeController.patch.bind(placeController)
);

travelRouter.delete(
    '/places/:id',
    authorization,
    authentication,
    placeController.delete.bind(placeController)
);
