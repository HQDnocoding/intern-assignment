import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const seedUser = {
    name: 'Demo User',
    email: 'demo@acme.test',
    avatarUrl: null,
    emailVerified: true,
    onboardingCompleted: true,
};

const seedOrganizations = ['pp', 'pppp', '2222', '3133'];

async function main() {
    const passwordHash = await bcrypt.hash('password123', 10);

    const user = await prisma.user.upsert({
        where: { email: seedUser.email },
        update: {
            name: seedUser.name,
            avatarUrl: seedUser.avatarUrl,
            emailVerified: seedUser.emailVerified,
            onboardingCompleted: seedUser.onboardingCompleted,
            passwordHash,
        },
        create: {
            ...seedUser,
            passwordHash,
        },
    });

    for (const name of seedOrganizations) {
        await prisma.organization.upsert({
            where: {
                ownerId_name: {
                    ownerId: user.id,
                    name,
                },
            },
            update: {},
            create: {
                name,
                ownerId: user.id,
            },
        });
    }

    console.log('Seed completed successfully.');
}

main()
    .catch((error) => {
        console.error('Seed failed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
