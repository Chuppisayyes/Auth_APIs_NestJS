import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  Login(@Body() Body){
    return this.authService.Login(Body);
  }
  @Post('/login-admin')
  LoginAdmin(){}

  @Post('/signup')
  SignUp(@Body() Body){
    return this.authService.SignUp(Body);
  }
  @Get('/users')
  async findAll() {
    return this.authService.findAll();
  }
    @Get('/me')
  async findMe() {
    return this.authService.findAll();
  }
  @Get('/roles')
  async findRoles() {
    return this.authService.findRoles();
  }

}
