import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { UsersModule } from '../users/users.module';
import { ItemsModule } from '../items/items.module';

@Module({
  imports: [UsersModule, ItemsModule],
  providers: [SeedResolver, SeedService],
})
export class SeedModule {}
