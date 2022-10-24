import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { SignUpInput } from './dto';
import { SignInInput } from './dto/inputs/signin.input';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthResponseType } from './types/auth-response.type';

@Resolver(() => AuthResponseType)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponseType, { name: 'signIn' })
  signIn(
    @Args('signInInput') signInInput: SignInInput,
  ): Promise<AuthResponseType> {
    return this.authService.signIn(signInInput);
  }

  @Mutation(() => AuthResponseType, { name: 'signUp' })
  signUp(
    @Args('signUpInput') signUpInput: SignUpInput,
  ): Promise<AuthResponseType> {
    return this.authService.signUp(signUpInput);
  }

  @Query(() => AuthResponseType, { name: 'revalidate' })
  @UseGuards(JwtAuthGuard)
  revalidate(@CurrentUser() user: User): Promise<AuthResponseType> {
    return this.authService.revalidate(user);
  }
}
