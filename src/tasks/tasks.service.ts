import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { User } from 'src/auth/users.entity';

@Injectable()
export class TasksService {

    constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

    getAllTasks(getTasksDto: GetTasksDto,user:User): Promise<Task[]> {
        const { status, search, page, limit, sort } = getTasksDto;
        return this.tasksRepository.getTasks(status, search,limit, page, sort ,user);
    }

    getTaskById(id: string,user:User): Promise<Task> {
        return this.tasksRepository.getById(id,user);
    }

    createTask(createTaskDto: CreateTaskDto,user:User): Promise<Task> {
        const { title, description } = createTaskDto;
        return this.tasksRepository.createTask(title, description,user);
    }

    deleteTask(id: string,user:User): Promise<void>{
       return this.tasksRepository.deleteTask(id,user);
    }

    updateTaskStatus(id: string, status: TaskStatus,user:User): Promise<Task> {
        return this.tasksRepository.updateTaskStatus(id, status,user);
    }
}
