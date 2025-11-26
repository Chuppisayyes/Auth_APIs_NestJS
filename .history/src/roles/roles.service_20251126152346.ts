import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

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

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
