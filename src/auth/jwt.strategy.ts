import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { UsersRepository } from './users.repository';
import { User } from "./users.entity";
import { JwtPayload } from "./jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";


@Injectable() 
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository,
        private configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload: JwtPayload): Promise<User> {
        let user = await this.usersRepository.findOne({
            where:{ username: payload.username },
            select: ['id','username']
        });
        if (!user) {
            throw new UnauthorizedException("Unauthorized");
        }
        return user;
    }
}