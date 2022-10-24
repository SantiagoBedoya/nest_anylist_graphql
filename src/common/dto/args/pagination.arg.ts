import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, Min } from 'class-validator';

@ArgsType()
export class PaginationArg {
  @Field(() => Int, { nullable: true })
  @Min(0)
  @IsOptional()
  offset = 0;

  @Field(() => Int, { nullable: true })
  @Min(1)
  @IsOptional()
  limit = 10;
}
