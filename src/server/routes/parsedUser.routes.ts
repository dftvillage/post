import { Router } from 'express';

import { ParsedUserController } from '../controllers/parsedUser.controller';

const router = Router();

const parsedUserController = new ParsedUserController();

router.post('/all', parsedUserController.getAll);

router.post('/:telegram_id', parsedUserController.get);

router.put('/:telegram_id', parsedUserController.update);

router.delete('/:telegram_id', parsedUserController.delete);

router.post('/', parsedUserController.create);

export default router;
