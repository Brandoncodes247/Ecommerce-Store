import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Controller('inventory')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  create(@Body() dto: CreateInventoryDto) {
    return this.appService.create(dto);
  }

  @Get()
  findAll() {
    return this.appService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInventoryDto) {
    return this.appService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appService.remove(id);
  }
}
