import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationArg, SearchArg } from '../common/dto';
import { User } from '../users/entities/user.entity';
import { CreateListInput, UpdateListInput } from './dto';
import { List } from './entities/list.entity';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
  ) {}

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const list = this.listRepository.create({ ...createListInput, user });
    return await this.listRepository.save(list);
  }

  async findAll(
    user: User,
    paginationArg: PaginationArg,
    searchArg: SearchArg,
  ): Promise<List[]> {
    const { limit, offset } = paginationArg;
    const { search } = searchArg;

    const queryBuilder = this.listRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"user_id" = :id`, { id: user.id });

    if (search) {
      queryBuilder.andWhere('LOWER(name) LIKE :name', {
        name: `%${search.toLowerCase()}%`,
      });
    }
    return queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = await this.listRepository.findOneBy({
      id,
      user: { id: user.id },
    });
    if (!list) {
      throw new NotFoundException();
    }
    return list;
  }

  async update(
    id: string,
    updateListInput: UpdateListInput,
    user: User,
  ): Promise<List> {
    await this.findOne(id, user);
    const list = await this.listRepository.preload({
      ...updateListInput,
      user,
    });
    return await this.listRepository.save(list);
  }

  async remove(id: string, user: User): Promise<List> {
    const list = await this.findOne(id, user);
    await this.listRepository.remove(list);
    return { ...list, id };
  }

  async listItemCountByUser(user: User): Promise<number> {
    return await this.listRepository.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}
