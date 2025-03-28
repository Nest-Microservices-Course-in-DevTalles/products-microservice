import { IsNumber, IsPositive, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {

  @IsString()
  public name: string;

  @IsNumber({
    maxDecimalPlaces: 4
  })
  @Min(0)
  @Type(() => Number) // Trata de transformar a número si es que se puede
  public price: number;

}
