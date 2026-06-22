import { jest, describe, it, expect, beforeAll, beforeEach } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { TokenService } from '../token.service.js';
import { MAIL_SERVICE } from '../../common/interfaces/mail.interface.js';
import { STORAGE_SERVICE } from '../../common/interfaces/storage.interface.js';

let hashedPassword: string;

beforeAll(async () => {
    hashedPassword = await bcrypt.hash('correct-pass', 1);
});

const mockSnapshot = {
    id: 'user-id',
    email: 'user@test.com',
    name: 'Test User',
    avatarUrl: null,
    emailVerified: true,
    onboardingCompleted: false,
};

const mockAuthResponse = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    user: mockSnapshot,
    nextStep: 'setup',
};

describe('AuthService', () => {
    let service: AuthService;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let prisma: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let tokenService: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mailService: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let storageService: any;

    beforeEach(async () => {
        prisma = {
            user: {
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
            },
            emailVerificationToken: {
                create: jest.fn(),
                findFirst: jest.fn(),
            },
            $queryRaw: jest.fn(),
            $executeRaw: jest.fn(),
        };

        tokenService = {
            issueTokens: jest.fn().mockReturnValue({ accessToken: 'access-token', refreshToken: 'refresh-token' }),
            issueOnboardingToken: jest.fn().mockReturnValue('onboarding-token'),
            verifyOnboardingToken: jest.fn().mockReturnValue({ sub: 'user-id', email: 'user@test.com' }),
            buildAuthResponse: jest.fn().mockReturnValue(mockAuthResponse),
        };

        mailService = { sendVerificationEmail: jest.fn() };
        storageService = { uploadBuffer: jest.fn() };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: PrismaService, useValue: prisma },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue('http://localhost:3000'),
                        getOrThrow: jest.fn().mockReturnValue('http://localhost:5173'),
                    },
                },
                { provide: TokenService, useValue: tokenService },
                { provide: MAIL_SERVICE, useValue: mailService },
                { provide: STORAGE_SERVICE, useValue: storageService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    describe('signUp', () => {
        it('throws ConflictException if email already exists', async () => {
            prisma.user.findUnique.mockResolvedValue({ id: 'user-id', email: 'user@test.com' });

            await expect(
                service.signUp({ email: 'user@test.com', password: 'pass123', name: 'Test' }),
            ).rejects.toThrow(ConflictException);
        });

        it('creates user and sends verification email for new email', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            prisma.user.create.mockResolvedValue({ id: 'user-id', email: 'new@test.com' });
            prisma.emailVerificationToken.create.mockResolvedValue({});

            const result = await service.signUp({ email: 'new@test.com', password: 'pass123', name: 'New' });

            expect(prisma.user.create).toHaveBeenCalledTimes(1);
            expect(mailService.sendVerificationEmail).toHaveBeenCalledWith('new@test.com', 'New', expect.any(String));
            expect(result).toEqual({ message: expect.any(String) });
        });
    });

    describe('login', () => {
        it('throws UnauthorizedException if user not found', async () => {
            prisma.user.findUnique.mockResolvedValue(null);

            await expect(
                service.login({ email: 'nobody@test.com', password: 'pass' }),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('throws UnauthorizedException if password is wrong', async () => {
            prisma.user.findUnique.mockResolvedValue({
                id: 'user-id',
                email: 'user@test.com',
                passwordHash: hashedPassword,
                emailVerified: true,
            });

            await expect(
                service.login({ email: 'user@test.com', password: 'wrong-pass' }),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('throws UnauthorizedException if email is not verified', async () => {
            prisma.user.findUnique.mockResolvedValue({
                id: 'user-id',
                email: 'user@test.com',
                passwordHash: hashedPassword,
                emailVerified: false,
            });

            await expect(
                service.login({ email: 'user@test.com', password: 'correct-pass' }),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('returns auth response on successful login', async () => {
            prisma.user.findUnique.mockResolvedValue({
                id: 'user-id',
                email: 'user@test.com',
                passwordHash: hashedPassword,
                emailVerified: true,
            });
            prisma.$queryRaw.mockResolvedValue([mockSnapshot]);

            const result = await service.login({ email: 'user@test.com', password: 'correct-pass' });

            expect(tokenService.buildAuthResponse).toHaveBeenCalledWith(mockSnapshot);
            expect(result).toEqual(mockAuthResponse);
        });
    });

    describe('verifyEmail', () => {
        it('throws BadRequestException if token not found', async () => {
            prisma.emailVerificationToken.findFirst.mockResolvedValue(null);

            await expect(service.verifyEmail('invalid-token')).rejects.toThrow(BadRequestException);
        });

        it('marks email as verified and returns user info', async () => {
            prisma.emailVerificationToken.findFirst.mockResolvedValue({
                email: 'user@test.com',
                token: 'valid-token',
            });
            prisma.user.update.mockResolvedValue({ id: 'user-id', email: 'user@test.com' });

            const result = await service.verifyEmail('valid-token');

            expect(prisma.user.update).toHaveBeenCalledWith(
                expect.objectContaining({ data: { emailVerified: true } }),
            );
            expect(result).toMatchObject({ message: 'Email verified', email: 'user@test.com' });
        });
    });

    describe('refreshTokens', () => {
        it('issues tokens directly when user snapshot is not found', async () => {
            prisma.$queryRaw.mockResolvedValue([]);

            await service.refreshTokens('user-id', 'user@test.com');

            expect(tokenService.issueTokens).toHaveBeenCalledWith('user-id', 'user@test.com');
            expect(tokenService.buildAuthResponse).not.toHaveBeenCalled();
        });

        it('returns full auth response when snapshot exists', async () => {
            prisma.$queryRaw.mockResolvedValue([mockSnapshot]);

            const result = await service.refreshTokens('user-id', 'user@test.com');

            expect(tokenService.buildAuthResponse).toHaveBeenCalledWith(mockSnapshot);
            expect(result).toEqual(mockAuthResponse);
        });
    });

    describe('completeOnboarding', () => {
        const verifiedUser = {
            id: 'user-id',
            email: 'user@test.com',
            name: 'Test User',
            emailVerified: true,
            onboardingCompleted: false,
            avatarUrl: null,
        };

        it('throws when onboarding token is invalid', async () => {
            (tokenService.verifyOnboardingToken as jest.Mock).mockImplementation(() => {
                throw new Error('jwt malformed');
            });

            await expect(service.completeOnboarding('bad-token', 'Name')).rejects.toThrow();
        });

        it('throws BadRequestException if user not found', async () => {
            prisma.user.findUnique.mockResolvedValue(null);

            await expect(service.completeOnboarding('valid-token', 'Name')).rejects.toThrow(BadRequestException);
        });

        it('throws BadRequestException if email not verified', async () => {
            prisma.user.findUnique.mockResolvedValue({ ...verifiedUser, emailVerified: false });

            await expect(service.completeOnboarding('valid-token', 'Name')).rejects.toThrow(BadRequestException);
        });

        it('completes onboarding without uploading avatar', async () => {
            prisma.user.findUnique.mockResolvedValue(verifiedUser);
            prisma.user.update.mockResolvedValue(verifiedUser);
            prisma.$executeRaw.mockResolvedValue(1);
            prisma.$queryRaw.mockResolvedValue([mockSnapshot]);

            const result = await service.completeOnboarding('valid-token', 'New Name');

            expect(storageService.uploadBuffer).not.toHaveBeenCalled();
            expect(tokenService.buildAuthResponse).toHaveBeenCalledWith(mockSnapshot);
            expect(result).toEqual(mockAuthResponse);
        });

        it('uploads avatar when file is provided', async () => {
            prisma.user.findUnique.mockResolvedValue(verifiedUser);
            prisma.user.update.mockResolvedValue(verifiedUser);
            prisma.$executeRaw.mockResolvedValue(1);
            prisma.$queryRaw.mockResolvedValue([mockSnapshot]);
            storageService.uploadBuffer.mockResolvedValue({ secure_url: 'https://cdn.example.com/avatar.jpg' });

            const mockFile = { buffer: Buffer.from('image-data') } as Express.Multer.File;
            await service.completeOnboarding('valid-token', 'New Name', mockFile);

            expect(storageService.uploadBuffer).toHaveBeenCalledWith(mockFile.buffer, 'avatars');
        });
    });
});
