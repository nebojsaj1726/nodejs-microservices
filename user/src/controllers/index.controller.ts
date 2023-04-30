import { Request, Response } from 'express';
import { AppDataSource } from '../..';
import { User } from '../entities/user';
import { QueryFailedError } from 'typeorm';

export const getUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const userRepository = AppDataSource.manager.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const userRepository = AppDataSource.manager.getRepository(User);
    const user = userRepository.create({ name, email });
    await userRepository.save(user);

    res.status(201).json({
      message: 'User added successfully',
      user,
    });
  } catch (error) {
    if (
      error instanceof QueryFailedError &&
      error.message.includes('duplicate')
    ) {
      res.status(400).json({
        message: 'Email address is already in use',
      });
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};
