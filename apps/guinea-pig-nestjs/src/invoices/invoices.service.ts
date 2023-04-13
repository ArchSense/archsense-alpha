import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { IdsService } from 'src/ids/ids.service';
// import { IdsService } from '../ids/ids.service';
import { Invoice } from './model/invoice';
import { StorageService } from '../storage/storage.service';
import { Span } from 'nestjs-otel';

@Injectable()
export class InvoicesService {
  constructor(
    private storageService: StorageService,
    private idsService: IdsService,
  ) {}

  @Span()
  async list(): Promise<Invoice[]> {
    return this.storageService.getInvoices();
  }
  @Span()
  add(invoiceDto: CreateInvoiceDto) {
    const newInvoice = new Invoice(invoiceDto);
    newInvoice.id = this.idsService.generateId();
    this.storageService.saveInvoice(newInvoice);
  }
}
