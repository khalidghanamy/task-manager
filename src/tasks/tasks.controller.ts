import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @Get()
    getAllTasks(@Query() GetTasksDto: GetTasksDto): Promise<Task[]> {
        
        return this.tasksService.getAllTasks(GetTasksDto);
    }

    @Get('/:id')
    getTaskById(@Param("id") id: string): Promise<Task> {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto,@GetUser() user): Promise<Task> {
        return this.tasksService.createTask(createTaskDto,user);
    }

    @Delete('/:id')
    deleteTask(@Param("id") id: string): Promise<void> {
        return this.tasksService.deleteTask(id);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param("id") id: string,
        @Body() updateTaskDto: UpdateTaskDto
    ): Promise<Task> {
        const { status } = updateTaskDto;
        return this.tasksService.updateTaskStatus(id, status);
    }


}
