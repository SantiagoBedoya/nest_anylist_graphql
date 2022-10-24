import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateItemInput {
  @IsString()
  @MaxLength(20)
  @MinLength(3)
  @IsNotEmpty()
  @Field(() => String)
  name: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  quantityUnits?: string;
}
