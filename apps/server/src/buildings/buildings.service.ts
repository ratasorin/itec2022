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
    id: number
  ): Promise<RetrievedSpaces[]> {
    try {
      const { floors } = await this.prisma.building.findFirst({
        where: {
          id: building_id,
        },
        select: {
          floors: {
            where: {
              id,
            },
            select: {
              spaces: {
                select: {
                  Bookings: true,
                  x: true,
                  y: true,
                  id: true,
                },
              },
            },
          },
        },
      });

      const spaces = floors[0].spaces.reduce((prev, curr) => {
        const { book_until }: { book_until: Date | undefined } =
          curr.Bookings.reduce(
            (prev, curr) => {
              const now = new Date();
              console.log(curr.book_from, now, curr.book_until);
              if (curr.book_from < now && now < curr.book_until)
                return { book_until: curr.book_until };

              return prev;
            },
            {
              book_until: undefined,
            }
          );
        return [
          ...prev,
          {
            book_until,
            id: curr.id,
            x: curr.x,
            y: curr.y,
          },
        ];
      }, [] as RetrievedSpaces[]);
      console.log({ spaces });

      return spaces;
    } catch (err) {
      console.error(err);
    }
  }
}
