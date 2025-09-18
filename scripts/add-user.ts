import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function addUser(email: string, password_raw: string, role: UserRole) {
  try {
    const password = await hash(password_raw, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password,
        name: email.split("@")[0], // Simple name generation
        role,
      },
    });
    console.log(`User ${user.email} with role ${user.role} added successfully.`);
  } catch (error) {
    console.error("Error adding user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

const args = process.argv.slice(2);

if (args.length !== 3) {
  console.log("Usage: npx tsx scripts/add-user.ts <email> <password> <role>");
  console.log("Available roles: ADMIN, HR, PAYROLL, MANAGER, EMPLOYEE");
  process.exit(1);
}

const email = args[0];
const password = args[1];
const role = args[2].toUpperCase() as UserRole;

if (!Object.values(UserRole).includes(role)) {
  console.log(`Invalid role: ${role}. Available roles: ADMIN, HR, PAYROLL, MANAGER, EMPLOYEE`);
  process.exit(1);
}

addUser(email, password, role);


