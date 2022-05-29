import { Module } from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { BuildingsController } from './buildings.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [BuildingsService, PrismaService],
  controllers: [BuildingsController],
})
export class BuildingsModule {}
