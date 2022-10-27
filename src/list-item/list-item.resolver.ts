import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ListItemService } from './list-item.service';
import { ListItem } from './entities/list-item.entity';
import { CreateListItemInput, UpdateListItemInput } from './dto';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => ListItem)
@UseGuards(JwtAuthGuard)
export class ListItemResolver {
  constructor(private readonly listItemService: ListItemService) {}

  @Mutation(() => ListItem)
  createListItem(
    @Args('createListItemInput') createListItemInput: CreateListItemInput,
    @CurrentUser() user: User,
  ): Promise<ListItem> {
    return this.listItemService.create(createListItemInput);
  }

  // @Query(() => [ListItem], { name: 'listItems' })
  // findAll(@CurrentUser() user: User) {
  //   return this.listItemService.findAll();
  // }

  @Query(() => ListItem, { name: 'listItem' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.listItemService.findOne(id);
  }

  @Mutation(() => ListItem)
  updateListItem(
    @Args('updateListItemInput') updateListItemInput: UpdateListItemInput,
  ): Promise<ListItem> {
    return this.listItemService.update(
      updateListItemInput.id,
      updateListItemInput,
    );
  }

  // @Mutation(() => ListItem)
  // removeListItem(@Args('id', { type: () => Int }) id: number) {
  //   return this.listItemService.remove(id);
  // }
}
