import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../items/entities/item.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';

@Injectable()
export class SeedService {
  private isProd: boolean;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
  ) {
    this.isProd = configService.get('STAGE') === 'prod';
  }

  async execute(): Promise<boolean> {
    if (this.isProd) {
      throw new UnauthorizedException('We cannot execute seed on PROD');
    }

    // truncate database
    await this.truncateDatabase();
    // load users
    const user = await this.loadUsers();
    // load items
    await this.loadItems(user);
    return true;
  }

  private async truncateDatabase() {
    // truncate items
    await this.itemRepository.createQueryBuilder().delete().where({}).execute();
    // truncate users
    await this.userRepository.createQueryBuilder().delete().where({}).execute();
  }

  private async loadUsers(): Promise<User> {
    const users = [];
    for (const user of SEED_USERS) {
      users.push(await this.usersService.create(user));
    }
    return users[0];
  }

  private async loadItems(user: User): Promise<void> {
    const items = [];
    for (const item of SEED_ITEMS) {
      items.push(this.itemRepository.create({ ...item, user }));
    }
    await this.itemRepository.save(items);
  }
}
