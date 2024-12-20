import { Column, Entity, EntityRepository, PrimaryGeneratedColumn, Repository } from "typeorm";
import { User } from "./users.entity";
import { ConflictException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
@EntityRepository(User)
export class UsersRepository extends Repository<User> {

    async createUser(username: string, password: string): Promise<string> {
        //check if user exists
        const userExists = await this.getUserByUsername(username);
        if (userExists) {
            throw new ConflictException('Username already exists');
        };

        //hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.create({
            username,
            password: hashedPassword
        });
        await this.save(user);
        return 'User created successfully';

    }

    async getUserByUsername(username: string): Promise<User> {
        return await this.findOne({
            where: { username }
        });
    }
}
