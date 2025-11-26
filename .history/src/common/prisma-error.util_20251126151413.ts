import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { parsePrismaError } from '../common/prisma-error.util';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.roles.findMany();
    } catch (e) {
      const err = parsePrismaError(e);
      this.logger.error(`findAll failed`, err);
      throw new InternalServerErrorException(err);
    }
  }

  async findOne(id: number) {
    try {
      const role = await this.prisma.roles.findUnique({ where: { id } });
      if (!role) throw new NotFoundException('Role không tồn tại');
      return role;
    } catch (e) {
      const err = parsePrismaError(e);
      this.logger.error(`findOne(${id}) failed`, err);
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException(err);
    }
  }

  async create(dto: CreateRoleDto) {
    try {
      return await this.prisma.roles.create({ data: dto });
    } catch (e: any) {
      const err = parsePrismaError(e);
      this.logger.error(`create failed`, err);

      // Prisma unique constraint
      if (e?.code === 'P2002') {
        throw new BadRequestException({
          ...err,
          human: 'Role đã tồn tại (trùng name)',
        });
      }

      throw new InternalServerErrorException(err);
    }
  }

  async update(id: number, dto: UpdateRoleDto) {
    try {
      // đảm bảo tồn tại
      await this.findOne(id);

      return await this.prisma.roles.update({
        where: { id },
        data: dto,
      });
    } catch (e: any) {
      const err = parsePrismaError(e);
      this.logger.error(`update(${id}) failed`, err);

      if (e instanceof NotFoundException) throw e;

      if (e?.code === 'P2002') {
        throw new BadRequestException({
          ...err,
          human: 'Tên role bị trùng',
        });
      }

      throw new InternalServerErrorException(err);
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      return await this.prisma.roles.delete({ where: { id } });
    } catch (e: any) {
      const err = parsePrismaError(e);
      this.logger.error(`remove(${id}) failed`, err);

      if (e instanceof NotFoundException) throw e;

      throw new InternalServerErrorException(err);
    }
  }

  async sort(field: string, order: 'asc' | 'desc' = 'asc') {
    try {
      const allowed = ['id', 'name', 'description'];
      if (!allowed.includes(field)) {
        throw new BadRequestException('Field không hợp lệ');
      }

      return await this.prisma.roles.findMany({
        orderBy: { [field]: order },
      });
    } catch (e: any) {
      const err = parsePrismaError(e);
      this.logger.error(`sort(${field},${order}) failed`, err);
      if (e instanceof BadRequestException) throw e;
      throw new InternalServerErrorException(err);
    }
  }

  async search(keyword: string) {
    try {
      return await this.prisma.roles.findMany({
        where: {
          OR: [
            { name: { contains: keyword } },
            { description: { contains: keyword } },
          ],
        },
      });
    } catch (e) {
      const err = parsePrismaError(e);
      this.logger.error(`search(${keyword}) failed`, err);
      throw new InternalServerErrorException(err);
    }
  }
}
