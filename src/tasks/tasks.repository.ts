import { EntityRepository, Like, Not, Repository } from "typeorm";
import { Task } from "./task.entity";
import { TaskStatus } from "./task-status";
import { NotFoundException } from "@nestjs/common";
import { User } from "src/auth/users.entity";
import { Logger } from "@nestjs/common";

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
    private logger = new Logger('TasksRepository');
    async getById(id: string, user: User): Promise<Task> {
        let res = await this.findOne({
            where: { id, user }
        });
        if (!res) {
            throw new NotFoundException();
        }
        return res;
    }

    async createTask(title: string, description: string, user: User): Promise<Task> {
        const task = this.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user
        });
        await this.save(task);
        return task;
    }

    async deleteTask(id: string, user: User): Promise<string> {
        let result = await this.delete({ id, user });
        if (result.affected === 0) {
            this.logger.error(`User ${user} : Task with ID "${id}" not found`);
            throw new NotFoundException();
        }
        return "Task deleted successfully";
    }

    async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
        let task = await this.getById(id, user);
        task.status = status;
        return await this.save(task);
    }

    async getTasks(status: TaskStatus, search: string, limit: number, page: number, sort: { [key: string]: 'ASC' | 'DESC' }, user: User): Promise<Task[]> {
        const where: { [key: string]: any } = {
            ...(status ? { status } : {}),
            ...(user ? { user } : {}),
            ...(search ? [
                { title: Like(`%${search}%`) },
                { description: Like(`%${search}%`) }
            ] : {})
        };

        const options = {
            where,
            take: limit,
            skip: (page - 1) * limit,
            order: sort
        };

        return await this.find(options);
    }
}

