import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, ParseIntPipe } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  private readonly logger = new Logger(RolesController.name);
  constructor(private readonly rolesService: RolesService) {}


  @ApiOperation({ summary: 'Get list of roles' })
  @Get()
  async findAll() {
    try {
      return await this.rolesService.findAll();
    } catch (e) {
      this.logger.error('GET /roles failed', e);
      throw e;
    }
  }

  @ApiOperation({ summary: 'Lấy chi tiết role' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.rolesService.findOne(id);
    } catch (e) {
      this.logger.error(`GET /roles/${id} failed`, e);
      throw e;
    }
  }
  @ApiOperation({ summary: 'Tạo role mới' })
  @Post()
  async create(@Body() dto: CreateRoleDto) {
    try {
      return await this.rolesService.create(dto);
    } catch (e) {
      this.logger.error('POST /roles failed', e);
      throw e;
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
