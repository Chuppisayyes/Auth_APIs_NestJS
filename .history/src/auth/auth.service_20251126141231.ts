import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaClient } from '../generated/prisma/client';
const prisma = new PrismaClient();
@Injectable()
export class AuthService {

  Login(Body){}
  SignUp(Body){}










  // create(createAuthDto: CreateAuthDto) {
  //   return 'This action adds a new auth';
  // }

async findAll() {
    try {
      return await prisma.users.findMany({
        select: {
          id: true,
          email: true,
          full_name: true,
          phone: true,
          is_active: true,
          is_email_verified: true,
          created_at: true,
        },
        orderBy: { id: 'asc' }
      });
    } catch (error) {
      throw error;
    }
  }
async findRoles(){
  try{
      return await prisma.roles.findMany({
        select: {
          id: true,
          name: true,
          full_name: true,
          phone: true,
          is_active: true,
          is_email_verified: true,
          created_at: true,
        },
        orderBy: { id: 'asc' }
      });
  }
  catch (error) {
      throw error;
  }
}
  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
