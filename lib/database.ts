import Database from 'better-sqlite3'
import path from 'path'

// Initialize SQLite database
const dbPath = path.join(process.cwd(), 'database.sqlite')
const db = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

// Create tables with enhanced payroll structure
db.exec(`
  CREATE TABLE IF NOT EXISTS positions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    dailySalary REAL NOT NULL,
    isFilled INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payrollNumber INTEGER UNIQUE NOT NULL,
    name TEXT NOT NULL,
    positionId INTEGER NOT NULL,
    shift TEXT NOT NULL,
    nss TEXT NOT NULL,
    rfc TEXT NOT NULL,
    curp TEXT NOT NULL,
    birthDate TEXT NOT NULL,
    birthPlace TEXT NOT NULL,
    gender TEXT NOT NULL,
    bloodType TEXT NOT NULL,
    plant TEXT NOT NULL,
    department TEXT NOT NULL,
    dailySalary REAL NOT NULL,
    hireDate TEXT NOT NULL,
    payrollType TEXT NOT NULL,
    source TEXT NOT NULL,
    transportRoute TEXT NOT NULL,
    transportStop TEXT NOT NULL,
    costCenter TEXT NOT NULL,
    transportType TEXT NOT NULL,
    bankAccount TEXT NOT NULL,
    collarType TEXT NOT NULL,
    isActive INTEGER DEFAULT 1,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (positionId) REFERENCES positions (id)
  );

  CREATE TABLE IF NOT EXISTS payroll_periods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    payDate TEXT NOT NULL,
    status TEXT DEFAULT 'DRAFT',
    type TEXT NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS payroll_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employeeId INTEGER NOT NULL,
    periodId INTEGER NOT NULL,
    regularHours REAL DEFAULT 0,
    overtimeHours REAL DEFAULT 0,
    doubleTimeHours REAL DEFAULT 0,
    regularPay REAL DEFAULT 0,
    overtimePay REAL DEFAULT 0,
    doubleTimePay REAL DEFAULT 0,
    grossPay REAL DEFAULT 0,
    federalTax REAL DEFAULT 0,
    stateTax REAL DEFAULT 0,
    socialSecurity REAL DEFAULT 0,
    medicare REAL DEFAULT 0,
    otherDeductions REAL DEFAULT 0,
    totalDeductions REAL DEFAULT 0,
    netPay REAL DEFAULT 0,
    bonus REAL DEFAULT 0,
    commission REAL DEFAULT 0,
    status TEXT DEFAULT 'PENDING',
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employeeId) REFERENCES employees (id),
    FOREIGN KEY (periodId) REFERENCES payroll_periods (id)
  );

  CREATE TABLE IF NOT EXISTS time_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employeeId INTEGER NOT NULL,
    date TEXT NOT NULL,
    clockIn TEXT,
    clockOut TEXT,
    breakStart TEXT,
    breakEnd TEXT,
    regularHours REAL DEFAULT 0,
    overtimeHours REAL DEFAULT 0,
    status TEXT DEFAULT 'PENDING',
    notes TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employeeId) REFERENCES employees (id)
  );

  CREATE TABLE IF NOT EXISTS deductions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    amount REAL,
    percentage REAL,
    isActive INTEGER DEFAULT 1,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS employee_deductions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employeeId INTEGER NOT NULL,
    deductionId INTEGER NOT NULL,
    amount REAL,
    isActive INTEGER DEFAULT 1,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employeeId) REFERENCES employees (id),
    FOREIGN KEY (deductionId) REFERENCES deductions (id)
  );

  CREATE TABLE IF NOT EXISTS benefits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    employerCost REAL DEFAULT 0,
    employeeCost REAL DEFAULT 0,
    isActive INTEGER DEFAULT 1,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS employee_benefits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employeeId INTEGER NOT NULL,
    benefitId INTEGER NOT NULL,
    enrollmentDate TEXT NOT NULL,
    isActive INTEGER DEFAULT 1,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employeeId) REFERENCES employees (id),
    FOREIGN KEY (benefitId) REFERENCES benefits (id)
  );
`)

// Check if positions exist
const posRow = db.prepare(`SELECT COUNT(*) as count FROM positions`).get() as { count: number }
const hasPositions = posRow?.count ?? 0

if (hasPositions === 0) {
  const insertPosition = db.prepare(`
    INSERT INTO positions (title, department, dailySalary, isFilled)
    VALUES (@title, @department, @dailySalary, @isFilled)
  `)

  const positions = [
    { title: 'Software Engineer', department: 'IT', dailySalary: 1200, isFilled: 1 },
    { title: 'HR Manager', department: 'HR', dailySalary: 950, isFilled: 0 },
    { title: 'Accountant', department: 'Finance', dailySalary: 1100, isFilled: 0 },
  ]

  const insertMany = db.transaction((rows: typeof positions) => {
    for (const row of rows) insertPosition.run(row)
  })

  insertMany(positions)
  console.log(`✅ Seeded ${positions.length} positions`)
}

// Check if employees exist
const empRow = db.prepare(`SELECT COUNT(*) as count FROM employees`).get() as { count: number }
const hasEmployees = empRow?.count ?? 0

if (hasEmployees === 0) {
  const insertEmployee = db.prepare(`
    INSERT INTO employees (
      payrollNumber, name, positionId, shift, nss, rfc, curp, birthDate, birthPlace,
      gender, bloodType, plant, department, dailySalary, hireDate, payrollType, source,
      transportRoute, transportStop, costCenter, transportType, bankAccount, collarType
    )
    VALUES (
      @payrollNumber, @name, @positionId, @shift, @nss, @rfc, @curp, @birthDate, @birthPlace,
      @gender, @bloodType, @plant, @department, @dailySalary, @hireDate, @payrollType, @source,
      @transportRoute, @transportStop, @costCenter, @transportType, @bankAccount, @collarType
    )
  `)

  const employees = [
    {
      payrollNumber: 1001,
      name: 'John Doe',
      positionId: 1, // FK to Software Engineer
      shift: 'Morning',
      nss: '12345678901',
      rfc: 'DOEJ800101XXX',
      curp: 'DOEJ800101HDFRRN01',
      birthDate: '1980-01-01',
      birthPlace: 'Mexico City',
      gender: 'M',
      bloodType: 'O+',
      plant: 'PM',
      department: 'IT',
      dailySalary: 1200,
      hireDate: '2020-05-10',
      payrollType: 'CATORCENAL',
      source: 'IMPRO',
      transportRoute: 'RUTA_1',
      transportStop: 'PARADA_1',
      costCenter: 'CC101',
      transportType: 'PROPIO',
      bankAccount: '1234567890',
      collarType: 'WHITECOLLAR',
    },
    {
      payrollNumber: 1002,
      name: 'Jane Smith',
      positionId: 2, // FK to HR Manager
      shift: 'Evening',
      nss: '10987654321',
      rfc: 'SMIJ900202XXX',
      curp: 'SMIJ900202MDFRRN02',
      birthDate: '1990-02-02',
      birthPlace: 'Guadalajara',
      gender: 'F',
      bloodType: 'A+',
      plant: 'SSD',
      department: 'HR',
      dailySalary: 950,
      hireDate: '2021-03-15',
      payrollType: 'SEMANAL',
      source: 'BESTJOBS',
      transportRoute: 'RUTA_2',
      transportStop: 'PARADA_2',
      costCenter: 'CC102',
      transportType: 'RUTA',
      bankAccount: '0987654321',
      collarType: 'BLUECOLLAR',
    }
  ]

  const insertMany = db.transaction((rows: typeof employees) => {
    for (const row of rows) insertEmployee.run(row)
  })

  insertMany(employees)
  console.log(`✅ Seeded ${employees.length} employees`)
}

// Seed payroll periods
const periodRow = db.prepare(`SELECT COUNT(*) as count FROM payroll_periods`).get() as { count: number }
const hasPeriods = periodRow?.count ?? 0

if (hasPeriods === 0) {
  const insertPeriod = db.prepare(`
    INSERT INTO payroll_periods (name, startDate, endDate, payDate, status, type)
    VALUES (@name, @startDate, @endDate, @payDate, @status, @type)
  `)

  const periods = [
    {
      name: 'January 2025 - Week 1',
      startDate: '2025-01-01',
      endDate: '2025-01-07',
      payDate: '2025-01-10',
      status: 'PROCESSED',
      type: 'WEEKLY'
    },
    {
      name: 'January 2025 - Week 2',
      startDate: '2025-01-08',
      endDate: '2025-01-14',
      payDate: '2025-01-17',
      status: 'DRAFT',
      type: 'WEEKLY'
    },
    {
      name: 'January 2025 - Bi-weekly 1',
      startDate: '2025-01-01',
      endDate: '2025-01-14',
      payDate: '2025-01-17',
      status: 'PROCESSING',
      type: 'BIWEEKLY'
    }
  ]

  const insertManyPeriods = db.transaction((rows: typeof periods) => {
    for (const row of rows) insertPeriod.run(row)
  })

  insertManyPeriods(periods)
  console.log(`✅ Seeded ${periods.length} payroll periods`)
}

// Seed deductions
const deductionRow = db.prepare(`SELECT COUNT(*) as count FROM deductions`).get() as { count: number }
const hasDeductions = deductionRow?.count ?? 0

if (hasDeductions === 0) {
  const insertDeduction = db.prepare(`
    INSERT INTO deductions (name, type, amount, percentage, isActive)
    VALUES (@name, @type, @amount, @percentage, @isActive)
  `)

  const deductions = [
    { name: 'Federal Income Tax', type: 'TAX', amount: null, percentage: 22.0, isActive: 1 },
    { name: 'State Income Tax', type: 'TAX', amount: null, percentage: 5.0, isActive: 1 },
    { name: 'Social Security', type: 'TAX', amount: null, percentage: 6.2, isActive: 1 },
    { name: 'Medicare', type: 'TAX', amount: null, percentage: 1.45, isActive: 1 },
    { name: 'Health Insurance', type: 'BENEFIT', amount: 150.0, percentage: null, isActive: 1 },
    { name: 'Dental Insurance', type: 'BENEFIT', amount: 25.0, percentage: null, isActive: 1 },
    { name: '401k Contribution', type: 'RETIREMENT', amount: null, percentage: 5.0, isActive: 1 }
  ]

  const insertManyDeductions = db.transaction((rows: typeof deductions) => {
    for (const row of rows) insertDeduction.run(row)
  })

  insertManyDeductions(deductions)
  console.log(`✅ Seeded ${deductions.length} deductions`)
}

// Seed time entries
const timeRow = db.prepare(`SELECT COUNT(*) as count FROM time_entries`).get() as { count: number }
const hasTimeEntries = timeRow?.count ?? 0

if (hasTimeEntries === 0) {
  const insertTimeEntry = db.prepare(`
    INSERT INTO time_entries (employeeId, date, clockIn, clockOut, breakStart, breakEnd, regularHours, overtimeHours, status)
    VALUES (@employeeId, @date, @clockIn, @clockOut, @breakStart, @breakEnd, @regularHours, @overtimeHours, @status)
  `)

  const timeEntries = [
    {
      employeeId: 1,
      date: '2025-01-13',
      clockIn: '08:00',
      clockOut: '17:00',
      breakStart: '12:00',
      breakEnd: '13:00',
      regularHours: 8.0,
      overtimeHours: 0.0,
      status: 'APPROVED'
    },
    {
      employeeId: 1,
      date: '2025-01-14',
      clockIn: '08:00',
      clockOut: '19:00',
      breakStart: '12:00',
      breakEnd: '13:00',
      regularHours: 8.0,
      overtimeHours: 2.0,
      status: 'APPROVED'
    },
    {
      employeeId: 2,
      date: '2025-01-13',
      clockIn: '09:00',
      clockOut: '18:00',
      breakStart: '13:00',
      breakEnd: '14:00',
      regularHours: 8.0,
      overtimeHours: 0.0,
      status: 'APPROVED'
    }
  ]

  const insertManyTimeEntries = db.transaction((rows: typeof timeEntries) => {
    for (const row of rows) insertTimeEntry.run(row)
  })

  insertManyTimeEntries(timeEntries)
  console.log(`✅ Seeded ${timeEntries.length} time entries`)
}

export { db }
