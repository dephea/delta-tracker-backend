import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { JwtAuthGuard } from "src/auth/strategies/jwt-auth.guard";


@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService
    ) {}

    @Get('all')
    @UseGuards(JwtAuthGuard)
    async findAll(@Req() req){
        return this.postsService.findAll(req.user.userId)
    }

    @Get('find/:id')
    async findOne(@Param('id') id: string, @Req() req){
        return this.postsService.findOne(+id)
    }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    create(@Req() req, @Body() dto: CreatePostDto){
        return this.postsService.create(dto, req.user.userId)
    }
    
}