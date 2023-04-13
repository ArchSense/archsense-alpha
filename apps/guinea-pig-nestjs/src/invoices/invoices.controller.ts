import { Body, Controller, Get, Put } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @Get()
  async getAllInvoices() {
    return this.invoicesService.list();
  }

  @Put()
  addInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    this.invoicesService.add(createInvoiceDto);
  }
}
