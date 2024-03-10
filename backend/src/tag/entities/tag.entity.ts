/*
 * @Descripttion :
 * @Author       : wuhaidong
 * @Date         : 2023-05-12 12:22:09
 * @LastEditors  : wuhaidong
 * @LastEditTime : 2023-08-02 17:54:42
 */
import { PostsEntity } from 'src/posts/entities/posts.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tag')
export class TagEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 标签名
  @Column()
  name: string;

  @ManyToMany(() => PostsEntity, (post) => post.tags)
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
