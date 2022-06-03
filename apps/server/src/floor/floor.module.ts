import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FloorController } from './floor.controller';
import { FloorService } from './floor.service';

@Module({
  controllers: [FloorController],
  providers: [FloorService, PrismaService],
})
export class FloorModule {}
