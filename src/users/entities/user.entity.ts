import { Exclude } from 'class-transformer';
import { Post } from 'src/posts/entities/post.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Task, task => task.user)
  tasks: Task[];

  @OneToMany(() => Post, post => post)
  posts: Post[];
}
