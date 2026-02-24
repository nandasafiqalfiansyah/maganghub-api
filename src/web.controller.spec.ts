import { Test, TestingModule } from '@nestjs/testing';
import { WebController } from './web.controller';

describe('WebController', () => {
  let webController: WebController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WebController],
    }).compile();

    webController = app.get<WebController>(WebController);
  });

  describe('home', () => {
    it('should return home html page with 3d animations', () => {
      const result = webController.home();

      expect(typeof result).toBe('string');
      expect(result).toContain('<!doctype html>');
      expect(result).toContain('three-canvas');
      expect(result).toContain('/docs');
    });
  });
});
