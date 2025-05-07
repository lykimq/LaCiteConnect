const { execSync } = require('child_process');
const { writeFileSync, unlinkSync } = require('fs');
const { join } = require('path');
const { combineSchemas } = require('../prisma.config');

// Create temporary schema file
const tempSchemaPath = join(__dirname, '..', 'prisma', 'temp_schema.prisma');
const combinedSchema = combineSchemas();

try {
    console.log('🔄 Starting database migration...');

    // Write combined schema to temporary file
    writeFileSync(tempSchemaPath, combinedSchema);
    console.log('✅ Combined schema files successfully');

    // Execute Prisma migrate command
    console.log('🔄 Running Prisma migrations...');
    execSync(`npx prisma migrate dev --schema=${tempSchemaPath}`, {
        stdio: 'inherit',
        env: {
            ...process.env,
            PRISMA_CLIENT_ENGINE_TYPE: 'dataproxy'
        }
    });

    console.log('✅ Database migration completed successfully');
} catch (error) {
    console.error('❌ Error during database migration:', error);
    process.exit(1);
} finally {
    // Clean up temporary schema file
    try {
        unlinkSync(tempSchemaPath);
        console.log('✅ Cleaned up temporary files');
    } catch (error) {
        console.warn('⚠️ Warning: Could not delete temporary schema file:', error);
    }
}