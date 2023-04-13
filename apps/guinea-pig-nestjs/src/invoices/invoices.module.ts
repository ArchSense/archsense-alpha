import { Module } from '@nestjs/common';
import { IdsService } from '../ids/ids.service';
import { StorageService } from '../storage/storage.service';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';

@Module({
  imports: [],
  controllers: [InvoicesController],
  providers: [InvoicesService, StorageService, IdsService],
})
export class InvoicesModule { }
