import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

export type AuthUserSnapshot = {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    emailVerified: boolean;
    onboardingCompleted: boolean;
};

@Injectable()
export class TokenService {
    constructor(
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
    ) { }

    issueTokens(userId: string, email: string) {
        const payload = { sub: userId, email };

        const accessToken = this.jwt.sign(payload, {
            secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
            expiresIn: this.config.getOrThrow<string>('JWT_ACCESS_EXPIRES_IN') as JwtSignOptions['expiresIn'],
        });

        const refreshToken = this.jwt.sign(payload, {
            secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.config.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN') as JwtSignOptions['expiresIn'],
        });

        return { accessToken, refreshToken };
    }

    issueOnboardingToken(userId: string, email: string): string {
        return this.jwt.sign(
            { sub: userId, email },
            {
                secret: this.config.getOrThrow<string>('ONBOARDING_SECRET'),
                expiresIn: this.config.getOrThrow<string>('ONBOARDING_EXPIRES_IN') as JwtSignOptions['expiresIn'],
            },
        );
    }

    verifyOnboardingToken(token: string): { sub: string; email: string } {
        return this.jwt.verify<{ sub: string; email: string }>(token, {
            secret: this.config.getOrThrow<string>('ONBOARDING_SECRET'),
        });
    }

    buildAuthResponse(user: AuthUserSnapshot) {
        const tokens = this.issueTokens(user.id, user.email);
        return {
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatarUrl: user.avatarUrl,
                emailVerified: user.emailVerified,
                onboardingCompleted: user.onboardingCompleted,
            },
            nextStep: user.onboardingCompleted ? 'home' : 'setup',
        };
    }
}
