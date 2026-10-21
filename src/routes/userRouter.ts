import { Router } from 'express';
import { UserController } from '../controllers/userController.ts';
import { authenticate } from '../middlewares/auth.ts';
import { authorize } from '../middlewares/authorize.ts';

const userRouter = Router();
const userController = new UserController();

userRouter.get('/', (req, res) => {
  return userController.getUsers(req, res);
});

userRouter.get('/:id', (req, res) => {
  return userController.getUserById(req, res);
});

// PASANG DI SINI: Gunakan authenticate, lalu authorize(['admin'])
userRouter.post('/', authenticate, authorize('admin'), (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/UserInput' } }
  // #swagger.responses[201] = { description: 'User dibuat' }
  // #swagger.responses[403] = { description: 'Akses ditolak (Role tidak memenuhi)' }
  return userController.createUser(req, res);
});

export { userRouter };