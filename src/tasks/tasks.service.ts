import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async findAll(userId: number): Promise<Task[]> {
    return this.tasksRepository.find({
      where: {
        user: { id: userId },
      }
    });
  }

  async findOne(id: number, userId: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { 
        id,
        user: { id: userId },
       },
      relations: ['user'],
    });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} was not found`);
    }
    return task;
  }


  async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    console.log("Create Task DTO from create func:", createTaskDto);
    const now = new Date();
    const task = this.tasksRepository.create({
      ...createTaskDto,
      user: { id: userId },
      createdAt: now,
      updatedAt: now,
  })
    return this.tasksRepository.save(task);
  }


  async update(updateTaskDto: UpdateTaskDto, userId: number): Promise<Task | null> {
    const task = await this.findOne(updateTaskDto.id, userId);
    if (!task) {
      throw new Error(`Task with id ${updateTaskDto.id} not found`);
    }
    if (task.user.id !== userId) {
      throw new ForbiddenException(`You do not have permission to update this task`);
    }

    await this.tasksRepository.update(updateTaskDto.id, updateTaskDto);
    const res = await this.tasksRepository.findOne({ where: { id: updateTaskDto.id } })
    console.log(res);
    return res;;
  }

  async remove(id: number): Promise<void> {
    await this.tasksRepository.delete(id);
  }
}
