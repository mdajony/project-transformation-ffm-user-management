import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsNumber, IsArray } from 'class-validator';

export class RemoveServiceDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  company_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  service_id : number;

}