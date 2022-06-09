import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  providers: [TestService],
  controllers: [TestController],
  imports: [DatabaseModule],
})
export class TestModule {}
