import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UsersRepository)
        private userRepository: UsersRepository,
        private jwtService: JwtService
    ) { }

    async signUp(signUpDto: SignUpDto): Promise<string> {
        const { username, password } = signUpDto;
        return this.userRepository.createUser(username, password);

    }

    async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
        const { username, password } = signInDto;
        let user = await this.userRepository.findOne({
            where: {
                username: username
            }
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = { username };
            const accessToken = await this.jwtService.sign(payload);
            return { accessToken };
        }
        else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

}
