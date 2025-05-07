const { join } = require('path');
const { readFileSync } = require('fs');

// Function to read and combine schema files
function combineSchemas() {
    const mainSchema = readFileSync(join(__dirname, 'schema.prisma'), 'utf-8');
    const usersSchema = readFileSync(join(__dirname, 'schemas', 'users.prisma'), 'utf-8');
    const eventsSchema = readFileSync(join(__dirname, 'schemas', 'events.prisma'), 'utf-8');

    // Remove import statements from main schema
    const cleanMainSchema = mainSchema.replace(/import\s+".*";/g, '');

    // Combine all schemas
    return `${cleanMainSchema}\n\n${usersSchema}\n\n${eventsSchema}`;
}

module.exports = {
    combineSchemas,
};