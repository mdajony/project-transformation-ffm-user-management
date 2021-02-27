import { IsEmail, IsNotEmpty, IsString, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignServiceDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  company_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  service_id : ArrayBuffer;

}