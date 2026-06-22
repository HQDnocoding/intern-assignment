import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller.js';
import { AuthService } from './dto/auth.service.js';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy.js';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy.js';
import { UserModule } from '../user/user.module.js';
import { ResendMailService } from './mail/resend-mail.service.js';
import { TokenService } from './token.service.js';
import { MAIL_SERVICE } from '../common/interfaces/mail.interface.js';

@Module({
    imports: [PassportModule, JwtModule.register({}), UserModule],
    controllers: [AuthController],
    providers: [
        AuthService,
        TokenService,
        JwtAccessStrategy,
        JwtRefreshStrategy,
        ResendMailService,
        { provide: MAIL_SERVICE, useExisting: ResendMailService },
    ],
})
export class AuthModule { }
