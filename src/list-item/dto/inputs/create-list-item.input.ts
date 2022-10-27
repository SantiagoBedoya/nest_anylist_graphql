import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

@InputType()
export class CreateListItemInput {
  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity: number;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  completed: boolean;

  @Field(() => ID, { nullable: false })
  @IsNotEmpty()
  @IsUUID()
  listId: string;

  @Field(() => ID, { nullable: false })
  @IsNotEmpty()
  @IsUUID()
  itemId: string;
}
