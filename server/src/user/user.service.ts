import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { STORAGE_SERVICE } from '../common/interfaces/storage.interface.js';
import type { IStorageService } from '../common/interfaces/storage.interface.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

type UserRow = {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
    emailVerified: boolean;
    onboardingCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
};

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        @Inject(STORAGE_SERVICE) private storage: IStorageService,
    ) { }

    async getMe(userId: string) {
        const [user] = await this.prisma.$queryRaw<UserRow[]>`
            SELECT "id", "name", "email", "avatarUrl", "emailVerified", "onboardingCompleted", "createdAt", "updatedAt"
            FROM "User"
            WHERE "id" = ${userId}
            LIMIT 1
        `;

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async updateProfile(
        userId: string,
        dto: UpdateProfileDto,
        avatarFile?: Express.Multer.File,
    ) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        let avatarUrl: string | undefined;
        if (avatarFile) {
            const result = await this.storage.uploadBuffer(avatarFile.buffer, 'avatars');
            avatarUrl = result.secure_url;
        }

        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(dto.name && { name: dto.name }),
                ...(avatarUrl && { avatarUrl }),
            },
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                emailVerified: true,
            },
        });

        await this.prisma.$executeRaw`
            UPDATE "User"
            SET "onboardingCompleted" = true, "updatedAt" = NOW()
            WHERE "id" = ${userId}
        `;

        return updated;
    }
}
