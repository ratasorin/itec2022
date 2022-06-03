import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Building } from './interfaces';

@Injectable()
export class BuildingService {
  constructor(private prisma: PrismaService) {}

  async getAllBuilding() {
    try {
      const Building: Building[] = await this.prisma.building.findMany({
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

      return Building;
    } catch (err) {
      console.error(err);
    }
  }
}
