import { IsEmail, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class PartFoundDto {
  @IsUUID()
  partId: string;

  @IsEmail()
  customerEmail: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  managerComment?: string;
}
