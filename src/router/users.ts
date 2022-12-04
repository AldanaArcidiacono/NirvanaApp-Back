import { Router } from 'express';
import { UsersController } from '../controllers/user.js';
import { PlaceRepository } from '../repositories/place.js';
import { UserRepository } from '../repositories/user.js';

export const usersRouter = Router();

const userController = new UsersController(
    UserRepository.getInstance(),
    PlaceRepository.getInstance()
);

usersRouter.post('/register', userController.register.bind(userController));
usersRouter.post('/login', userController.login.bind(userController));
usersRouter.get('/:id', userController.get.bind(userController));
usersRouter.patch('/places/:id', userController.addFav.bind(userController));
