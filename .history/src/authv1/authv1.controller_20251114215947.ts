import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Authv1Service } from './authv1.service';
import { CreateAuthv1Dto } from './dto/create-authv1.dto';
import { UpdateAuthv1Dto } from './dto/update-authv1.dto';

@Controller('authv1')
export class Authv1Controller {
  constructor(private readonly authv1Service: Authv1Service) {}

  @Post()
  create(@Body() createAuthv1Dto: CreateAuthv1Dto) {
    return this.authv1Service.create(createAuthv1Dto);
  }

  @Get()
  findAll() {
    return this.authv1Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authv1Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthv1Dto: UpdateAuthv1Dto) {
    return this.authv1Service.update(+id, updateAuthv1Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authv1Service.remove(+id);
  }
}
