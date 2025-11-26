import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { parsePrismaError } from '../common/prisma-error.util';

const prisma = new PrismaClient();

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  async findAll() {
    try {
      const data = await prisma.roles.findMany();

      this.logger.log(`findAll success - total=${data.length}`);

      return data;
    } catch (e) {
      const err = parsePrismaError(e);
      this.logger.error(`findAll failed`, err);
      throw new InternalServerErrorException(err);
    }
  }

  async findOne(id: number) {
    try {
      const role = await prisma.roles.findUnique({ where: { id } });

      if (!role) throw new NotFoundException('This role is not exist!');

      this.logger.log(`findOne success - id=${id}, name=${role.name}`);

      return role;
    } catch (e: any) {
      const err = parsePrismaError(e);
      this.logger.error(`findOne(${id}) failed`, err);

      if (e instanceof NotFoundException) throw e;

      throw new InternalServerErrorException(err);
    }
  }

  async create(dto: CreateRoleDto) {
    try {
      const role = await prisma.roles.create({ data: dto });

      this.logger.log(`create success - id=${role.id}, name=${role.name}`);

      return role;
    } catch (e: any) {
      const err = parsePrismaError(e);
      this.logger.error(`create failed`, err);

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
      const existed = await prisma.roles.findUnique({ where: { id } });

      if (!existed) {
        const notFoundLog = {
          code: 'ROLE_NOT_FOUND',
          message: `Cannot update role because id=${id} does not exist`,
        };

        this.logger.error(`update(${id}) failed - role not found`, notFoundLog);

        throw new NotFoundException({
          ...notFoundLog,
          human: 'Role is not exist',
        });
      }

      const updated = await prisma.roles.update({
        where: { id },
        data: dto,
      });

      this.logger.log(`update success - id=${id}, old=${existed.name}, new=${updated.name}`);

      return updated;

    } catch (e: any) {
      const err = parsePrismaError(e);
      this.logger.error(`update(${id}) failed`, err);

      if (e instanceof NotFoundException) throw e;

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
      const existed = await prisma.roles.findUnique({ where: { id } });

      if (!existed) {
        const notFoundLog = {
          code: 'ROLE_NOT_FOUND',
          message: `Cannot delete role because id=${id} does not exist`,
        };

        this.logger.error(`remove(${id}) failed - role not found`, notFoundLog);

        throw new NotFoundException({
          ...notFoundLog,
          human: 'Role is not exist',
        });
      }

      const deleted = await prisma.roles.delete({ where: { id } });

      this.logger.log(`remove success - id=${id}, name=${deleted.name}`);

      return deleted;

    } catch (e: any) {
      const err = parsePrismaError(e);
      this.logger.error(`remove(${id}) failed`, err);

      if (e instanceof NotFoundException) throw e;

      throw new InternalServerErrorException(err);
    }
  }
}
