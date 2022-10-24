import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  fullName: string;

  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
