import { IsEnum } from "class-validator";
import { TaskStatus } from "../task-status";

export class UpdateTaskDto {
    
    @IsEnum(TaskStatus)
    status: TaskStatus;
}