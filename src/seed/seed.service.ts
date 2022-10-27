import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../items/entities/item.entity';
import { ItemsService } from '../items/items.service';
import { ListItem } from '../list-item/entities/list-item.entity';
import { ListItemService } from '../list-item/list-item.service';
import { List } from '../lists/entities/list.entity';
import { ListsService } from '../lists/lists.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';

@Injectable()
export class SeedService {
  private isProd: boolean;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
    private readonly usersService: UsersService,
    private readonly listsService: ListsService,
    private readonly itemsService: ItemsService,
    private readonly listItemsService: ListItemService,
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

    // load lists
    const list = await this.loadLists(user);

    // load listItems
    const items = await this.itemsService.findAll(
      user,
      { limit: 15, offset: 0 },
      { search: '' },
    );
    await this.loadListItems(list, items);
    return true;
  }

  private async truncateDatabase() {
    // truncate listItems;
    await this.listItemRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
    // truncate lists
    await this.listRepository.createQueryBuilder().delete().where({}).execute();
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

  private async loadLists(user: User): Promise<List> {
    const lists = [];
    for (const list of SEED_LISTS) {
      lists.push(await this.listsService.create(list, user));
    }
    return lists[0];
  }

  private async loadListItems(list: List, items: Item[]): Promise<void> {
    for (const item of items) {
      this.listItemsService.create({
        quantity: Math.round(Math.random() * 10),
        completed: Math.round(Math.random() * 1) === 0 ? false : true,
        listId: list.id,
        itemId: item.id,
      });
    }
  }
}
