import { PostsEntity } from '../../posts/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('category')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => PostsEntity, (post) => post.category)
  posts: Array<PostsEntity>;

  @CreateDateColumn({
    type: 'timestamp',
    comment: 'create time',
    name: 'create_time',
  })
  createTime: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: 'update time',
    name: 'update_time',
  })
  updateTime: Date;
}
