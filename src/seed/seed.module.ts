import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { UsersModule } from '../users/users.module';
import { ItemsModule } from '../items/items.module';
import { ListsModule } from '../lists/lists.module';
import { ListItemModule } from '../list-item/list-item.module';

@Module({
  imports: [UsersModule, ItemsModule, ListsModule, ListItemModule],
  providers: [SeedResolver, SeedService],
})
export class SeedModule {}
