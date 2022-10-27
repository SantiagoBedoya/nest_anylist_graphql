import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { CreateListInput, UpdateListInput } from './dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { List } from './entities/list.entity';
import { ListsService } from './lists.service';
import { PaginationArg, SearchArg } from '../common/dto';
import { User } from '../users/entities/user.entity';
import { ListItem } from '../list-item/entities/list-item.entity';
import { ListItemService } from '../list-item/list-item.service';

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListsResolver {
  constructor(
    private readonly listsService: ListsService,
    private readonly listItemService: ListItemService,
  ) {}

  @Mutation(() => List)
  createList(
    @Args('createListInput') createListInput: CreateListInput,
    @CurrentUser() user: User,
  ) {
    return this.listsService.create(createListInput, user);
  }

  @Query(() => [List], { name: 'lists' })
  findAll(
    @CurrentUser() user: User,
    @Args() paginationArg: PaginationArg,
    @Args() searchArg: SearchArg,
  ) {
    return this.listsService.findAll(user, paginationArg, searchArg);
  }

  @Query(() => List, { name: 'list' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.listsService.findOne(id, user);
  }

  @Mutation(() => List)
  updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @CurrentUser() user: User,
  ) {
    return this.listsService.update(updateListInput.id, updateListInput, user);
  }

  @Mutation(() => List)
  removeList(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.listsService.remove(id, user);
  }

  @ResolveField(() => [ListItem], { name: 'items' })
  async getListItems(
    @Parent() list: List,
    @Args() paginationArgs: PaginationArg,
    @Args() searchArg: SearchArg,
  ): Promise<ListItem[]> {
    return this.listItemService.findAll(list, paginationArgs, searchArg);
  }

  @ResolveField(() => Int, { name: 'totalItems' })
  totalItems(@Parent() list: List): Promise<number> {
    return this.listItemService.totalItems(list);
  }
}
