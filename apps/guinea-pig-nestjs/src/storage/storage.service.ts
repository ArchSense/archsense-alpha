import { Injectable } from '@nestjs/common';
import { Invoice } from '../invoices/model/invoice';
import { Span } from 'nestjs-otel';

@Injectable()
export class StorageService {
  private readonly invoices: Invoice[] = [];

  @Span()
  getInvoices() {
    return this.invoices;
  }
  @Span()
  saveInvoice(invoice: Invoice) {
    this.invoices.push(invoice);
  }
}
