/*
 * @Descripttion :
 * @Author       : wuhaidong
 * @Date         : 2023-05-12 12:22:34
 * @LastEditors  : wuhaidong
 * @LastEditTime : 2023-08-02 18:09:01
 */
import { PostsEntity } from 'src/posts/entities/posts.entity';
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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => PostsEntity, (post) => post.category)
  posts: Array<PostsEntity>;

  @CreateDateColumn({
    type: 'timestamp',
    comment: '创建时间',
    name: 'create_time',
  })
  createTime: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: '更新时间',
    name: 'update_time',
  })
  updateTime: Date;
}
