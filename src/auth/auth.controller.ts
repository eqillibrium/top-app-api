import { Controller, Post, HttpCode, Body, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UsePipes(new ValidationPipe())
    @Post('register')
    async register(@Body() dto: AuthDto) {
        const isUserExists = await this.authService.findUser(dto.email)
        if(isUserExists) {
            throw new BadRequestException(ALREADY_REGISTERED_ERROR)
        }
        return this.authService.createUser(dto)
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('login')
    async login(@Body() { email, password }: AuthDto) {
        const user = await this.authService.validateUser(email, password)
        return this.authService.login(email)
    }
}
