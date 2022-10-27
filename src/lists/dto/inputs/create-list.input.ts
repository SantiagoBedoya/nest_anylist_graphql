import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateListInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string;
}
