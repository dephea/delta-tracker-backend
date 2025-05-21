import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req) {
    return this.tasksService.findAll(req.user.userId); 
  } 

  @Get('find/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Req() req) {
    return this.tasksService.findOne(+id, req.user.userId);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Req() req, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto, req.user.userId);
  }

  @Post('update')
  @UseGuards(JwtAuthGuard)
  async update(@Req() Req, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(updateTaskDto, Req.user.userId);
  }
}
