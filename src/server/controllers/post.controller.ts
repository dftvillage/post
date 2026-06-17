import { Request, Response } from 'express';
import { type PostCreatePayloadBody, type PostGetPayloadParams, type PostDeletePayloadParams, type PostUpdatePayloadParams } from '../../types';
import Post from '../models/post.model';

export class PostController {
  async create(req: Request<null, PostCreatePayloadBody>, res: Response) {
    try {
      const post = await Post.create(req.body);

      res.status(201).json(post);
    } catch (e) {
      res.status(400).json({ error: 'Bad request' });
    }
  }

  async get(req: Request<PostGetPayloadParams['where'], PostGetPayloadParams['defaults']>, res: Response) {
    try {
      const post = await Post.findOrCreate({ where: req.params, defaults: req.body });

      if (post[0]) {
        res.json(post[0].get());
      } else {
        res.status(404).json({ error: 'Something went wrong' });
      }
    } catch (e) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: Request<PostUpdatePayloadParams>, res: Response) {
    try {
      await Post.update(req.body, { where: req.params });

      const post = await Post.findOne({ where: req.params });

      if (post) {
        res.json(post.get());
      } else {
        res.status(404).json({ error: 'Something went wrong' });
      }
    } catch (e) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: Request<PostDeletePayloadParams>, res: Response) {
    try {
      const post = await Post.destroy({ where: req.params });

      if (post) {
        res.json({});
      } else {
        res.status(404).json({ error: 'Something went wrong' });
      }
    } catch (e) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
