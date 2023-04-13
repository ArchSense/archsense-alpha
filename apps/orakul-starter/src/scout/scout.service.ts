import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Scout } from '@archsense/scout';

@Injectable()
export class ScoutService {
  private scout: Scout;
  private tempResults: any;
  constructor(private configService: ConfigService) {
    this.scout = new Scout({
      framework: this.configService.get('framework'),
      configPath: this.configService.get('configPath'),
      rootPath: this.configService.get('rootPath'),
    });
  }
  async getAnalysis() {
    if (this.tempResults) {
      return this.tempResults;
    }
    this.tempResults = await this.scout.analyze();
    return this.tempResults;
  }
}
