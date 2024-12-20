import { IsNotEmpty, IsString, MaxLength, Min, MinLength } from "class-validator";
import { sign } from '../../../node_modules/@types/jsonwebtoken/index.d';


export class SignUpDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;
    
    @IsString()
    @MinLength(8)
    password: string;
}