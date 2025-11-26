import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

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
      this.logger.error(`FindAll Failed`, err);
      throw new InternalServerErrorException(err);
    }
  }

  async findOne(id: number) {
    try {
      const role = await prisma.roles.findUnique({ 
        where: { id } 
      });
      if (!role) throw new NotFoundException('This role is not exist!');
      return role;
    } catch (e) {
      const err = parsePrismaError(e);
      this.logger.error(`FindOne(${id}) Failed`, err);
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException(err);
    }
  }
 async create(dto: CreateRoleDto) {
    try {
      return await prisma.roles.create({ data: dto });
    } catch (e: any) {
      const err = parsePrismaError(e);
      this.logger.error(`create failed`, err);

      // Prisma unique constraint
      if (e?.code === 'P2002') {
        throw new BadRequestException({
          ...err,
          human: 'Role already exists (same name)',
        });
      }

      throw new InternalServerErrorException(err);
    }
  }
async update(id: number, dto: UpdateRoleDto) {
  try {
    // step 1: Check role exist
    const existed = await prisma.roles.findUnique({ where: { id } });

    if (!existed) {
      const notFoundLog = {
        code: 'ROLE_NOT_FOUND',
        message: `Cannot update role because id=${id} does not exist`,
      };

      this.logger.error(`update(${id}) failed - role not found`, notFoundLog);

      throw new NotFoundException({
        ...notFoundLog,
        human: 'Role is not exit',
      });
    }

    // step 2: code update
    return await prisma.roles.update({
      where: { id },
      data: dto,
    });

  } catch (e: any) {
    const err = parsePrismaError(e);
    this.logger.error(`update(${id}) failed`, err);

    if (e instanceof NotFoundException) throw e;

    // Prisma: unique name trùng
    if (e?.code === 'P2002') {
      throw new BadRequestException({
        ...err,
        human: 'Role name is duplicated',
      });
    }

    throw new InternalServerErrorException(err);
  }
}

  async remove(id: number) {
    try {
      // step 1: Check role exist
      const existed = await prisma.roles.findUnique({ where: { id } });

      if (!existed) {
        const notFoundLog = {
          code: 'ROLE_NOT_FOUND',
          message: `Cannot update role because id=${id} does not exist`,
        };

        this.logger.error(`update(${id}) failed - role not found`, notFoundLog);

        throw new NotFoundException({
          ...notFoundLog,
          human: 'Role is not exit',
        });
      }
    // step 2: code delete
      return await prisma.roles.delete({ where: { id } });
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
}

