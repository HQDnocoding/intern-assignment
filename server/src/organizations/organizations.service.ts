import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrganizationDto } from './dto/create-organization.dto.js';

type OrganizationRow = {
    id: string;
    name: string;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
};

@Injectable()
export class OrganizationsService {
    constructor(private prisma: PrismaService) { }

    async listForUser(userId: string) {
        const organizations = await this.prisma.$queryRaw<OrganizationRow[]>`
            SELECT "id", "name", "ownerId", "createdAt", "updatedAt"
            FROM "Organization"
            WHERE "ownerId" = ${userId}
            ORDER BY "createdAt" ASC
        `;

        return organizations.map((organization) => ({
            id: organization.id,
            name: organization.name,
            memberCount: 1,
            createdAt: organization.createdAt,
            updatedAt: organization.updatedAt,
        }));
    }

    async create(userId: string, dto: CreateOrganizationDto) {
        const name = dto.name.trim();
        if (!name) {
            throw new ConflictException('Organization name is invalid');
        }

        const existing = await this.prisma.$queryRaw<OrganizationRow[]>`
            SELECT "id", "name", "ownerId", "createdAt", "updatedAt"
            FROM "Organization"
            WHERE "ownerId" = ${userId} AND "name" = ${name}
            LIMIT 1
        `;

        if (existing.length > 0) {
            throw new ConflictException('Organization name already exists');
        }

        const organizationId = randomUUID();
        const [organization] = await this.prisma.$queryRaw<OrganizationRow[]>`
            INSERT INTO "Organization" ("id", "name", "ownerId", "updatedAt")
            VALUES (${organizationId}, ${name}, ${userId}, NOW())
            RETURNING "id", "name", "ownerId", "createdAt", "updatedAt"
        `;

        return {
            id: organization.id,
            name: organization.name,
            memberCount: 1,
            createdAt: organization.createdAt,
            updatedAt: organization.updatedAt,
        };
    }

    async getById(userId: string, organizationId: string) {
        const organization = await this.getOwnedOrganization(userId, organizationId);

        return {
            id: organization.id,
            name: organization.name,
            memberCount: 1,
            createdAt: organization.createdAt,
            updatedAt: organization.updatedAt,
        };
    }

    async getDashboard(userId: string, organizationId: string) {
        const organization = await this.getById(userId, organizationId);

        return {
            organization,
            metrics: [
                { label: 'Emails Sent', value: '6k', change: '+18%' },
                { label: 'Delivery Rate', value: '99.4%', change: '+2.3%' },
                { label: 'Subscribers', value: '9k', change: '+12%' },
                { label: 'Bounce Rate', value: '1.8%', change: '-0.8%' },
            ],
            timeseries: [
                { label: 'Oct 2', sent: 28, delivered: 16, marketing: 18, transactional: 10 },
                { label: 'Oct 5', sent: 35, delivered: 20, marketing: 23, transactional: 13 },
                { label: 'Oct 8', sent: 31, delivered: 17, marketing: 20, transactional: 11 },
                { label: 'Oct 11', sent: 44, delivered: 25, marketing: 28, transactional: 15 },
                { label: 'Oct 14', sent: 36, delivered: 21, marketing: 24, transactional: 13 },
                { label: 'Oct 17', sent: 49, delivered: 28, marketing: 32, transactional: 18 },
                { label: 'Oct 20', sent: 40, delivered: 23, marketing: 26, transactional: 14 },
                { label: 'Oct 23', sent: 53, delivered: 31, marketing: 35, transactional: 19 },
                { label: 'Oct 26', sent: 41, delivered: 22, marketing: 27, transactional: 15 },
                { label: 'Oct 29', sent: 57, delivered: 33, marketing: 37, transactional: 20 },
                { label: 'Nov 1', sent: 46, delivered: 26, marketing: 30, transactional: 17 },
                { label: 'Nov 4', sent: 60, delivered: 35, marketing: 39, transactional: 22 },
                { label: 'Nov 7', sent: 50, delivered: 29, marketing: 33, transactional: 18 },
                { label: 'Nov 10', sent: 64, delivered: 38, marketing: 42, transactional: 24 },
                { label: 'Nov 13', sent: 48, delivered: 27, marketing: 31, transactional: 17 },
                { label: 'Nov 16', sent: 67, delivered: 39, marketing: 44, transactional: 25 },
                { label: 'Nov 19', sent: 52, delivered: 30, marketing: 35, transactional: 19 },
                { label: 'Nov 22', sent: 61, delivered: 36, marketing: 40, transactional: 22 },
                { label: 'Nov 25', sent: 56, delivered: 32, marketing: 37, transactional: 21 },
                { label: 'Nov 28', sent: 65, delivered: 37, marketing: 43, transactional: 24 },
                { label: 'Dec 1', sent: 58, delivered: 34, marketing: 38, transactional: 21 },
                { label: 'Dec 4', sent: 69, delivered: 41, marketing: 46, transactional: 26 },
                { label: 'Dec 7', sent: 55, delivered: 31, marketing: 36, transactional: 20 },
                { label: 'Dec 10', sent: 66, delivered: 38, marketing: 43, transactional: 24 },
                { label: 'Dec 13', sent: 62, delivered: 36, marketing: 41, transactional: 23 },
            ],
            performance: {
                openRate: '35.7%',
                clickRate: '3.4%',
            },
        };
    }

    private async getOwnedOrganization(userId: string, organizationId: string) {
        const [organization] = await this.prisma.$queryRaw<OrganizationRow[]>`
            SELECT "id", "name", "ownerId", "createdAt", "updatedAt"
            FROM "Organization"
            WHERE "id" = ${organizationId} AND "ownerId" = ${userId}
            LIMIT 1
        `;

        if (!organization) {
            throw new NotFoundException('Organization not found');
        }

        return organization;
    }
}
