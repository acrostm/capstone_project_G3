import { Test, TestingModule } from '@nestjs/testing';
import { PycvController } from './pycv.controller';

describe('PycvController', () => {
  let controller: PycvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PycvController],
    }).compile();

    controller = module.get<PycvController>(PycvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
