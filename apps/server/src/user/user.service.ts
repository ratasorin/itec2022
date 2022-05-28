import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './interfaces';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(name: string) {
    return await this.prisma.user.findFirst({
      where: { name },
    });
  }

  async createUser({ admin, id, name }: User) {
    try {
      const user = await this.prisma.user.create({
        data: {
          name,
          admin,
          id,
        },
      });

      return user;
    } catch (e) {
      console.error(e);
    }
  }
}
