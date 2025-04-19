import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    id: number;
    description?: string | undefined;
    dueDate?: Date | undefined;
    isCompleted?: boolean | undefined;
}
