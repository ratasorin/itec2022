import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './interfaces';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(name: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: { name },
    });
  }

  async createUser({ admin, name, password }: User) {
    try {
      const user = await this.prisma.user.create({
        data: {
          name,
          admin,
          password,
        },
      });

      return user;
    } catch (e) {
      console.error(e);
    }
  }
}
