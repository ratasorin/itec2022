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
      const result = await this.prisma.$queryRaw`
      SELECT * FROM (
      SELECT * FROM bookings  
      FULL JOIN (
        SELECT * FROM (
            SELECT * FROM spaces
            WHERE floor_id = (
              SELECT id FROM floors
              WHERE floors.building_id = ${building_id} and id = ${floor_id} 
            )
          ) AS booking_spaces
      ) AS booking_spaces ON space_id = booking_spaces.id
      ) AS booking_spaces
      FULL JOIN users ON user_id = users.id 
      `;

      // const spaces = floors[0].spaces.reduce((prev, curr) => {
      //   const { book_until }: { book_until: Date | undefined } =
      //     curr.Bookings.reduce(
      //       (prev, curr) => {
      //         const now = new Date();
      //         console.log(curr.book_from, now, curr.book_until);
      //         if (curr.book_from < now && now < curr.book_until)
      //           return { book_until: curr.book_until, user: curr.id };

      //         return prev;
      //       },
      //       {
      //         book_until: undefined,
      //         user: undefined,
      //       }
      //     );
      //   return [
      //     ...prev,
      //     {
      //       book_until,
      //       id: curr.id,
      //       x: curr.x,
      //       y: curr.y,
      //     },
      //   ];
      // }, [] as RetrievedSpaces[]);
      console.log({ result });

      return [];
    } catch (err) {
      console.error(err);
    }
  }
}
