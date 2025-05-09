import { PrismaClient, EventStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Sample test events
    const testEvents = [
        {
            title: 'Sunday Service',
            description: 'Weekly Sunday worship service for the community.',
            pictureUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
            address: 'Main Church Hall, 123 Faith Street',
            latitude: 40.7128,
            longitude: -74.0060,
            startTime: new Date(Date.now() + 86400000), // Tomorrow
            endTime: new Date(Date.now() + 86400000 + 7200000), // Tomorrow + 2 hours
            status: EventStatus.published,
            maxParticipants: 150,
            currentParticipants: 87,
        },
        {
            title: 'Youth Group Meeting',
            description: 'Weekly gathering for young people aged 13-18.',
            pictureUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac',
            address: 'Youth Center, 456 Community Avenue',
            latitude: 40.7120,
            longitude: -74.0050,
            startTime: new Date(Date.now() + 172800000), // Day after tomorrow
            endTime: new Date(Date.now() + 172800000 + 5400000), // Day after tomorrow + 1.5 hours
            status: EventStatus.published,
            maxParticipants: 50,
            currentParticipants: 32,
        },
        {
            title: 'Bible Study',
            description: 'Deep dive into scripture with Pastor John.',
            pictureUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5dc49537',
            address: 'Meeting Room 3, 789 Faith Street',
            latitude: 40.7135,
            longitude: -74.0070,
            startTime: new Date(Date.now() + 259200000), // 3 days from now
            endTime: new Date(Date.now() + 259200000 + 3600000), // 3 days from now + 1 hour
            status: EventStatus.published,
            maxParticipants: 30,
            currentParticipants: 30,
        }
    ];

    // Check for existing events
    const existingEventsCount = await prisma.event.count();
    if (existingEventsCount > 0) {
        console.log(`${existingEventsCount} events already exist in the database.`);
        console.log('Skipping event creation...');
        return;
    }

    // Create admin user if not exists (for event creation)
    let adminUser = await prisma.user.findFirst({
        where: { role: 'admin' }
    });

    if (!adminUser) {
        console.log('Creating admin user for event creation...');
        adminUser = await prisma.user.create({
            data: {
                email: 'admin@laciteconnect.org',
                passwordHash: 'mock-password-hash',
                passwordSalt: 'mock-salt',
                firstName: 'Admin',
                lastName: 'User',
                fullName: 'Admin User',
                role: 'admin',
            }
        });
        console.log('Admin user created');
    }

    // Create events
    console.log('Creating test events...');
    for (const eventData of testEvents) {
        const event = await prisma.event.create({
            data: {
                ...eventData,
                createdBy: adminUser.id,
            }
        });
        console.log(`Created event: ${event.title} (ID: ${event.id})`);
    }

    console.log('\nTest events created successfully!');
    console.log('You can now use these events in the mobile app.');
}

main()
    .catch((e) => {
        console.error('Error creating test events:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });