import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { Role } from '../src/auth/roles';
import * as bcrypt from 'bcrypt';

async function bootstrapAdmin() {
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL || process.argv[2];
  const rawPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD || process.argv[3];

  if (!email || !rawPassword) {
    console.error(`
❌ Error: Missing required administrative bootstrap parameters.
Usage:
  ADMIN_BOOTSTRAP_EMAIL=admin@auramart.com ADMIN_BOOTSTRAP_PASSWORD=SecurePassword123! npx ts-node scripts/bootstrap-admin.ts
  OR
  npx ts-node scripts/bootstrap-admin.ts admin@auramart.com SecurePassword123!
    `);
    process.exit(1);
  }

  if (rawPassword.length < 12) {
    console.error('❌ Error: Administrative password must be at least 12 characters long.');
    process.exit(1);
  }

  console.log(`🔐 Initializing AuraMart Administrative Bootstrap for: ${email}...`);

  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    const existing = await usersService.findOneByEmail(email);
    if (existing) {
      console.log(`⚠️ User with email ${email} already exists. Upgrading role to SUPER_ADMIN...`);
      existing.role = Role.SUPER_ADMIN;
      existing.passwordHash = await bcrypt.hash(rawPassword, 12);
      await usersService.create(existing);
      console.log(`✅ Successfully updated ${email} to SUPER_ADMIN.`);
    } else {
      const passwordHash = await bcrypt.hash(rawPassword, 12);
      await usersService.create({
        email,
        passwordHash,
        role: Role.SUPER_ADMIN,
        fullName: 'Platform Super Admin',
      });
      console.log(`✅ Successfully created initial SUPER_ADMIN account for ${email}.`);
    }
  } catch (err: any) {
    console.error(`❌ Failed to bootstrap SUPER_ADMIN user:`, err.message);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrapAdmin();
