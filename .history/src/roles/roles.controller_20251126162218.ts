import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, ParseIntPipe, Query, BadRequestException } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  private readonly logger = new Logger(RolesController.name);
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Sort role' })
    @Get('sort')
    async sort(
      @Query('field') field: string,
      @Query('order') order: 'asc' | 'desc',
    ) {
      try {
        return await this.rolesService.sort(field, order);
      } catch (e) {
        this.logger.error(`GET /roles/sort failed`, e);
        throw e;
      }
    }

    @ApiOperation({ summary: 'Search role' })
    @Get('search')
    async search(@Query('keyword') keyword: string) {
      try {
        return await this.rolesService.search(keyword);
      } catch (e) {
        this.logger.error(`GET /roles/search failed`, e);
        throw e;
      }
    }
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

@ApiOperation({ summary: 'Get role details' })
@Get(':id')
async findOne(@Param('id') id: string) {
  try {
    // Check id is numeric
    if (!/^\d+$/.test(id)) {
      this.logger.error(`GET /roles/${id} failed - Invalid ID, must be a number`);
      throw new BadRequestException({
        message: 'ID phải là số nguyên dương',
        invalidValue: id,
      });
    }

    return await this.rolesService.findOne(Number(id));
  } catch (e) {
    this.logger.error(`GET /roles/${id} failed`, e);
    throw e;
  }
}


  @ApiOperation({ summary: 'Create new role' })
  @Post()
  async create(@Body() dto: CreateRoleDto) {
    try {
      return await this.rolesService.create(dto);
    } catch (e) {
      this.logger.error('POST /roles failed', e);
      throw e;
    }
  }

  @ApiOperation({ summary: 'Update role' })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
  ) {
    try {
      return await this.rolesService.update(id, dto);
    } catch (e) {
      this.logger.error(`PATCH /roles/${id} failed`, e);
      throw e;
    }
  }
  @ApiOperation({ summary: 'Delete role' })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.rolesService.remove(id);
    } catch (e) {
      this.logger.error(`DELETE /roles/${id} failed`, e);
      throw e;
    }
  }

}
