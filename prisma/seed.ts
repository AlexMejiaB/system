import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('⏳ Resetting OrganizationalStructure...')
  await prisma.organizationalStructure.deleteMany()

  console.log('⏳ Seeding OrganizationalStructure...')
  await prisma.organizationalStructure.createMany({
    data: [
      // ======================
      // Level 0: Group
      // ======================
      { id: 1, parent_id: null, entity_type: 'Group', entity_name: 'Impro Group', assigned_person: 'Reb LU (Chairman & CEO)', collar_category: 'White' },

      // ======================
      // Level 1: Companies
      // ======================
      { id: 2, parent_id: 1, entity_type: 'Company', entity_name: 'IMMX (Impro Industries Mexico)', assigned_person: 'Reb LU (President)', collar_category: 'White' },
      { id: 100, parent_id: 1, entity_type: 'Company', entity_name: 'IAMX (Impro Aerospace Mexico)', assigned_person: 'Reb LU (Acting General Mgr.)', collar_category: 'White' },

      // ======================
      // IMMX - Central Departments
      // ======================
      { id: 3, parent_id: 2, entity_type: 'Central Department', entity_name: 'Finance', assigned_person: 'Dennis IP (CFO) / Cesar MEDINA (Director)', collar_category: 'White' },
      { id: 20, parent_id: 2, entity_type: 'Central Department', entity_name: 'Human Resources', assigned_person: 'Karina C. / Jaqueline M. (Manager)', collar_category: 'White' },
      { id: 30, parent_id: 2, entity_type: 'Central Department', entity_name: 'Supply Chain', assigned_person: 'Tony DING (Director) / Lenin M. (Manager)', collar_category: 'White' },
      { id: 40, parent_id: 2, entity_type: 'Central Department', entity_name: 'Customer Service', assigned_person: 'Martin XU (VP)', collar_category: 'White' },
      { id: 50, parent_id: 2, entity_type: 'Central Department', entity_name: 'Administration', assigned_person: null, collar_category: null },
      { id: 60, parent_id: 2, entity_type: 'Central Department', entity_name: 'Maintenance', assigned_person: 'Brent YU (VP) / Felix R. / Luis R. (Leader)', collar_category: 'White' },
      { id: 70, parent_id: 2, entity_type: 'Central Department', entity_name: 'Construction', assigned_person: 'Humberto R. / Isai L. (Leader)', collar_category: 'White' },

      // Finance Sub-Departments and Positions
      { id: 4, parent_id: 3, entity_type: 'Sub-Department', entity_name: 'Accounting', assigned_person: null, collar_category: null },
      { id: 5, parent_id: 4, entity_type: 'Position', entity_name: 'Manager', assigned_person: null, collar_category: 'White' },
      { id: 6, parent_id: 5, entity_type: 'Position', entity_name: 'Supervisor', assigned_person: null, collar_category: 'White' },
      { id: 7, parent_id: 6, entity_type: 'Position', entity_name: 'Operator', assigned_person: null, collar_category: 'Blue' },

      { id: 8, parent_id: 3, entity_type: 'Sub-Department', entity_name: 'Treasury', assigned_person: null, collar_category: null },
      { id: 9, parent_id: 8, entity_type: 'Position', entity_name: 'Manager', assigned_person: null, collar_category: 'White' },
      { id: 10, parent_id: 9, entity_type: 'Position', entity_name: 'Supervisor', assigned_person: null, collar_category: 'White' },
      { id: 11, parent_id: 10, entity_type: 'Position', entity_name: 'Operator', assigned_person: null, collar_category: 'Blue' },

      { id: 12, parent_id: 3, entity_type: 'Sub-Department', entity_name: 'Tax', assigned_person: null, collar_category: null },
      { id: 13, parent_id: 12, entity_type: 'Position', entity_name: 'Manager', assigned_person: null, collar_category: 'White' },
      { id: 14, parent_id: 13, entity_type: 'Position', entity_name: 'Supervisor', assigned_person: null, collar_category: 'White' },
      { id: 15, parent_id: 14, entity_type: 'Position', entity_name: 'Operator', assigned_person: null, collar_category: 'Blue' },

      { id: 16, parent_id: 3, entity_type: 'Sub-Department', entity_name: 'Trade Compliance', assigned_person: null, collar_category: null },
      { id: 17, parent_id: 16, entity_type: 'Position', entity_name: 'Manager', assigned_person: null, collar_category: 'White' },
      { id: 18, parent_id: 17, entity_type: 'Position', entity_name: 'Supervisor', assigned_person: null, collar_category: 'White' },
      { id: 19, parent_id: 18, entity_type: 'Position', entity_name: 'Operator', assigned_person: null, collar_category: 'Blue' },

      // Human Resources Sub-Departments and Positions
      { id: 21, parent_id: 20, entity_type: 'Sub-Department', entity_name: 'Recruitment & Training', assigned_person: null, collar_category: null },
      { id: 22, parent_id: 21, entity_type: 'Position', entity_name: 'Manager', assigned_person: null, collar_category: 'White' },
      { id: 23, parent_id: 22, entity_type: 'Position', entity_name: 'Supervisor', assigned_person: null, collar_category: 'White' },
      { id: 24, parent_id: 23, entity_type: 'Position', entity_name: 'Operator', assigned_person: null, collar_category: 'Blue' },

      { id: 25, parent_id: 20, entity_type: 'Sub-Department', entity_name: 'Payroll', assigned_person: null, collar_category: null },
      { id: 26, parent_id: 25, entity_type: 'Position', entity_name: 'Manager', assigned_person: null, collar_category: 'White' },
      { id: 27, parent_id: 26, entity_type: 'Position', entity_name: 'Supervisor', assigned_person: null, collar_category: 'White' },
      { id: 28, parent_id: 27, entity_type: 'Position', entity_name: 'Operator', assigned_person: null, collar_category: 'Blue' },

      // Supply Chain Sub-Departments and Positions
      { id: 31, parent_id: 30, entity_type: 'Sub-Department', entity_name: 'Sourcing', assigned_person: null, collar_category: null },
      { id: 32, parent_id: 31, entity_type: 'Position', entity_name: 'Manager', assigned_person: null, collar_category: 'White' },
      { id: 33, parent_id: 32, entity_type: 'Position', entity_name: 'Supervisor', assigned_person: null, collar_category: 'White' },
      { id: 34, parent_id: 33, entity_type: 'Position', entity_name: 'Operator', assigned_person: null, collar_category: 'Blue' },

      { id: 35, parent_id: 30, entity_type: 'Sub-Department', entity_name: 'Logistics', assigned_person: null, collar_category: null },
      { id: 36, parent_id: 35, entity_type: 'Position', entity_name: 'Manager', assigned_person: null, collar_category: 'White' },
      { id: 37, parent_id: 36, entity_type: 'Position', entity_name: 'Supervisor', assigned_person: null, collar_category: 'White' },
      { id: 38, parent_id: 37, entity_type: 'Position', entity_name: 'Operator', assigned_person: null, collar_category: 'Blue' },

      { id: 39, parent_id: 30, entity_type: 'Sub-Department', entity_name: 'Purchasing', assigned_person: null, collar_category: null },
      { id: 41, parent_id: 39, entity_type: 'Position', entity_name: 'Manager', assigned_person: null, collar_category: 'White' },
      { id: 42, parent_id: 41, entity_type: 'Position', entity_name: 'Supervisor', assigned_person: null, collar_category: 'White' },
      { id: 43, parent_id: 42, entity_type: 'Position', entity_name: 'Operator', assigned_person: null, collar_category: 'Blue' },

      // ======================
      // IMMX Plants
      // ======================
      { id: 200, parent_id: 2, entity_type: 'Plant', entity_name: 'Plant PM', assigned_person: 'Fatih BIYIKLI (General Manager)', collar_category: 'White' },
      { id: 300, parent_id: 2, entity_type: 'Plant', entity_name: 'Plant 11 (Fluid System)', assigned_person: 'Penny WANG (GM) / Fatih B. (Co-GM)', collar_category: 'White' },

      // Plant PM → Business Units
      { id: 201, parent_id: 200, entity_type: 'Business Unit', entity_name: 'Automotive Product Unit (APU)', assigned_person: null, collar_category: null },
      { id: 220, parent_id: 200, entity_type: 'Business Unit', entity_name: 'Industrial Product Unit (IPU)', assigned_person: null, collar_category: null },

      // APU Departments and Positions
      { id: 202, parent_id: 201, entity_type: 'Department', entity_name: 'Automotive Production', assigned_person: null, collar_category: null },
      { id: 203, parent_id: 202, entity_type: 'Position', entity_name: 'Manager', assigned_person: null, collar_category: 'White' },
      { id: 204, parent_id: 203, entity_type: 'Position', entity_name: 'Supervisor', assigned_person: null, collar_category: 'White' },
      { id: 205, parent_id: 204, entity_type: 'Position', entity_name: 'Operator', assigned_person: null, collar_category: 'Blue' },

      { id: 206, parent_id: 201, entity_type: 'Department', entity_name: 'Automotive Quality', assigned_person: null, collar_category: null },
      { id: 207, parent_id: 206, entity_type: 'Position', entity_name: 'Manager', assigned_person: null, collar_category: 'White' },
      { id: 208, parent_id: 207, entity_type: 'Position', entity_name: 'Supervisor', assigned_person: null, collar_category: 'White' },
      { id: 209, parent_id: 208, entity_type: 'Position', entity_name: 'Operator', assigned_person: null, collar_category: 'Blue' },

      { id: 210, parent_id: 201, entity_type: 'Department', entity_name: 'Automotive Engineering', assigned_person: null, collar_category: null },
      { id: 211, parent_id: 210, entity_type: 'Position', entity_name: 'Manager', assigned_person: null, collar_category: 'White' },
      { id: 212, parent_id: 211, entity_type: 'Position', entity_name: 'Supervisor', assigned_person: null, collar_category: 'White' },
      { id: 213, parent_id: 212, entity_type: 'Position', entity_name: 'Worker', assigned_person: null, collar_category: null },

      // IPU Departments and Positions
      { id: 221, parent_id: 220, entity_type: 'Department', entity_name: 'Industrial Production', assigned_person: null, collar_category: null },
      { id: 222, parent_id: 221, entity_type: 'Position', entity_name: 'Manager', assigned_person: null, collar_category: 'White' },
      { id: 223, parent_id: 222, entity_type: 'Position', entity_name: 'Supervisor', assigned_person: null, collar_category: 'White' },
      { id: 224, parent_id: 223, entity_type: 'Position', entity_name: 'Operator', assigned_person: null, collar_category: 'Blue' },

      { id: 225, parent_id: 220, entity_type: 'Department', entity_name: 'Industrial Quality', assigned_person: null, collar_category: null },
      { id: 226, parent_id: 225, entity_type: 'Position', entity_name: 'Manager', assigned_person: null, collar_category: 'White' },
      { id: 227, parent_id: 226, entity_type: 'Position', entity_name: 'Supervisor', assigned_person: null, collar_category: 'White' },
      { id: 228, parent_id: 227, entity_type: 'Position', entity_name: 'Operator', assigned_person: null, collar_category: 'Blue' },

      { id: 229, parent_id: 220, entity_type: 'Department', entity_name: 'Industrial Engineering', assigned_person: null, collar_category: null },
      { id: 230, parent_id: 229, entity_type: 'Position', entity_name: 'Manager', assigned_person: null, collar_category: 'White' },
      { id: 231, parent_id: 230, entity_type: 'Position', entity_name: 'Supervisor', assigned_person: null, collar_category: 'White' },
      { id: 232, parent_id: 231, entity_type: 'Position', entity_name: 'Worker', assigned_person: null, collar_category: null },

      // Plant 11 (Fluid System)
      { id: 301, parent_id: 300, entity_type: 'Business Unit', entity_name: 'Fluid System Product Unit (FPU)', assigned_person: null, collar_category: null },

      { id: 302, parent_id: 301, entity_type: 'Department', entity_name: 'Fluid Production', assigned_person: null, collar_category: null },
      { id: 303, parent_id: 302, entity_type: 'Position', entity_name: 'Manager', assigned_person: null, collar_category: 'White' },
      { id: 304, parent_id: 303, entity_type: 'Position', entity_name: 'Supervisor', assigned_person: null, collar_category: 'White' },
      { id: 305, parent_id: 304, entity_type: 'Position', entity_name: 'Operator', assigned_person: null, collar_category: 'Blue' },

      { id: 306, parent_id: 301, entity_type: 'Department', entity_name: 'Fluid Quality', assigned_person: null, collar_category: null },
      { id: 307, parent_id: 306, entity_type: 'Position', entity_name: 'Manager', assigned_person: null, collar_category: 'White' },
      { id: 308, parent_id: 307, entity_type: 'Position', entity_name: 'Supervisor', assigned_person: null, collar_category: 'White' },
      { id: 309, parent_id: 308, entity_type: 'Position', entity_name: 'Operator', assigned_person: null, collar_category: 'Blue' },

      { id: 310, parent_id: 301, entity_type: 'Department', entity_name: 'Fluid R&D', assigned_person: null, collar_category: null },
      { id: 311, parent_id: 310, entity_type: 'Position', entity_name: 'Manager', assigned_person: null, collar_category: 'White' },
      { id: 312, parent_id: 311, entity_type: 'Position', entity_name: 'Supervisor', assigned_person: null, collar_category: 'White' },
      { id: 313, parent_id: 312, entity_type: 'Position', entity_name: 'Worker', assigned_person: null, collar_category: null },

      // ======================
      // IAMX (Impro Aerospace Mexico)
      // ======================
      { id: 101, parent_id: 100, entity_type: 'Business Unit', entity_name: 'Casting & Heat Treatment (CHU)', assigned_person: 'James AN (Operation Dir.)', collar_category: 'White' },
      { id: 110, parent_id: 100, entity_type: 'Business Unit', entity_name: 'Aerospace Components (ACU)', assigned_person: 'Lucas LIU (Operation Dir.)', collar_category: 'White' },
      { id: 120, parent_id: 100, entity_type: 'Business Unit', entity_name: 'Medical & Energy Components (MCU)', assigned_person: 'Lucas LIU (Operation Dir.)', collar_category: 'White' },
      { id: 130, parent_id: 100, entity_type: 'Business Unit', entity_name: 'Surface Treatment (STU)', assigned_person: 'Lucas LIU (Operation Dir.)', collar_category: 'White' },

      // CHU (Casting & Heat Treatment)
      { id: 102, parent_id: 101, entity_type: 'Workshop', entity_name: 'Casting & Heat Treatment Workshop', assigned_person: null, collar_category: null },
      { id: 103, parent_id: 102, entity_type: 'Position', entity_name: 'Manager', assigned_person: null, collar_category: 'White' },
      { id: 104, parent_id: 103, entity_type: 'Position', entity_name: 'Supervisor', assigned_person: null, collar_category: 'White' },
      { id: 105, parent_id: 104, entity_type: 'Position', entity_name: 'Operator', assigned_person: null, collar_category: 'Blue' },

      // ACU (Aerospace Components)
      { id: 111, parent_id: 110, entity_type: 'Workshop', entity_name: 'Aerospace Machining Workshop', assigned_person: null, collar_category: null },
      { id: 112, parent_id: 111, entity_type: 'Position', entity_name: 'Manager', assigned_person: null, collar_category: 'White' },
      { id: 113, parent_id: 112, entity_type: 'Position', entity_name: 'Supervisor', assigned_person: null, collar_category: 'White' },
      { id: 114, parent_id: 113, entity_type: 'Position', entity_name: 'Operator', assigned_person: null, collar_category: 'Blue' },

      { id: 115, parent_id: 110, entity_type: 'Workshop', entity_name: 'Aerospace Inspection & Packaging Workshop', assigned_person: null, collar_category: null },
      { id: 116, parent_id: 115, entity_type: 'Position', entity_name: 'Manager', assigned_person: null, collar_category: 'White' },
      { id: 117, parent_id: 116, entity_type: 'Position', entity_name: 'Supervisor', assigned_person: null, collar_category: 'White' },
      { id: 118, parent_id: 117, entity_type: 'Position', entity_name: 'Operator', assigned_person: null, collar_category: 'Blue' },

      // MCU (Medical & Energy Components)
      { id: 121, parent_id: 120, entity_type: 'Workshop', entity_name: 'Medical & Energy Machining Workshop', assigned_person: null, collar_category: null },
      { id: 122, parent_id: 121, entity_type: 'Position', entity_name: 'Manager', assigned_person: null, collar_category: 'White' },
      { id: 123, parent_id: 122, entity_type: 'Position', entity_name: 'Supervisor', assigned_person: null, collar_category: 'White' },
      { id: 124, parent_id: 123, entity_type: 'Position', entity_name: 'Operator', assigned_person: null, collar_category: 'Blue' },

      // STU (Surface Treatment)
      { id: 131, parent_id: 130, entity_type: 'Workshop', entity_name: 'Surface Treatment Workshop', assigned_person: null, collar_category: null },
      { id: 132, parent_id: 131, entity_type: 'Position', entity_name: 'Manager', assigned_person: null, collar_category: 'White' },
      { id: 133, parent_id: 132, entity_type: 'Position', entity_name: 'Supervisor', assigned_person: null, collar_category: 'White' },
      { id: 134, parent_id: 133, entity_type: 'Position', entity_name: 'Operator', assigned_person: null, collar_category: 'Blue' },
    ]
  })

  console.log('✅ Organizational Structure seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
