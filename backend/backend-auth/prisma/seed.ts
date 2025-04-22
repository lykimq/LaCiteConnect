import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env_admin
const envPath = path.resolve(process.cwd(), '.env_admin');
dotenv.config({ path: envPath });

const prisma = new PrismaClient();

/**
 * Validates email format
 * @param email Email to validate
 * @returns true if email is valid
 */
function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates password strength
 * @param password Password to validate
 * @returns true if password meets requirements
 */
function validatePassword(password: string): boolean {
    // Minimum 8 characters, at least one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    // Debug logging
    console.log('Password validation details:', {
        password: password.replace(/./g, '*'), // Hide actual password
        length: password.length,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        meetsLength: password.length >= 8,
        regexTest: passwordRegex.test(password)
    });

    return passwordRegex.test(password);
}

async function main() {
    console.log('Environment variables:', {
        ADMIN_EMAIL_DEV: process.env.ADMIN_EMAIL_DEV,
        ADMIN_FIRST_NAME_DEV: process.env.ADMIN_FIRST_NAME_DEV,
        ADMIN_LAST_NAME_DEV: process.env.ADMIN_LAST_NAME_DEV,
        // Don't log passwords in production
        HAS_ADMIN_PASSWORD_DEV: !!process.env.ADMIN_PASSWORD_DEV,
        HAS_ADMIN_SECRET_DEV: !!process.env.ADMIN_SECRET_DEV
    });

    // Get environment variables
    const adminEmail = process.env.ADMIN_EMAIL_DEV;
    const adminPassword = process.env.ADMIN_PASSWORD_DEV;
    const adminSecret = process.env.ADMIN_SECRET_DEV;
    const adminFirstName = process.env.ADMIN_FIRST_NAME_DEV;
    const adminLastName = process.env.ADMIN_LAST_NAME_DEV;

    // Validate environment variables
    if (!adminEmail || !adminPassword || !adminSecret || !adminFirstName || !adminLastName) {
        console.error('Missing environment variables:', {
            hasEmail: !!adminEmail,
            hasPassword: !!adminPassword,
            hasSecret: !!adminSecret,
            hasFirstName: !!adminFirstName,
            hasLastName: !!adminLastName
        });
        throw new Error('Missing required environment variables. Check .env_admin file.');
    }

    if (!validateEmail(adminEmail)) {
        throw new Error('Invalid admin email format');
    }

    if (!validatePassword(adminPassword)) {
        throw new Error('Password does not meet security requirements. Must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long.');
    }

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (existingAdmin) {
        console.log('Admin user already exists');
        return;
    }

    // Generate salts and hash passwords
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, passwordSalt);

    const adminSecretSalt = await bcrypt.genSalt(10);
    const adminSecretHash = await bcrypt.hash(adminSecret, adminSecretSalt);

    // Create admin user
    const admin = await prisma.user.create({
        data: {
            email: adminEmail,
            passwordHash,
            passwordSalt,
            adminSecretHash,
            adminSecretSalt,
            firstName: adminFirstName,
            lastName: adminLastName,
            fullName: `${adminFirstName} ${adminLastName}`,
            role: 'admin',
            sessionType: 'persistent',
            biometricEnabled: false,
        },
    });

    console.log('Admin user created successfully');
    console.log('Email:', admin.email);
    console.log('First Name:', admin.firstName);
    console.log('Last Name:', admin.lastName);
    console.log('Role:', admin.role);
}

main()
    .catch((e) => {
        console.error('Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });