import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationArg, SearchArg } from '../common/dto';
import { List } from '../lists/entities/list.entity';
import { CreateListItemInput, UpdateListItemInput } from './dto';
import { ListItem } from './entities/list-item.entity';

@Injectable()
export class ListItemService {
  private readonly logger: Logger = new Logger(ListItemService.name);
  constructor(
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
  ) {}
  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    try {
      const { itemId, listId, ...rest } = createListItemInput;
      const listItem = this.listItemRepository.create({
        ...rest,
        item: { id: itemId },
        list: { id: listId },
      });
      await this.listItemRepository.save(listItem);
      return await this.findOne(listItem.id);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(
    list: List,
    paginationArg: PaginationArg,
    searchArg: SearchArg,
  ) {
    const { limit, offset } = paginationArg;
    const { search } = searchArg;

    const queryBuilder = this.listItemRepository
      .createQueryBuilder()
      .skip(offset)
      .take(limit)
      .where(`"list_id" = :id`, { id: list.id });

    if (search) {
      queryBuilder.andWhere('LOWER(name) like :name', {
        name: `%${search.toLowerCase()}%`,
      });
    }
    return queryBuilder.getMany();
  }

  async totalItems(list: List): Promise<number> {
    return await this.listItemRepository.count({
      where: {
        list: {
          id: list.id,
        },
      },
    });
  }

  async findOne(id: string): Promise<ListItem> {
    const listItem = await this.listItemRepository.findOneBy({ id });
    if (!listItem) {
      throw new NotFoundException();
    }
    return listItem;
  }

  async update(
    id: string,
    updateListItemInput: UpdateListItemInput,
  ): Promise<ListItem> {
    const { listId, itemId, ...rest } = updateListItemInput;
    const queryBuilder = this.listItemRepository
      .createQueryBuilder()
      .update()
      .set(rest)
      .where('id = :id', { id });

    if (listId) {
      queryBuilder.set({ list: { id: listId } });
    }
    if (itemId) {
      queryBuilder.set({ item: { id: itemId } });
    }

    await queryBuilder.execute();
    return await this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException('item already exists in the list');
    }
    this.logger.error(error);
    throw new InternalServerErrorException();
  }
}
