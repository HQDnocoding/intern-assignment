import { Body, Controller, Get, HttpStatus, ParseFilePipeBuilder, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './dto/auth.service.js';
import { SignUpDto } from './dto/sign-up.dto.js';
import { VerifyEmailDto } from './dto/verify-email.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard.js';
import { JwtAccessGuard } from './guards/jwt-access.guard.js';
import { ResendVerificationDto } from './dto/resend-verify.dto.js';
import type { Response } from 'express';
import { UserService } from '../user/user.service.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { avatarMulterConfig } from '../user/multer.config.js';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto.js';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService,
    ) { }

    @Post('signup')
    signUp(@Body() dto: SignUpDto) {
        return this.authService.signUp(dto);
    }
    @Post('verify-email')
    verifyEmail(@Body() dto: VerifyEmailDto
    ) {
        return this.authService.verifyEmail(dto.token);
    }

    @Get('verify-email')
    async verifyEmailByLink(
        @Query('token') token: string,
        @Query('callbackURL') callbackURL: string | undefined,
        @Res() res: Response,
    ) {
        const redirectUrl = await this.authService.verifyEmailAndRedirect(token, callbackURL);
        return res.redirect(302, redirectUrl);
    }

    @Post('resend-verification')
    resendVerification(@Body() dto: ResendVerificationDto) {
        return this.authService.resendVerification(dto.email);
    }

    @Post('complete-onboarding')
    @UseInterceptors(FileInterceptor('avatar', avatarMulterConfig))
    async completeOnboarding(
        @Body() dto: CompleteOnboardingDto,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ })
                .build({
                    fileIsRequired: false,
                    errorHttpStatusCode: HttpStatus.BAD_REQUEST,
                }),
        )
        avatar?: Express.Multer.File,
    ) {
        return this.authService.completeOnboarding(dto.onboardingToken, dto.name, avatar);
    }

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @UseGuards(JwtRefreshGuard)
    @Post('refresh')
    refresh(@Req() req: any) {
        return this.authService.refreshTokens(req.user.userId, req.user.email);
    }

    @UseGuards(JwtAccessGuard)
    @Get('me')
    async me(@Req() req: any) {
        return this.userService.getMe(req.user.userId);
    }
}
