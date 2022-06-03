import { Test, TestingModule } from '@nestjs/testing';
import { FloorController } from './floor.controller';

describe('FloorController', () => {
  let controller: FloorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FloorController],
    }).compile();

    controller = module.get<FloorController>(FloorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
