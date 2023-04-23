import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { OtelInstanceCounter } from 'nestjs-otel';

@Entity()
@OtelInstanceCounter()
export class Invoice {
  constructor(invoiceDto: CreateInvoiceDto) {
    this.amount = invoiceDto.amount;
    this.name = invoiceDto.name;
  }
  id: number;
  name: string;
  amount: number;
}
