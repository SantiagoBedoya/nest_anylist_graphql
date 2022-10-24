import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateItemInput, UpdateItemInput } from './dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const item = this.itemRepository.create({ ...createItemInput, user });
    return await this.itemRepository.save(item);
  }

  async findAll(user: User): Promise<Item[]> {
    const items = await this.itemRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
    });
    return items;
  }

  async findOne(id: string, user: User) {
    const item = await this.itemRepository.findOneBy({
      id: id,
      user: {
        id: user.id,
      },
    });
    if (!item) throw new NotFoundException();
    return item;
  }

  async update(
    id: string,
    updateItemInput: UpdateItemInput,
    user: User,
  ): Promise<Item> {
    const item = await this.findOne(id, user);
    return this.itemRepository.save({ ...item, ...updateItemInput });
  }

  async remove(id: string, user: User): Promise<Item> {
    const item = await this.findOne(id, user);
    await this.itemRepository.remove(item);
    return { ...item, id };
  }

  async itemCountByUser(user: User): Promise<number> {
    return await this.itemRepository.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}
