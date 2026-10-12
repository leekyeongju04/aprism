// In-memory data store for APRISM
export const store = {
  roles: [
    { id: 1, name: 'Technical Administrator', description: 'Manages system configuration, accounts, backups, and security.' },
    { id: 2, name: 'Academic Head', description: 'Manages academic setups, programs, sections, schedules, and reports.' },
    { id: 3, name: 'Teacher', description: 'Manages attendance, classes, student monitoring, AprilTags, and referrals.' },
    { id: 4, name: 'Disciplinary Officer', description: 'Manages student intervention cases, referrals, and disciplinary records.' },
  ],

  users: [
    {
      id: 3,
      roleId: 1,
      roleName: 'Technical Administrator',
      employeeNumber: 'EMP0001',
      username: 'admin',
      email: 'admin@dasmarinas.sti.edu.ph',
      firstName: 'System',
      lastName: 'Administrator',
      password: 'password',
      accountStatus: 'Active',
      responsibilities: [],
      lastLoginAt: '2026-10-12 15:40:00',
      createdAt: '2026-07-10 19:07:07'
    },
    {
      id: 4,
      roleId: 1,
      roleName: 'Technical Administrator',
      employeeNumber: 'EMP-TEST-001',
      username: 'testuser',
      email: 'testuser@dasmarinas.sti.edu.ph',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password',
      accountStatus: 'Active',
      responsibilities: [],
      lastLoginAt: '2026-10-10 09:15:00',
      createdAt: '2026-07-15 22:24:45'
    },
    {
      id: 5,
      roleId: 2,
      roleName: 'Academic Head',
      employeeNumber: 'EMP-2026-001',
      username: 'Academic Head',
      email: 'acadhead@dasmarinas.sti.edu.ph',
      firstName: 'Alejandro',
      lastName: 'Diaz',
      password: 'password',
      accountStatus: 'Active',
      responsibilities: [],
      lastLoginAt: '2026-10-12 14:20:00',
      createdAt: '2026-08-01 01:23:38'
    },
    {
      id: 6,
      roleId: 3,
      roleName: 'Teacher',
      employeeNumber: 'EMP-2026-002',
      username: 'teacher',
      email: 'teacher@dasmarinas.sti.edu.ph',
      firstName: 'Maria',
      lastName: 'Santos',
      password: 'password',
      accountStatus: 'Active',
      responsibilities: ['Adviser', 'Program Head'],
      lastLoginAt: '2026-10-12 15:10:00',
      createdAt: '2026-08-07 21:43:52'
    },
    {
      id: 7,
      roleId: 4,
      roleName: 'Disciplinary Officer',
      employeeNumber: 'EMP-2026-003',
      username: 'discipline',
      email: 'discipline@dasmarinas.sti.edu.ph',
      firstName: 'Mark',
      lastName: 'Ramos',
      password: 'password',
      accountStatus: 'Active',
      responsibilities: [],
      lastLoginAt: '2026-10-11 11:30:00',
      createdAt: '2026-08-08 10:00:00'
    }
  ],

  schoolYears: [
    { id: 4, schoolYear: '2026-2027', startDate: '2026-08-09', endDate: '2027-06-14', status: 'Active' },
    { id: 5, schoolYear: '2027-2028', startDate: '2027-08-10', endDate: '2028-06-05', status: 'Inactive' }
  ],

  academicPeriods: [
    { id: 2, schoolYearId: 4, level: 'College', semester: '1st Semester', term: 'Prelim', startDate: '2026-08-10', endDate: '2026-09-01', status: 'Active' },
    { id: 3, schoolYearId: 4, level: 'College', semester: '1st Semester', term: 'Midterm', startDate: '2026-09-02', endDate: '2026-10-15', status: 'Inactive' },
    { id: 4, schoolYearId: 4, level: 'College', semester: '1st Semester', term: 'Finals', startDate: '2026-10-16', endDate: '2026-11-20', status: 'Inactive' }
  ],

  monitoringThresholds: {
    attendanceThreshold: 80,
    gradeThreshold: 75,
    consecutiveAbsences: 3
  },

  programs: [
    { id: 1, code: 'BSIT', name: 'Bachelor of Science in Information Technology', status: 'Active', studentCount: 142 },
    { id: 2, code: 'BSCS', name: 'Bachelor of Science in Computer Science', status: 'Active', studentCount: 98 },
    { id: 3, code: 'BSHM', name: 'Bachelor of Science in Hospitality Management', status: 'Active', studentCount: 85 },
    { id: 4, code: 'BSA', name: 'Bachelor of Science in Accountancy', status: 'Active', studentCount: 64 }
  ],

  sections: [
    { id: 1, name: 'BSIT-401', program: 'BSIT', yearLevel: 4, room: 'Lab 201', adviser: 'Prof. Maria Santos', studentCount: 8, capacity: 40 },
    { id: 2, name: 'BSIT-301', program: 'BSIT', yearLevel: 3, room: 'Room 402', adviser: 'Prof. Maria Santos', studentCount: 32, capacity: 40 },
    { id: 3, name: 'BSCS-201', program: 'BSCS', yearLevel: 2, room: 'Room 305', adviser: 'Prof. Alejandro Diaz', studentCount: 28, capacity: 35 }
  ],

  subjects: [
    { id: 1, code: 'IT405', name: 'Web Systems and Technologies', units: 3.0, status: 'Active' },
    { id: 2, code: 'IT301', name: 'Systems Analysis and Design', units: 3.0, status: 'Active' },
    { id: 3, code: 'CS202', name: 'Data Structures and Algorithms', units: 3.0, status: 'Active' },
    { id: 4, code: 'IT402', name: 'Capstone Project 1', units: 3.0, status: 'Active' }
  ],

  operationalClasses: [
    { id: 1, subjectCode: 'IT405', subjectName: 'Web Systems and Technologies', section: 'BSIT-401', schedule: 'MWF 08:00 AM - 10:00 AM', room: 'Lab 201', teacherId: 6, studentCount: 8 },
    { id: 2, subjectCode: 'IT301', subjectName: 'Systems Analysis and Design', section: 'BSIT-301', schedule: 'TTH 10:00 AM - 12:30 PM', room: 'Room 402', teacherId: 6, studentCount: 32 },
    { id: 3, subjectCode: 'CS202', subjectName: 'Data Structures and Algorithms', section: 'BSCS-201', schedule: 'MWF 01:00 PM - 03:00 PM', room: 'Room 305', teacherId: 6, studentCount: 28 }
  ],

  students: [
    { id: 1, classId: 1, studentNumber: '02000284910', firstName: 'Kyle Adrian', lastName: 'Alvarez', aprilTagId: 101, attendanceRate: 94, prelimGrade: 88, status: 'Good Standing', email: 'kyle.alvarez@dasmarinas.sti.edu.ph' },
    { id: 2, classId: 1, studentNumber: '02000284911', firstName: 'Bea Nicole', lastName: 'Bautista', aprilTagId: 102, attendanceRate: 91, prelimGrade: 90, status: 'Good Standing', email: 'bea.bautista@dasmarinas.sti.edu.ph' },
    { id: 3, classId: 1, studentNumber: '02000284912', firstName: 'Christian Dave', lastName: 'Cruz', aprilTagId: 103, attendanceRate: 72, prelimGrade: 71, status: 'At Risk - Attendance Alert', email: 'christian.cruz@dasmarinas.sti.edu.ph' },
    { id: 4, classId: 1, studentNumber: '02000284913', firstName: 'Danica Mae', lastName: 'Del Rosario', aprilTagId: 104, attendanceRate: 88, prelimGrade: 85, status: 'Good Standing', email: 'danica.delrosario@dasmarinas.sti.edu.ph' },
    { id: 5, classId: 1, studentNumber: '02000284914', firstName: 'Ethan James', lastName: 'Flores', aprilTagId: 105, attendanceRate: 65, prelimGrade: 68, status: 'Critical - Referred to Guidance', email: 'ethan.flores@dasmarinas.sti.edu.ph' },
    { id: 6, classId: 1, studentNumber: '02000284915', firstName: 'Gabrielle Faith', lastName: 'Gomez', aprilTagId: 106, attendanceRate: 96, prelimGrade: 94, status: 'Good Standing', email: 'gabrielle.gomez@dasmarinas.sti.edu.ph' },
    { id: 7, classId: 1, studentNumber: '02000284916', firstName: 'Hans Christian', lastName: 'Hernandez', aprilTagId: 107, attendanceRate: 78, prelimGrade: 74, status: 'Academic Warning', email: 'hans.hernandez@dasmarinas.sti.edu.ph' },
    { id: 8, classId: 1, studentNumber: '02000284917', firstName: 'Isabella Sofia', lastName: 'Jimenez', aprilTagId: 108, attendanceRate: 100, prelimGrade: 98, status: 'Honors Candidate', email: 'isabella.jimenez@dasmarinas.sti.edu.ph' }
  ],

  // Live Attendance Session
  activeAttendanceSession: {
    isOpen: true,
    classId: 1,
    subjectCode: 'IT405',
    section: 'BSIT-401',
    sessionDate: '2026-10-12',
    startTime: '08:00 AM',
    records: {
      1: { status: 'Present', scanTime: '08:02 AM', method: 'AprilTag #101' },
      2: { status: 'Present', scanTime: '08:04 AM', method: 'AprilTag #102' },
      3: { status: 'Absent', scanTime: null, method: 'Unscanned' },
      4: { status: 'Present', scanTime: '08:05 AM', method: 'AprilTag #104' },
      5: { status: 'Absent', scanTime: null, method: 'Unscanned' },
      6: { status: 'Present', scanTime: '08:01 AM', method: 'AprilTag #106' },
      7: { status: 'Late', scanTime: '08:18 AM', method: 'AprilTag #107' },
      8: { status: 'Present', scanTime: '07:58 AM', method: 'AprilTag #108' }
    }
  },

  referrals: [
    {
      id: 1,
      studentId: 5,
      studentName: 'Ethan James Flores',
      studentNumber: '02000284914',
      section: 'BSIT-401',
      subject: 'IT405',
      teacherName: 'Prof. Maria Santos',
      reason: 'Chronic Absenteeism',
      description: 'Student has accumulated 4 unexcused absences and missed 2 laboratory exercises.',
      urgency: 'High',
      status: 'Pending',
      dateFiled: '2026-10-10'
    },
    {
      id: 2,
      studentId: 3,
      studentName: 'Christian Dave Cruz',
      studentNumber: '02000284912',
      section: 'BSIT-401',
      subject: 'IT405',
      teacherName: 'Prof. Maria Santos',
      reason: 'Academic Deficiency',
      description: 'Prelim assessment score below passing threshold (71%). Needs tutorial intervention.',
      urgency: 'Medium',
      status: 'Under Review',
      dateFiled: '2026-10-11'
    }
  ],

  auditLogs: [
    { id: 1, createdAt: '2026-10-12 15:40:00', userName: 'System Administrator', roleName: 'Technical Administrator', action: 'Login', description: 'Successful administrator login.', ip: '127.0.0.1' },
    { id: 2, createdAt: '2026-10-12 15:10:00', userName: 'Maria Santos', roleName: 'Teacher', action: 'Attendance Session', description: 'Started attendance session for IT405 - BSIT-401.', ip: '127.0.0.1' },
    { id: 3, createdAt: '2026-10-12 14:20:00', userName: 'Alejandro Diaz', roleName: 'Academic Head', action: 'Academic Setup', description: 'Verified Academic Year 2026-2027 Prelim status.', ip: '127.0.0.1' },
    { id: 4, createdAt: '2026-10-11 11:30:00', userName: 'Mark Ramos', roleName: 'Disciplinary Officer', action: 'Case Review', description: 'Opened case review for student Ethan James Flores.', ip: '127.0.0.1' }
  ],

  backups: [
    { id: 1, filename: 'aprism_backup_20260814_212944.sql', size: '1.4 MB', createdAt: '2026-08-14 21:29:44', type: 'Full Database' },
    { id: 2, filename: 'aprism_backup_20260731_085659.sql', size: '1.2 MB', createdAt: '2026-07-31 08:56:59', type: 'Full Database' },
    { id: 3, filename: 'aprism_backup_20260730_074037.sql', size: '1.1 MB', createdAt: '2026-07-30 07:40:37', type: 'Full Database' }
  ],

  systemSettings: {
    sessionTimeoutMinutes: 70,
    passwordPolicyDays: 90,
    maxFailedLogins: 5,
    lockoutDurationMinutes: 15,
    autoBackupEnabled: true,
    backupRetentionDays: 30
  }
};
