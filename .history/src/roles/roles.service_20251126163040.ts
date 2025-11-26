import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaClient } from '../generated/prisma/client';
import { parsePrismaError } from '../common/prisma-error.util';

const prisma = new PrismaClient();

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  async findAll() {
    try {
      return await prisma.roles.findMany();
    } catch (e) {
      const err = parsePrismaError(e);
      this.logger.error('FindAll() failed', err);
      throw new InternalServerErrorException(err);
    }
  }

  async findOne(id: number) {
    try {
      const role = await prisma.roles.findUnique({ where: { id } });

      if (!role) {
        const msg = `Role id=${id} does not exist`;
        this.logger.warn(msg);
        throw new NotFoundException(msg);
      }

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
      return await prisma.roles.create({ data: dto });
    } catch (e: any) {
      const err = parsePrismaError(e);
      this.logger.error('create() failed', err);

      if (e?.code === 'P2002') {
        throw new BadRequestException({
          message: 'Role already exists with same name',
        });
      }

      throw new InternalServerErrorException(err);
    }
  }

  async update(id: number, dto: UpdateRoleDto) {
    try {
      const existed = await prisma.roles.findUnique({ where: { id } });

      if (!existed) {
        const msg = `Cannot update: role id=${id} not found`;
        this.logger.warn(msg);
        throw new NotFoundException({ message: msg });
      }

      return await prisma.roles.update({ where: { id }, data: dto });
    } catch (e: any) {
      const err = parsePrismaError(e);
      this.logger.error(`update(${id}) failed`, err);

      if (e instanceof NotFoundException) throw e;

      if (e?.code === 'P2002') {
        throw new BadRequestException({
          message: 'Role name duplicated',
        });
      }

      throw new InternalServerErrorException(err);
    }
  }

  async remove(id: number) {
    try {
      const existed = await prisma.roles.findUnique({ where: { id } });

      if (!existed) {
        const msg = `Cannot delete: role id=${id} not found`;
        this.logger.warn(msg);
        throw new NotFoundException({ message: msg });
      }

      return await prisma.roles.delete({ where: { id } });
    } catch (e: any) {
      const err = parsePrismaError(e);
      this.logger.error(`remove(${id}) failed`, err);

      if (e instanceof NotFoundException) throw e;

      throw new InternalServerErrorException(err);
    }
  }

  async sort(field: string, order: 'asc' | 'desc') {
    try {
      return await prisma.roles.findMany({
        orderBy: { [field]: order },
      });
    } catch (e) {
      const err = parsePrismaError(e);
      this.logger.error(`sort(${field}, ${order}) failed`, err);
      throw new InternalServerErrorException(err);
    }
  }

  async search(keyword: string) {
    try {
      return await prisma.roles.findMany({
        where: {
          OR: [
            { name: { contains: keyword } },
            { description: { contains: keyword } },
          ],
        },
      });
    } catch (e) {
      const err = parsePrismaError(e);
      this.logger.error(`search("${keyword}") failed`, err);
      throw new InternalServerErrorException(err);
    }
  }
}
