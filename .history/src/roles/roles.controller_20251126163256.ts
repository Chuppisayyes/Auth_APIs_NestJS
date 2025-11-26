import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Query,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  private readonly logger = new Logger(RolesController.name);

  constructor(private readonly rolesService: RolesService) {}

  // -------------------------
  // VALIDATE ID (dùng chung)
  // -------------------------
  private validateId(id: string) {
    if (!/^\d+$/.test(id)) {
      const msg = `Invalid ID "${id}". ID must be a positive integer`;
      this.logger.error(msg);
      throw new BadRequestException({
        message: msg,
        invalidValue: id,
      });
    }
    return Number(id);
  }

  // ============================
  //        SORT ROLE
  // ============================
  @ApiOperation({ summary: 'Sort role' })
  @ApiQuery({ name: 'field', required: true })
  @ApiQuery({ name: 'order', enum: ['asc', 'desc'], required: false })
  @Get('sort')
  async sort(
    @Query('field') field: string,
    @Query('order') order: 'asc' | 'desc' = 'asc',
  ) {
    try {
      const allowedFields = ['id', 'name', 'description'];

      if (!field || !allowedFields.includes(field)) {
        const msg = `Invalid sort field "${field}". Allowed: ${allowedFields.join(', ')}`;
        this.logger.error(msg);
        throw new BadRequestException({ message: msg, invalidField: field });
      }

      if (order && !['asc', 'desc'].includes(order)) {
        const msg = `Invalid sort order "${order}". Must be: asc | desc`;
        this.logger.error(msg);
        throw new BadRequestException({ message: msg, invalidOrder: order });
      }

      return await this.rolesService.sort(field, order);
    } catch (e) {
      this.logger.error(`GET /roles/sort failed`, e);
      throw e;
    }
  }

  // ============================
  //        SEARCH ROLE
  // ============================
  @ApiOperation({ summary: 'Search role' })
  @ApiQuery({ name: 'keyword', required: true })
  @Get('search')
  async search(@Query('keyword') keyword: string) {
    try {
      if (!keyword || keyword.trim() === '') {
        const msg = 'Keyword must not be empty';
        this.logger.error(msg);
        throw new BadRequestException({ message: msg });
      }

      const result = await this.rolesService.search(keyword);

      if (result.length === 0) {
        const msg = `No results found for keyword "${keyword}"`;
        this.logger.warn(msg);
        return { message: msg, keyword, data: [] };
      }

      return result;
    } catch (e) {
      this.logger.error(`GET /roles/search failed`, e);
      throw e;
    }
  }

  // ============================
  //       GET ALL ROLES
  // ============================
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

  // ============================
  //         GET BY ID
  // ============================
  @ApiOperation({ summary: 'Get role details' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const validId = this.validateId(id);
      return await this.rolesService.findOne(validId);
    } catch (e) {
      this.logger.error(`GET /roles/${id} failed`, e);
      throw e;
    }
  }

  // ============================
  //          CREATE
  // ============================
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

  // ============================
  //          UPDATE
  // ============================
  @ApiOperation({ summary: 'Update role' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    try {
      const validId = this.validateId(id);
      return await this.rolesService.update(validId, dto);
    } catch (e) {
      this.logger.error(`PATCH /roles/${id} failed`, e);
      throw e;
    }
  }
  @ApiOperation({ summary: 'Delete role' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const validId = this.validateId(id);
      return await this.rolesService.remove(validId);
    } catch (e) {
      this.logger.error(`DELETE /roles/${id} failed`, e);
      throw e;
    }
  }
}
