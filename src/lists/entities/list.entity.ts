import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ListItem } from '../../list-item/entities/list-item.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'lists' })
@ObjectType()
export class List {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @ManyToOne(() => User, (user) => user.lists, { nullable: false, lazy: true })
  @JoinColumn({ name: 'user_id' })
  @Index('list_user_id_index')
  @Field(() => User)
  user: User;

  @OneToMany(() => ListItem, (listItems) => listItems.list, { lazy: true })
  // @Field(() => [ListItem])
  listItem: ListItem[];
}
