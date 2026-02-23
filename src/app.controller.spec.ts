import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return health html page', () => {
      const result = appController.getHealth();

      expect(typeof result).toBe('string');
      expect(result).toContain('<!doctype html>');
      expect(result).toContain('Service Healthy');
      expect(result).toContain('/docs');
    });
  });
});
