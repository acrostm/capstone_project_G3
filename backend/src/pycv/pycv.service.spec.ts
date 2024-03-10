import { Test, TestingModule } from '@nestjs/testing';
import { PycvService } from './pycv.service';

describe('PycvService', () => {
  let service: PycvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PycvService],
    }).compile();

    service = module.get<PycvService>(PycvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
