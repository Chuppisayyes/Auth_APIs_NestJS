import { Injectable, Logger } from '@nestjs/common';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaClient } from '../generated/prisma/client';
import { parsePrismaError } from '../common/prisma-error.util';

const prisma = new PrismaClient();
@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);
  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  async findAll() {
    try {
      return await prisma.roles.findMany();
    } catch (e) {
      const err = parsePrismaError(e);
      this.logger.error(`findAll failed`, err);
      throw new InternalServerErrorException(err);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
