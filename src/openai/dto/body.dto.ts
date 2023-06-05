import { IsNumber, IsString } from 'class-validator';

export class BodyDto {
  @IsString()
  prompt: string;

  @IsNumber()
  id: number;
}
