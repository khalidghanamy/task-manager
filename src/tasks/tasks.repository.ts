import { EntityRepository, Like, Not, Repository } from "typeorm";
import { Task } from "./task.entity";
import { TaskStatus } from "./task-status";
import {NotFoundException } from "@nestjs/common";
import { User } from "src/auth/users.entity";

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {

    async getById(id: string): Promise<Task> {
        return await this.findOne({
            where: { id }
        });
    }

    async createTask(title: string, description: string,user:User): Promise<Task> {
        const task = this.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user
        });
         await this.save(task);
         return task;
    }

    async deleteTask(id: string): Promise<void> {
        let result = await this.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException();
        }
    }

    async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
        let task = await this.getById(id);
        task.status = status;
        return await this.save(task);
    }

    async getTasks(status: TaskStatus, search: string, limit: number, page: number, sort: { [key: string]: 'ASC' | 'DESC' }): Promise<Task[]> {
        const where: { [key: string]: any } = {
            ...(status ? { status } : {}),
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

