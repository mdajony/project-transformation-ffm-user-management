import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsNumber, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  first_name: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  last_name: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  department: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  designation: string;

  @ApiProperty()
  @IsEmail()
  @MinLength(5)
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  nid: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  profile_photo: string;



}