import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export async function createUser(req: Request, res: Response): Promise<void> {
  const { name, email, segment } = req.body;
  const user = await prisma.user.create({ data: { name, email, segment } });
  res.status(201).json(user);
}

export async function getUser(req: Request, res: Response): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    include: { logs: true },
  });
  if (!user) {
    res.status(404).json({ error: 'not_found' });
    return;
  }
  res.json(user);
}