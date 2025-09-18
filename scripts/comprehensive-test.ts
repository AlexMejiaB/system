import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

interface TestResult {
  test: string;
  status: "PASS" | "FAIL";
  message: string;
}

const results: TestResult[] = [];

function logResult(test: string, status: "PASS" | "FAIL", message: string) {
  results.push({ test, status, message });
  console.log(`${status === "PASS" ? "✅" : "❌"} ${test}: ${message}`);
}

async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    logResult("Database Connection", "PASS", "Successfully connected to database");
  } catch (error) {
    logResult("Database Connection", "FAIL", `Failed to connect: ${error}`);
  }
}

async function testUserCRUD() {
  try {
    // Create user
    const hashedPassword = await hash("testpassword", 10);
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: hashedPassword,
        name: "Test User",
        role: "EMPLOYEE",
      },
    });
    logResult("User Creation", "PASS", `Created user with ID: ${user.id}`);

    // Read user
    const foundUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    if (foundUser) {
      logResult("User Read", "PASS", `Found user: ${foundUser.email}`);
    } else {
      logResult("User Read", "FAIL", "User not found");
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name: "Updated Test User" },
    });
    logResult("User Update", "PASS", `Updated user name to: ${updatedUser.name}`);

    // Delete user
    await prisma.user.delete({
      where: { id: user.id },
    });
    logResult("User Delete", "PASS", "Successfully deleted test user");
  } catch (error) {
    logResult("User CRUD", "FAIL", `Error: ${error}`);
  }
}

async function testEmployeeCRUD() {
  try {
    // Create employee
    const employee = await prisma.employee.create({
      data: {
        name: "Test Employee",
        email: "employee@test.com",
        position: "Developer",
        department: "IT",
        salary: 50000,
        hireDate: new Date(),
      },
    });
    logResult("Employee Creation", "PASS", `Created employee with ID: ${employee.id}`);

    // Read employee
    const foundEmployee = await prisma.employee.findUnique({
      where: { id: employee.id },
    });
    if (foundEmployee) {
      logResult("Employee Read", "PASS", `Found employee: ${foundEmployee.name}`);
    } else {
      logResult("Employee Read", "FAIL", "Employee not found");
    }

    // Update employee
    const updatedEmployee = await prisma.employee.update({
      where: { id: employee.id },
      data: { salary: 55000 },
    });
    logResult("Employee Update", "PASS", `Updated salary to: ${updatedEmployee.salary}`);

    // Delete employee
    await prisma.employee.delete({
      where: { id: employee.id },
    });
    logResult("Employee Delete", "PASS", "Successfully deleted test employee");
  } catch (error) {
    logResult("Employee CRUD", "FAIL", `Error: ${error}`);
  }
}

async function testApplicantCRUD() {
  try {
    // Create applicant
    const applicant = await prisma.applicant.create({
      data: {
        name: "Test Applicant",
        email: "applicant@test.com",
        phone: "123-456-7890",
        position: "Developer",
        status: "PENDING",
        resumeUrl: "https://example.com/resume.pdf",
      },
    });
    logResult("Applicant Creation", "PASS", `Created applicant with ID: ${applicant.id}`);

    // Read applicant
    const foundApplicant = await prisma.applicant.findUnique({
      where: { id: applicant.id },
    });
    if (foundApplicant) {
      logResult("Applicant Read", "PASS", `Found applicant: ${foundApplicant.name}`);
    } else {
      logResult("Applicant Read", "FAIL", "Applicant not found");
    }

    // Update applicant
    const updatedApplicant = await prisma.applicant.update({
      where: { id: applicant.id },
      data: { status: "INTERVIEWED" },
    });
    logResult("Applicant Update", "PASS", `Updated status to: ${updatedApplicant.status}`);

    // Delete applicant
    await prisma.applicant.delete({
      where: { id: applicant.id },
    });
    logResult("Applicant Delete", "PASS", "Successfully deleted test applicant");
  } catch (error) {
    logResult("Applicant CRUD", "FAIL", `Error: ${error}`);
  }
}

async function testIncidentCRUD() {
  try {
    // Create incident
    const incident = await prisma.incident.create({
      data: {
        title: "Test Incident",
        description: "This is a test incident",
        type: "SAFETY",
        severity: "MEDIUM",
        status: "OPEN",
        reportedBy: "Test Reporter",
        location: "Office",
      },
    });
    logResult("Incident Creation", "PASS", `Created incident with ID: ${incident.id}`);

    // Read incident
    const foundIncident = await prisma.incident.findUnique({
      where: { id: incident.id },
    });
    if (foundIncident) {
      logResult("Incident Read", "PASS", `Found incident: ${foundIncident.title}`);
    } else {
      logResult("Incident Read", "FAIL", "Incident not found");
    }

    // Update incident
    const updatedIncident = await prisma.incident.update({
      where: { id: incident.id },
      data: { status: "RESOLVED" },
    });
    logResult("Incident Update", "PASS", `Updated status to: ${updatedIncident.status}`);

    // Delete incident
    await prisma.incident.delete({
      where: { id: incident.id },
    });
    logResult("Incident Delete", "PASS", "Successfully deleted test incident");
  } catch (error) {
    logResult("Incident CRUD", "FAIL", `Error: ${error}`);
  }
}

async function testOnboardingCRUD() {
  try {
    // Create onboarding task
    const onboardingTask = await prisma.onboardingTask.create({
      data: {
        title: "Test Onboarding Task",
        description: "Complete orientation",
        assignedTo: "test@example.com",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: "PENDING",
        priority: "MEDIUM",
      },
    });
    logResult("Onboarding Task Creation", "PASS", `Created task with ID: ${onboardingTask.id}`);

    // Read onboarding task
    const foundTask = await prisma.onboardingTask.findUnique({
      where: { id: onboardingTask.id },
    });
    if (foundTask) {
      logResult("Onboarding Task Read", "PASS", `Found task: ${foundTask.title}`);
    } else {
      logResult("Onboarding Task Read", "FAIL", "Task not found");
    }

    // Update onboarding task
    const updatedTask = await prisma.onboardingTask.update({
      where: { id: onboardingTask.id },
      data: { status: "COMPLETED" },
    });
    logResult("Onboarding Task Update", "PASS", `Updated status to: ${updatedTask.status}`);

    // Delete onboarding task
    await prisma.onboardingTask.delete({
      where: { id: onboardingTask.id },
    });
    logResult("Onboarding Task Delete", "PASS", "Successfully deleted test task");
  } catch (error) {
    logResult("Onboarding Task CRUD", "FAIL", `Error: ${error}`);
  }
}

async function testLaborCalculationCRUD() {
  try {
    // Create labor calculation
    const laborCalc = await prisma.laborCalculation.create({
      data: {
        employeeId: "test-employee-id",
        employeeName: "Test Employee",
        calculationType: "OVERTIME",
        baseSalary: 50000,
        calculatedAmount: 5000,
        period: "2024-01",
        details: { hours: 40, rate: 125 },
      },
    });
    logResult("Labor Calculation Creation", "PASS", `Created calculation with ID: ${laborCalc.id}`);

    // Read labor calculation
    const foundCalc = await prisma.laborCalculation.findUnique({
      where: { id: laborCalc.id },
    });
    if (foundCalc) {
      logResult("Labor Calculation Read", "PASS", `Found calculation: ${foundCalc.calculationType}`);
    } else {
      logResult("Labor Calculation Read", "FAIL", "Calculation not found");
    }

    // Update labor calculation
    const updatedCalc = await prisma.laborCalculation.update({
      where: { id: laborCalc.id },
      data: { calculatedAmount: 5500 },
    });
    logResult("Labor Calculation Update", "PASS", `Updated amount to: ${updatedCalc.calculatedAmount}`);

    // Delete labor calculation
    await prisma.laborCalculation.delete({
      where: { id: laborCalc.id },
    });
    logResult("Labor Calculation Delete", "PASS", "Successfully deleted test calculation");
  } catch (error) {
    logResult("Labor Calculation CRUD", "FAIL", `Error: ${error}`);
  }
}

async function runAllTests() {
  console.log("🚀 Starting Comprehensive CRUD Tests for IMPRO HR System\n");

  await testDatabaseConnection();
  await testUserCRUD();
  await testEmployeeCRUD();
  await testApplicantCRUD();
  await testIncidentCRUD();
  await testOnboardingCRUD();
  await testLaborCalculationCRUD();

  console.log("\n📊 Test Summary:");
  console.log("================");
  
  const passCount = results.filter(r => r.status === "PASS").length;
  const failCount = results.filter(r => r.status === "FAIL").length;
  
  console.log(`✅ Passed: ${passCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📈 Success Rate: ${((passCount / results.length) * 100).toFixed(1)}%`);

  if (failCount > 0) {
    console.log("\n❌ Failed Tests:");
    results.filter(r => r.status === "FAIL").forEach(r => {
      console.log(`   - ${r.test}: ${r.message}`);
    });
  }

  await prisma.$disconnect();
}

runAllTests().catch(console.error);

