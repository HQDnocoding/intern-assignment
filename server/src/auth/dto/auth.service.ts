import { BadRequestException, ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import * as crypto from 'crypto';
import { SignUpDto } from './sign-up.dto.js';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './login.dto.js';
import { ConfigService } from '@nestjs/config';
import { MAIL_SERVICE } from '../../common/interfaces/mail.interface.js';
import type { IMailService } from '../../common/interfaces/mail.interface.js';
import { STORAGE_SERVICE } from '../../common/interfaces/storage.interface.js';
import type { IStorageService } from '../../common/interfaces/storage.interface.js';
import { TokenService } from '../token.service.js';

type AuthUserRow = {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    emailVerified: boolean;
    onboardingCompleted: boolean;
};

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly config: ConfigService,
        private readonly tokenService: TokenService,
        @Inject(MAIL_SERVICE) private readonly mailService: IMailService,
        @Inject(STORAGE_SERVICE) private readonly storageService: IStorageService,
    ) { }

    private generateToken(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    private getBackendUrl() {
        return (
            this.config.get<string>('BACKEND_URL') ??
            this.config.getOrThrow<string>('FRONTEND_URL').replace(/:5173$/, ':3000')
        );
    }

    private getFrontendUrl() {
        return this.config.getOrThrow<string>('FRONTEND_URL');
    }

    private async getUserSnapshot(userId: string): Promise<AuthUserRow | undefined> {
        const [row] = await this.prisma.$queryRaw<AuthUserRow[]>`
            SELECT "id", "email", "name", "avatarUrl", "emailVerified", "onboardingCompleted"
            FROM "User"
            WHERE "id" = ${userId}
            LIMIT 1
        `;
        return row;
    }

    async signUp(dto: SignUpDto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing) {
            throw new ConflictException('Email is already in use');
        }

        const passwordHash = await bcrypt.hash(dto.password, 10);
        await this.prisma.user.create({
            data: { email: dto.email, name: dto.name, passwordHash },
        });

        await this.sendVerificationEmail(dto.email, dto.name);

        return { message: 'We have sent a verification link. Please check your email.' };
    }

    private async sendVerificationEmail(email: string, name: string) {
        const token = this.generateToken();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10);

        await this.prisma.emailVerificationToken.create({
            data: { email, token, expiresAt },
        });

        await this.mailService.sendVerificationEmail(email, name, token);
    }

    async resendVerification(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) throw new BadRequestException('Email does not exist');
        if (user.emailVerified) throw new BadRequestException('Email is already verified');

        await this.sendVerificationEmail(email, user.name ?? user.email);
        return { message: 'Verification link resent' };
    }

    async verifyEmail(token: string) {
        const record = await this.prisma.emailVerificationToken.findFirst({ where: { token } });
        if (!record) {
            throw new BadRequestException('Verification link is invalid or has already been used');
        }

        const user = await this.prisma.user.update({
            where: { email: record.email },
            data: { emailVerified: true },
        });

        return {
            message: 'Email verified',
            userId: user.id,
            email: user.email,
            onboardingCompleted: user.onboardingCompleted,
        };
    }

    async verifyEmailAndRedirect(token: string, callbackURL?: string) {
        const verified = await this.verifyEmail(token);
        const frontendUrl = this.getFrontendUrl();

        if (verified.onboardingCompleted) {
            return new URL('/dashboard', frontendUrl).toString();
        }

        const onboardingToken = this.tokenService.issueOnboardingToken(verified.userId, verified.email);
        const safeCallbackURL =
            callbackURL && callbackURL.startsWith('/') ? callbackURL : '/dashboard/onboarding?redirectTo=%2Fdashboard';
        const redirectUrl = new URL(safeCallbackURL, frontendUrl);
        redirectUrl.searchParams.set('verified', '1');
        redirectUrl.searchParams.set('onboardingToken', onboardingToken);
        redirectUrl.searchParams.set('afterContinue', 'home');

        return redirectUrl.toString();
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) throw new UnauthorizedException('Email or password is incorrect');

        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid) throw new UnauthorizedException('Email or password is incorrect');

        if (!user.emailVerified) throw new UnauthorizedException('Account email has not been verified');

        const snapshot = await this.getUserSnapshot(user.id);
        if (!snapshot) throw new UnauthorizedException('Could not load user state');

        return this.tokenService.buildAuthResponse(snapshot);
    }

    async refreshTokens(userId: string, email: string) {
        const snapshot = await this.getUserSnapshot(userId);
        if (!snapshot) return this.tokenService.issueTokens(userId, email);
        return this.tokenService.buildAuthResponse(snapshot);
    }

    async completeOnboarding(onboardingToken: string, name: string, avatarFile?: Express.Multer.File) {
        const payload = this.tokenService.verifyOnboardingToken(onboardingToken);
        const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });

        if (!user) throw new BadRequestException('Verification link is invalid');
        if (!user.emailVerified) throw new BadRequestException('Account email has not been verified');

        let avatarUrl: string | undefined;
        if (avatarFile) {
            const result = await this.storageService.uploadBuffer(avatarFile.buffer, 'avatars');
            avatarUrl = result.secure_url;
        }

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                ...(name ? { name } : {}),
                ...(avatarUrl ? { avatarUrl } : {}),
            },
        });

        await this.prisma.$executeRaw`
            UPDATE "User"
            SET "onboardingCompleted" = true, "updatedAt" = NOW()
            WHERE "id" = ${user.id}
        `;

        const snapshot = await this.getUserSnapshot(user.id);
        if (!snapshot) throw new BadRequestException('Unable to complete onboarding');

        return this.tokenService.buildAuthResponse(snapshot);
    }
}
