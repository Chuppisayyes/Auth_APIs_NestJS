    import { ApiProperty } from '@nestjs/swagger';
    import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

    export class CreateRoleDto {
    @ApiProperty({ example: 'admin' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Quản trị hệ thống', required: false })
    @IsOptional()
    @IsString()
    description?: string;
    }
