import { Router } from 'express';

import { PostController } from '../controllers/post.controller';

const router = Router();

const postController = new PostController();

router.post('/:channel_id', postController.get);

router.put('/:channel_id', postController.update);

router.delete('/:channel_id/:last_post_id', postController.delete);

router.post('/', postController.create);

export default router;
