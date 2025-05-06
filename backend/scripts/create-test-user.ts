import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const testUser = {
        email: 'test@example.com',
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User'
    };

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: testUser.email },
    });

    if (existingUser) {
        console.log('Test user already exists');
        return;
    }

    // Generate salt and hash password
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(testUser.password, passwordSalt);

    // Create test user
    const user = await prisma.user.create({
        data: {
            email: testUser.email,
            passwordHash,
            passwordSalt,
            firstName: testUser.firstName,
            lastName: testUser.lastName,
            fullName: `${testUser.firstName} ${testUser.lastName}`,
            role: 'user',
            sessionType: 'session',
            biometricEnabled: false,
        },
    });

    console.log('Test user created successfully');
    console.log('Email:', user.email);
    console.log('Password:', testUser.password);
    console.log('First Name:', user.firstName);
    console.log('Last Name:', user.lastName);
    console.log('Role:', user.role);
}

main()
    .catch((e) => {
        console.error('Error creating test user:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });