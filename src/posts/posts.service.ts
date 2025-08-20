import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "./entities/post.entity";
import { Repository } from "typeorm";
import { CreatePostDto } from "./dto/create-post.dto";
import { postDto } from "./dto/post.dto";
import { plainToInstance } from "class-transformer";


@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
    ) {}

    async findOne(id: number): Promise<postDto> {
        const post = await this.postRepository.findOne({
            where: {
                id
            }, 
            relations: ['user'],
        })
        if(!post) {
            throw new NotFoundException(`post with id ${id} was not found`)
        }
        console.log(post.user);
        return plainToInstance(postDto, post, { excludeExtraneousValues: true });
    }

    async findAll(userId: number): Promise<postDto[]> {
        return this.postRepository.find({
          where: {
            user: { id: userId },
          }
        });
      }

    async create(dto: CreatePostDto, userId: number): Promise<postDto> {
        const now = new Date();
        const post = this.postRepository.create({
            ...dto, 
            user: { id: userId},
            createdAt: now,
        })
        return this.postRepository.save(post);
    }

}