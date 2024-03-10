// user/entities/user.entity.ts
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ApiProperty } from '@nestjs/swagger';
import { PostsEntity } from '../../posts/entities/post.entity';
import { ConfigService } from '@nestjs/config';

@Entity('user')
export class User {
  @ApiProperty({ description: 'user id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, nullable: true })
  username: string;

  @Exclude()
  @Column({ select: false, nullable: true })
  password: string;

  @Column({ default: null })
  avatar: string;

  @Column({ default: null })
  email: string;

  @Column('enum', { enum: ['admin', 'manager', 'visitor'], default: 'visitor' })
  role: string;

  @OneToMany(() => PostsEntity, (post) => post.author)
  posts: PostsEntity[];

  @CreateDateColumn({
    name: 'create_time',
    type: 'timestamp',
  })
  createTime: Date;

  @Exclude()
  @UpdateDateColumn({
    name: 'update_time',
    type: 'timestamp',
  })
  updateTime: Date;

  @BeforeInsert()
  async encryptPwd(configService: ConfigService) {
    if (!this.password) return;
    this.password = bcrypt.hashSync(
      this.password,
      configService.get('SALT', 10),
    );
  }
}
