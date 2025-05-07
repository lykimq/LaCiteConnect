const { execSync } = require('child_process');
const { writeFileSync, unlinkSync } = require('fs');
const { join } = require('path');
const { combineSchemas } = require('../prisma.config');

// Get command from arguments
const command = process.argv.slice(2).join(' ');

// Create temporary schema file
const tempSchemaPath = join(__dirname, '..', 'prisma', 'temp_schema.prisma');
const combinedSchema = combineSchemas();

try {
    // Write combined schema to temporary file
    writeFileSync(tempSchemaPath, combinedSchema);

    // Execute Prisma command with temporary schema
    execSync(`npx prisma ${command} --schema=${tempSchemaPath}`, { stdio: 'inherit' });
} catch (error) {
    console.error('Error executing Prisma command:', error);
    process.exit(1);
} finally {
    // Clean up temporary schema file
    try {
        unlinkSync(tempSchemaPath);
    } catch (error) {
        console.warn('Warning: Could not delete temporary schema file:', error);
    }
}