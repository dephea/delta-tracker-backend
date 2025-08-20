import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity() 
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @Column({ nullable: true })
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.posts, { nullable: false})
    @JoinColumn({ name: 'userId' })
    user: User;
}