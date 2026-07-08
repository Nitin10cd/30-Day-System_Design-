import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { env } from '../config/env';

export class AuthService {
  static async register(name: string, email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error('email_already_registered');

    const hash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { name, email, password: hash } });
    return { id: user.id, name: user.name, email: user.email };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('invalid_credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('invalid_credentials');

    const token = jwt.sign({ userId: user.id }, env.jwtSecret, { expiresIn: '7d' });
    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }
}