import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsNumber, IsArray } from 'class-validator';

export class PasswordUpdateDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  old_password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  new_password: string;

}