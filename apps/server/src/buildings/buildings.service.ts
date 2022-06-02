import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RetrievedSpaces, Building } from './interfaces';

@Injectable()
export class BuildingsService {
  constructor(private prisma: PrismaService) {}

  async getAllBuildings() {
    try {
      const buildings: Building[] = await this.prisma.building.findMany({
        select: {
          name: true,
          id: true,
          floors: {
            include: {
              spaces: true,
            },
          },
        },
      });

      return buildings;
    } catch (err) {
      console.error(err);
    }
  }

  async getSpacesOnLevel(
    building_id: number,
    floor_id: number
  ): Promise<RetrievedSpaces[]> {
    try {
      const result = await this.prisma.$queryRaw`--sql
        SELECT  id AS booking_id
              ,book_from
              ,book_until
              ,spaces._id AS space_id
              ,(
        SELECT  name
        FROM users
        WHERE users.id = user_id
        LIMIT 1), x, y, floor_id
        FROM bookings AS bookings
        FULL JOIN
        (
          SELECT  x
                ,y
                ,floor_id
                ,id AS _id
          FROM spaces
          WHERE floor_id = (
          SELECT  id AS floor_id
          FROM floors
          WHERE floors.building_id = ${building_id}
          AND id = ${floor_id} ) 
        ) AS spaces
        ON bookings.space_id = spaces._id
      `;

      console.log({ result });

      return result as unknown as RetrievedSpaces[];
    } catch (err) {
      console.error(err);
    }
  }
}
