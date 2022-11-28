import { Router } from 'express';

export const placesRouter = Router();

const controller = new placesController(
    PlacesRepository.getInstance(),
    UsersRepository.getInstance()
);

placesRouter.get('/', controller.getAll.bind(controller));
placesRouter.get('/:id', controller.get.bind(controller));
placesRouter.post('/create', authorization, controller.post.bind(controller));
placesRouter.patch(
    '/update/:id',
    authorization,
    authentication,
    controller.patch.bind(controller)
);
placesRouter.delete(
    '/delete/:id',
    authorization,
    authentication,
    controller.delete.bind(controller)
);
