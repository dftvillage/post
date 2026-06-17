import { Request, Response } from 'express';
import {
  type ParsedUserCreatePayloadBody,
  type ParsedUserGetPayloadParams,
  type ParsedUserDeletePayloadParams,
  type ParsedUserUpdatePayloadParams,
  type ParsedUserGetAllPayloadParams,
} from '../../types';
import ParsedUser from '../models/parsedUser.model';

export class ParsedUserController {
  async create(req: Request<null, ParsedUserCreatePayloadBody>, res: Response) {
    try {
      const user = await ParsedUser.create(req.body);

      res.status(201).json(user);
    } catch (e) {
      res.status(400).json({ error: 'Bad request' });
    }
  }

  async getAll(req: Request<ParsedUserGetAllPayloadParams['where'], undefined>, res: Response) {
    try {
      const users = await ParsedUser.findAll({ where: req.params });

      if (users) {
        res.json(users);
      } else {
        res.status(404).json({ error: 'Something went wrong' });
      }
    } catch (e) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async get(req: Request<ParsedUserGetPayloadParams['where'], ParsedUserGetPayloadParams['defaults']>, res: Response) {
    try {
      const user = await ParsedUser.findOrCreate({ where: req.params, defaults: req.body });

      if (user[0]) {
        res.json(user[0].get());
      } else {
        res.status(404).json({ error: 'Something went wrong' });
      }
    } catch (e) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: Request<ParsedUserUpdatePayloadParams>, res: Response) {
    try {
      await ParsedUser.update(req.body, { where: req.params });

      const user = await ParsedUser.findOne({ where: req.params });

      if (user) {
        res.json(user.get());
      } else {
        res.status(404).json({ error: 'Something went wrong' });
      }
    } catch (e) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: Request<ParsedUserDeletePayloadParams>, res: Response) {
    try {
      const user = await ParsedUser.destroy({ where: req.params });

      if (user) {
        res.json({});
      } else {
        res.status(404).json({ error: 'Something went wrong' });
      }
    } catch (e) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
