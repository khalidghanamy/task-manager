import { IsNotEmpty, IsString, MaxLength, Min, MinLength } from "class-validator";
import { sign } from 'jsonwebtoken';


export class SignInDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;
    
    @IsString()
    @MinLength(8)
    password: string;
}