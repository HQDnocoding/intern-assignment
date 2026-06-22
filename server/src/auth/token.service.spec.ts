import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token.service.js';

const mockUser = {
    id: 'user-id',
    email: 'user@test.com',
    name: 'Test User',
    avatarUrl: null,
    emailVerified: true,
    onboardingCompleted: true,
};

describe('TokenService', () => {
    let service: TokenService;
    let jwt: jest.Mocked<JwtService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TokenService,
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('signed-token'),
                        verify: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        getOrThrow: jest.fn().mockReturnValue('mock-secret'),
                    },
                },
            ],
        }).compile();

        service = module.get<TokenService>(TokenService);
        jwt = module.get(JwtService);
    });

    describe('issueTokens', () => {
        it('calls jwt.sign twice with the correct payload', () => {
            service.issueTokens('user-id', 'user@test.com');

            expect(jwt.sign).toHaveBeenCalledTimes(2);
            expect(jwt.sign).toHaveBeenCalledWith(
                { sub: 'user-id', email: 'user@test.com' },
                expect.any(Object),
            );
        });

        it('returns an object with accessToken and refreshToken', () => {
            const result = service.issueTokens('user-id', 'user@test.com');

            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('refreshToken');
        });
    });

    describe('verifyOnboardingToken', () => {
        it('returns the decoded payload for a valid token', () => {
            const payload = { sub: 'user-id', email: 'user@test.com' };
            (jwt.verify as jest.Mock).mockReturnValue(payload);

            const result = service.verifyOnboardingToken('valid-token');

            expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.any(Object));
            expect(result).toEqual(payload);
        });

        it('throws when the token is invalid', () => {
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error('jwt malformed');
            });

            expect(() => service.verifyOnboardingToken('bad-token')).toThrow('jwt malformed');
        });

        it('throws when the token is expired', () => {
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error('jwt expired');
            });

            expect(() => service.verifyOnboardingToken('expired-token')).toThrow('jwt expired');
        });
    });
});
