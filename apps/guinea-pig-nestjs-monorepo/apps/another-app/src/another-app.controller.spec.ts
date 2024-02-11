import { Test, TestingModule } from '@nestjs/testing';
import { AnotherAppController } from './another-app.controller';
import { AnotherAppService } from './another-app.service';

describe('AnotherAppController', () => {
  let anotherAppController: AnotherAppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AnotherAppController],
      providers: [AnotherAppService],
    }).compile();

    anotherAppController = app.get<AnotherAppController>(AnotherAppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(anotherAppController.getHello()).toBe('Hello World!');
    });
  });
});
