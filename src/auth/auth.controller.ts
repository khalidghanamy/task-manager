import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Post('/signup')
    signUp(@Body() signUpDto: SignUpDto): Promise<String> {
        return this.authService.signUp(signUpDto);
    }

    @Post('/signin')
    signIn(@Body() signInDto: SignInDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(signInDto);

    }
}
