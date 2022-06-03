import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SpacesOnLevel } from '../user/interfaces';

@Injectable()
export class FloorService {
  constructor(private prisma: PrismaService) {}
  async getSpaces(floor_id: number) {
    try {
      const result: SpacesOnLevel[] = await this.prisma.$queryRaw`--sql
        SELECT spaces.id AS space_id, x, y, name, book_until FROM spaces
        LEFT JOIN floors ON floors.id = spaces.floor_id
        LEFT JOIN bookings ON bookings.space_id = spaces.id AND ${new Date()} > bookings.book_from AND ${new Date()} < bookings.book_until
        LEFT JOIN users ON bookings.user_id = users.id
        WHERE floors.id = ${floor_id}
        ORDER BY space_id;
      `;

      return result;
    } catch (err) {
      console.error(err);
    }
  }
}
