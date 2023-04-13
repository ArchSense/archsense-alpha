import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { ScoutService } from '../scout/scout.service';

@Controller('api')
export class ApiController {
  constructor(private scoutService: ScoutService) {}

  @Get('/analysis')
  async fetchAnalysis() {
    try {
      const res = await this.scoutService.getAnalysis();
      return res;
    } catch (error) {
      throw new BadRequestException(error.message, {
        cause: new Error(),
        description: 'Error during parsing',
      });
    }
  }

  @Post('/source-code')
  retrieveSourceCode(@Body() { fileId }: { fileId: string }) {
    const filePath = resolve(__dirname, '../', fileId);
    return readFile(filePath, { encoding: 'utf-8' });
  }
}
