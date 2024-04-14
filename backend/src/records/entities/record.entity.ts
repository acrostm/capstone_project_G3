import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/entities/user.entity";


@Entity('record')
export class Record {
  @PrimaryGeneratedColumn()
  id: number; // 标记为主列，值自动生成

  @Column({ type: 'int', default: 0 })
  curls_count: number;

  @Column({ type: 'int', default: 0 })
  squats_count: number;

  @Column({ type: 'int', default: 0 })
  bridges_count: number;

  @Column({ type: 'float', default: 0 })
  score: number;

  @Column({ length: 50, default: '' })
  mood: string;

  @CreateDateColumn({
    type: 'timestamp'
  })
  create_time: Date;

  @ManyToOne(() => User)
  user: User;
}
