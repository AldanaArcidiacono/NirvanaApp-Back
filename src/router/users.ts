import { Router } from 'express';
import { UsersController } from '../controllers/user.js';
import { PlaceRepository } from '../repositories/place.js';
import { UserRepository } from '../repositories/user.js';

export const usersRouter = Router();

const controller = new UsersController(
    UserRepository.getInstance(),
    PlaceRepository.getInstance()
);

usersRouter.post('/register', controller.register.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));
