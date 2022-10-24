import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpInput } from '../auth/dto';
import { User } from './entities/user.entity';
import * as argon2 from 'argon2';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(signUpInput: SignUpInput): Promise<User> {
    try {
      const hash = await argon2.hash(signUpInput.password);
      const user = this.userRepository.create({
        ...signUpInput,
        password: hash,
      });
      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(validRoles: ValidRoles[]): Promise<User[]> {
    if (validRoles.length === 0) {
      return await this.userRepository.find();
    }

    return this.userRepository
      .createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', validRoles)
      .getMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException();
    return user;
  }
  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new NotFoundException();
    return user;
  }

  async block(id: string, adminUser: User): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = false;
    user.lastUpdateBy = adminUser;
    await this.userRepository.save(user);
    return user;
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    adminUser: User,
  ): Promise<User> {
    try {
      const user = await this.userRepository.preload({
        ...updateUserInput,
        id,
      });
      user.lastUpdateBy = adminUser;
      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key ', ''));
    }
    this.logger.error(error);
    throw new InternalServerErrorException();
  }
}
