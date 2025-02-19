import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'int', comment: '用户id' })
  user_id: number;

  @Column({ type: 'varchar', length: 20, comment: '用户名' })
  user_name: string;

  @Column({ type: 'varchar', length: 20, comment: '用户昵称' })
  user_nickname: string;

  @Column({ type: 'varchar', length: 30, comment: '用户邮箱' })
  user_email: string;

  @Column({ type: 'varchar', length: 255, comment: '用户头像' })
  user_avatar: string;

  @Column({ type: 'tinyint', length: 0, comment: '用户年龄' })
  user_age: string;

  @Column({ type: 'bigint', comment: '用户生日' })
  user_birthday: number;

  @Column({ type: 'bigint', comment: '用户注册时间' })
  user_register_time: number;
}
