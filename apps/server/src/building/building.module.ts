import { Module } from '@nestjs/common';
import { BuildingService } from './building.service';
import { BuildingController } from './building.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [BuildingService, PrismaService],
  controllers: [BuildingController],
})
export class BuildingModule {}
