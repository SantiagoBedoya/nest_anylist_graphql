import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';
import { List } from './entities/list.entity';
import { ListItemModule } from '../list-item/list-item.module';

@Module({
  imports: [TypeOrmModule.forFeature([List]), ListItemModule],
  providers: [ListsResolver, ListsService],
  exports: [ListsService, TypeOrmModule],
})
export class ListsModule {}
