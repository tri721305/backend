import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { UserService } from '../services/user-service';
import { BaseController } from './base-controller';

const userService = new UserService();

export class UserController implements BaseController<UserService> {
  login(req: Request, res: Response): void {
    const { email, password } = req.body;
    try {
      userService.retrieve(null, { email }, (user: User, error: any) => {
        if (error) {
          res.status(400).send({ error: error.sqlMessage });
        }

        if (user) {
          if (!userService.checkPassword(password, user.password)) {
            res.status(401).json({ error: 'Authentication failed. Email or password is wrong.' });
          } else {
            const token = jwt.sign(
              {
                id: user.id,
                email: user.email,
                username: user.username,
              },
              req.app.get('superSecret'),
              { expiresIn: '1h' }
            );

            res
              .status(200)
              .cookie('jwt', token, {
                maxAge: 60 * 60 * 1000 * 4,
                httpOnly: true,
                secure: false,
                sameSite: true,
              })
              .send({
                success: true,
                user: {
                  email: user.email,
                  username: user.username,
                },
              });
          }
        } else {
          res.status(401).send({ error: 'Authentication failed. Email or password is wrong.' });
        }
      });
    } catch (error) {
      res.status(400).send({ error });
    }
  }

  create(req: Request, res: Response): void {
    try {
      const newUser: User = req.body;
      userService.create(newUser, (result: any, error: any) => {
        if (error) {
          const errorMessage = error.sqlMessage ? error.sqlMessage : error;
          res.status(400).send({ error: errorMessage });
        } else {
          res.status(200).send({ success: true, result });
        }
      });
    } catch (error) {
      res.status(400).send({ error });
    }
  }

  update(req: Request, res: Response): void {
    try {
      const user: User = req.body;
      userService.update(user, (result: any, error: any) => {
        if (error) {
          const errorMessage = error.sqlMessage ? error.sqlMessage : error;
          res.status(400).send({ error: errorMessage });
        } else {
          res.status(200).send({ success: true, result });
        }
      });
    } catch (error) {
      res.status(400).send({ error });
    }
  }

  logout(req: Request, res: Response): void {
    res.clearCookie('jwt');
  }
}
