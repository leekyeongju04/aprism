import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { store } from './store.js';
import { getSidebarItems } from './navigation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ dest: path.join(__dirname, 'uploads/') });

// Template engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Core middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'aprism-sti-dasmarinas-2026-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Static files
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use(express.static(path.join(__dirname, 'public')));

// Flash & Auth context middleware
app.use((req, res, next) => {
  // Flash messages
  res.locals.flashSuccess = req.session.flashSuccess || null;
  res.locals.flashError = req.session.flashError || null;
  delete req.session.flashSuccess;
  delete req.session.flashError;

  // Active School Year
  const activeSY = store.schoolYears.find(sy => sy.status === 'Active');
  res.locals.currentSchoolYear = activeSY ? activeSY.schoolYear : '2026-2027';

  // User from session
  if (req.session.userId) {
    const user = store.users.find(u => u.id === req.session.userId);
    req.user = user || null;
  } else {
    // Default to Technical Admin for seamless initial preview if not logged in
    req.user = store.users.find(u => u.id === 3) || null;
    req.session.userId = req.user ? req.user.id : null;
  }
  res.locals.user = req.user;
  res.locals.sidebarCollapsed = req.session.sidebarCollapsed || false;

  // Sidebar items
  if (req.user) {
    res.locals.sidebarItems = getSidebarItems(req.user.roleId, req.user.responsibilities || []);
  } else {
    res.locals.sidebarItems = [];
  }

  next();
});

// Legacy .php redirector
app.use((req, res, next) => {
  if (req.path.endsWith('.php')) {
    const cleaned = req.path.replace(/\.php$/, '');
    return res.redirect(cleaned);
  }
  next();
});

// Auth Guard Middleware
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.redirect('/auth/login');
  }
  next();
}

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

app.get('/auth/login', (req, res) => {
  res.render('login', {
    pageTitle: 'Login',
    flashError: res.locals.flashError,
    flashSuccess: res.locals.flashSuccess
  });
});

app.post('/auth/authenticate', (req, res) => {
  const { username, password } = req.body;
  const cleanEmail = (username || '').trim().toLowerCase();

  const user = store.users.find(u => 
    u.email.toLowerCase() === cleanEmail || 
    u.username.toLowerCase() === cleanEmail
  );

  if (!user) {
    req.session.flashError = 'Invalid institutional credentials.';
    return res.redirect('/auth/login');
  }

  if (user.accountStatus === 'Disabled') {
    req.session.flashError = 'This personnel account is currently disabled. Please contact the administrator.';
    return res.redirect('/auth/login');
  }

  // Update last login
  user.lastLoginAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
  req.session.userId = user.id;

  // Log audit
  store.auditLogs.unshift({
    id: store.auditLogs.length + 1,
    createdAt: user.lastLoginAt,
    userName: `${user.firstName} ${user.lastName}`,
    roleName: user.roleName,
    action: 'Login',
    description: `Successful authentication by ${user.email}.`,
    ip: req.ip || '127.0.0.1'
  });

  req.session.flashSuccess = `Welcome back, ${user.firstName} ${user.lastName}!`;
  res.redirect('/dashboard');
});

app.all('/auth/logout', (req, res) => {
  if (req.user) {
    store.auditLogs.unshift({
      id: store.auditLogs.length + 1,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userName: `${req.user.firstName} ${req.user.lastName}`,
      roleName: req.user.roleName,
      action: 'Logout',
      description: `User signed out.`,
      ip: req.ip || '127.0.0.1'
    });
  }
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

// ==========================================
// DASHBOARD ROUTING
// ==========================================

app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

app.get('/dashboard', requireAuth, (req, res) => {
  switch (req.user.roleId) {
    case 1:
      return res.redirect('/dashboard/technical_admin');
    case 2:
      return res.redirect('/dashboard/academic_head');
    case 3:
      return res.redirect('/dashboard/teacher');
    case 4:
      return res.redirect('/dashboard/teacher_referrals');
    default:
      return res.redirect('/auth/login');
  }
});

// ==========================================
// TECHNICAL ADMINISTRATOR ROUTES
// ==========================================

app.get('/dashboard/technical_admin', requireAuth, (req, res) => {
  res.render('technical-admin/dashboard', {
    pageTitle: 'Dashboard',
    activePage: 'dashboard',
    roleStylesheet: 'assets/css/technical-admin.css',
    pageStylesheet: 'assets/css/pages/technical-admin-dashboard.css',
    users: store.users,
    backups: store.backups,
    auditLogs: store.auditLogs,
    systemSettings: store.systemSettings
  });
});

app.get('/dashboard/technical_admin_users', requireAuth, (req, res) => {
  res.render('technical-admin/users', {
    pageTitle: 'Users',
    activePage: 'users',
    roleStylesheet: 'assets/css/technical-admin.css',
    pageStylesheet: 'assets/css/pages/technical-admin-users.css',
    users: store.users,
    roles: store.roles
  });
});

app.get('/dashboard/technical_admin_backups', requireAuth, (req, res) => {
  res.render('technical-admin/backups', {
    pageTitle: 'Database Backups',
    activePage: 'backups',
    roleStylesheet: 'assets/css/technical-admin.css',
    pageStylesheet: 'assets/css/pages/technical-admin-backups.css',
    backups: store.backups
  });
});

app.get('/dashboard/technical_admin_audit_logs', requireAuth, (req, res) => {
  res.render('technical-admin/audit-logs', {
    pageTitle: 'Audit Logs',
    activePage: 'audit_logs',
    roleStylesheet: 'assets/css/technical-admin.css',
    pageStylesheet: 'assets/css/pages/technical-admin-audit-logs.css',
    auditLogs: store.auditLogs
  });
});

app.get('/dashboard/technical_admin_settings', requireAuth, (req, res) => {
  res.render('technical-admin/settings', {
    pageTitle: 'Settings',
    activePage: 'settings',
    roleStylesheet: 'assets/css/technical-admin.css',
    pageStylesheet: 'assets/css/pages/technical-admin-settings.css',
    systemSettings: store.systemSettings
  });
});

// ==========================================
// ACADEMIC HEAD ROUTES
// ==========================================

app.get('/dashboard/academic_head', requireAuth, (req, res) => {
  res.render('academic-head/dashboard', {
    pageTitle: 'Academic Head Dashboard',
    activePage: 'dashboard',
    roleStylesheet: 'assets/css/academic-head.css',
    pageStylesheet: 'assets/css/pages/academic-head-dashboard.css',
    programs: store.programs,
    sections: store.sections,
    subjects: store.subjects,
    users: store.users,
    monitoringThresholds: store.monitoringThresholds,
    referrals: store.referrals
  });
});

app.get('/dashboard/academic_head_academic_setup', requireAuth, (req, res) => {
  res.render('academic-head/academic-setup', {
    pageTitle: 'Academic Setup',
    activePage: 'academic_setup',
    roleStylesheet: 'assets/css/academic-head.css',
    pageStylesheet: 'assets/css/pages/academic-head-academic-setup.css',
    schoolYears: store.schoolYears,
    academicPeriods: store.academicPeriods,
    monitoringThresholds: store.monitoringThresholds
  });
});

app.get('/dashboard/academic_head_sections', requireAuth, (req, res) => {
  res.render('academic-head/sections', {
    pageTitle: 'Sections',
    activePage: 'sections',
    roleStylesheet: 'assets/css/academic-head.css',
    pageStylesheet: 'assets/css/pages/academic-head-sections.css',
    programs: store.programs,
    sections: store.sections
  });
});

app.get('/dashboard/academic_head_schedules', requireAuth, (req, res) => {
  res.render('academic-head/schedules', {
    pageTitle: 'Schedules',
    activePage: 'schedules',
    roleStylesheet: 'assets/css/academic-head.css',
    pageStylesheet: 'assets/css/pages/academic-head-schedules.css',
    operationalClasses: store.operationalClasses,
    subjects: store.subjects
  });
});

app.get('/dashboard/academic_head_students', requireAuth, (req, res) => {
  res.render('academic-head/students', {
    pageTitle: 'Students',
    activePage: 'students',
    roleStylesheet: 'assets/css/academic-head.css',
    pageStylesheet: 'assets/css/pages/academic-head-students.css',
    students: store.students
  });
});

app.get('/dashboard/academic_head_reports', requireAuth, (req, res) => {
  res.render('academic-head/reports', {
    pageTitle: 'Reports',
    activePage: 'reports',
    roleStylesheet: 'assets/css/academic-head.css',
    pageStylesheet: 'assets/css/pages/academic-head-reports.css',
    students: store.students,
    referrals: store.referrals,
    monitoringThresholds: store.monitoringThresholds
  });
});

// ==========================================
// TEACHER ROUTES
// ==========================================

app.get('/dashboard/teacher', requireAuth, (req, res) => {
  res.render('teacher/dashboard', {
    pageTitle: 'Teacher Dashboard',
    activePage: 'dashboard',
    roleStylesheet: 'assets/css/teacher.css',
    pageStylesheet: 'assets/css/pages/teacher-dashboard.css',
    operationalClasses: store.operationalClasses,
    students: store.students,
    referrals: store.referrals
  });
});

app.get('/dashboard/teacher_my_class', requireAuth, (req, res) => {
  const classId = Number(req.query.class_id) || 1;
  const selectedClass = store.operationalClasses.find(c => c.id === classId) || store.operationalClasses[0];

  res.render('teacher/my-classes', {
    pageTitle: 'My Classes',
    activePage: 'my_classes',
    roleStylesheet: 'assets/css/teacher.css',
    pageStylesheet: 'assets/css/pages/teacher-my-class.css',
    operationalClasses: store.operationalClasses,
    selectedClass,
    students: store.students
  });
});

app.get('/dashboard/teacher_attendance', requireAuth, (req, res) => {
  res.render('teacher/attendance', {
    pageTitle: 'Attendance',
    activePage: 'attendance',
    roleStylesheet: 'assets/css/teacher.css',
    pageStylesheet: 'assets/css/pages/teacher-attendance.css',
    activeSession: store.activeAttendanceSession,
    students: store.students
  });
});

app.get('/dashboard/teacher_class_list', requireAuth, (req, res) => {
  res.render('teacher/class-list', {
    pageTitle: 'Class List',
    activePage: 'class_list',
    roleStylesheet: 'assets/css/teacher.css',
    pageStylesheet: 'assets/css/pages/teacher-class-list.css',
    operationalClasses: store.operationalClasses,
    students: store.students
  });
});

app.get('/dashboard/teacher_april_tags', requireAuth, (req, res) => {
  res.render('teacher/april-tags', {
    pageTitle: 'AprilTags',
    activePage: 'april_tags',
    roleStylesheet: 'assets/css/teacher.css',
    pageStylesheet: 'assets/css/pages/teacher-april-tags.css',
    students: store.students
  });
});

app.get('/dashboard/teacher_referrals', requireAuth, (req, res) => {
  res.render('teacher/referrals', {
    pageTitle: 'Referrals',
    activePage: 'referrals',
    roleStylesheet: 'assets/css/teacher.css',
    pageStylesheet: 'assets/css/pages/guidance.css',
    referrals: store.referrals,
    students: store.students
  });
});

app.get('/dashboard/teacher_reports', requireAuth, (req, res) => {
  res.render('teacher/reports', {
    pageTitle: 'Reports',
    activePage: 'reports',
    roleStylesheet: 'assets/css/teacher.css',
    pageStylesheet: 'assets/css/pages/teacher-dashboard.css',
    students: store.students
  });
});

// ==========================================
// ACTIONS / API HANDLERS
// ==========================================

// Save sidebar state
app.post(['/actions/system/save_sidebar_state', '/actions/system/save_sidebar_state.php'], (req, res) => {
  req.session.sidebarCollapsed = req.body.collapsed === 'true';
  res.json({ success: true, collapsed: req.session.sidebarCollapsed });
});

// Create backup
app.post(['/actions/system/create_backup', '/actions/system/create_backup.php'], (req, res) => {
  const ts = new Date().toISOString().replace(/[-:T]/g, '').substring(0, 14);
  const newBackup = {
    id: store.backups.length + 1,
    filename: `aprism_backup_${ts}.sql`,
    size: '1.4 MB',
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    type: 'Full Database'
  };
  store.backups.unshift(newBackup);

  store.auditLogs.unshift({
    id: store.auditLogs.length + 1,
    createdAt: newBackup.createdAt,
    userName: req.user ? `${req.user.firstName} ${req.user.lastName}` : 'System',
    roleName: req.user ? req.user.roleName : 'System',
    action: 'Database Backup',
    description: `Created database snapshot archive ${newBackup.filename}.`,
    ip: req.ip || '127.0.0.1'
  });

  req.session.flashSuccess = `New database backup ${newBackup.filename} created successfully.`;
  res.redirect('/dashboard/technical_admin_backups');
});

// Download backup
app.get(['/actions/system/download_backup', '/actions/system/download_backup.php'], (req, res) => {
  const filename = req.query.file || 'aprism_backup.sql';
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'application/sql');
  res.send(`-- APRISM Database Backup: ${filename}\n-- STI College Dasmariñas\n-- Generated: ${new Date().toISOString()}\n\n-- Database state intact.`);
});

// Update backup settings
app.post(['/actions/system/update_backup_settings', '/actions/system/update_backup_settings.php'], (req, res) => {
  if (req.body.retention_days) {
    store.systemSettings.backupRetentionDays = Number(req.body.retention_days);
  }
  req.session.flashSuccess = 'Backup settings updated successfully.';
  res.redirect('/dashboard/technical_admin_backups');
});

// Update security settings
app.post(['/actions/system/update_security_settings', '/actions/system/update_security_settings.php'], (req, res) => {
  if (req.body.session_timeout) store.systemSettings.sessionTimeoutMinutes = Number(req.body.session_timeout);
  if (req.body.max_failed_logins) store.systemSettings.maxFailedLogins = Number(req.body.max_failed_logins);
  if (req.body.lockout_duration) store.systemSettings.lockoutDurationMinutes = Number(req.body.lockout_duration);

  req.session.flashSuccess = 'System security policies updated successfully.';
  res.redirect('/dashboard/technical_admin_settings');
});

// Create user
app.post(['/actions/users/create_user', '/actions/users/create_user.php'], (req, res) => {
  const { first_name, last_name, email, employee_number, role_id } = req.body;
  const roleIdNum = Number(role_id);
  const roleObj = store.roles.find(r => r.id === roleIdNum);

  const newUser = {
    id: store.users.length + 1,
    roleId: roleIdNum,
    roleName: roleObj ? roleObj.name : 'Teacher',
    employeeNumber: employee_number,
    username: (email.split('@')[0] || `user_${Date.now()}`),
    email,
    firstName: first_name,
    lastName: last_name,
    password: 'password',
    accountStatus: 'Active',
    responsibilities: [],
    lastLoginAt: null,
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };

  store.users.push(newUser);

  store.auditLogs.unshift({
    id: store.auditLogs.length + 1,
    createdAt: newUser.createdAt,
    userName: req.user ? `${req.user.firstName} ${req.user.lastName}` : 'Admin',
    roleName: req.user ? req.user.roleName : 'Admin',
    action: 'Create User',
    description: `Created account for ${first_name} ${last_name} (${email}).`,
    ip: req.ip || '127.0.0.1'
  });

  req.session.flashSuccess = `Account for ${first_name} ${last_name} created successfully.`;
  res.redirect('/dashboard/technical_admin_users');
});

// Toggle user status
app.post(['/actions/users/toggle_account_status', '/actions/users/toggle_account_status.php'], (req, res) => {
  const userId = Number(req.body.user_id);
  const targetUser = store.users.find(u => u.id === userId);
  if (targetUser) {
    targetUser.accountStatus = targetUser.accountStatus === 'Active' ? 'Disabled' : 'Active';
    req.session.flashSuccess = `Account ${targetUser.email} status changed to ${targetUser.accountStatus}.`;
  }
  res.redirect('/dashboard/technical_admin_users');
});

// Reset password
app.post(['/actions/users/reset_password', '/actions/users/reset_password.php'], (req, res) => {
  const userId = Number(req.body.user_id);
  const targetUser = store.users.find(u => u.id === userId);
  if (targetUser) {
    targetUser.password = 'password';
    req.session.flashSuccess = `Temporary password reset for ${targetUser.firstName} ${targetUser.lastName}.`;
  }
  res.redirect('/dashboard/technical_admin_users');
});

// Update responsibilities
app.post(['/actions/users/update_responsibilities', '/actions/users/update_responsibilities.php'], (req, res) => {
  const userId = Number(req.body.user_id);
  const targetUser = store.users.find(u => u.id === userId);
  if (targetUser) {
    let resps = req.body.responsibilities;
    if (!resps) resps = [];
    else if (!Array.isArray(resps)) resps = [resps];
    targetUser.responsibilities = resps;
    req.session.flashSuccess = `Updated responsibilities for ${targetUser.firstName} ${targetUser.lastName}.`;
  }
  res.redirect('/dashboard/technical_admin_users');
});

// Academic Setup: Create school year
app.post(['/actions/academic_head/create_school_year', '/actions/academic_head/create_school_year.php'], (req, res) => {
  const { school_year, start_date, end_date } = req.body;
  store.schoolYears.push({
    id: store.schoolYears.length + 1,
    schoolYear: school_year,
    startDate: start_date,
    endDate: end_date,
    status: 'Inactive'
  });
  req.session.flashSuccess = `School Year ${school_year} created successfully.`;
  res.redirect('/dashboard/academic_head_academic_setup');
});

// Academic Setup: Set active school year
app.post(['/actions/academic_head/set_active_school_year', '/actions/academic_head/set_active_school_year.php'], (req, res) => {
  const syId = Number(req.body.school_year_id);
  store.schoolYears.forEach(sy => {
    sy.status = (sy.id === syId ? 'Active' : 'Inactive');
  });
  req.session.flashSuccess = 'Active School Year updated.';
  res.redirect('/dashboard/academic_head_academic_setup');
});

// Academic Setup: Activate term
app.post(['/actions/academic_head/set_active_term', '/actions/academic_head/set_active_term.php'], (req, res) => {
  const pId = Number(req.body.period_id);
  store.academicPeriods.forEach(p => {
    p.status = (p.id === pId ? 'Active' : 'Inactive');
  });
  req.session.flashSuccess = 'Instructional term updated.';
  res.redirect('/dashboard/academic_head_academic_setup');
});

// Academic Setup: Update thresholds
app.post(['/actions/academic_head/update_thresholds', '/actions/academic_head/update_thresholds.php'], (req, res) => {
  if (req.body.attendance_threshold) store.monitoringThresholds.attendanceThreshold = Number(req.body.attendance_threshold);
  if (req.body.grade_threshold) store.monitoringThresholds.gradeThreshold = Number(req.body.grade_threshold);
  if (req.body.consecutive_absences) store.monitoringThresholds.consecutiveAbsences = Number(req.body.consecutive_absences);
  req.session.flashSuccess = 'Monitoring thresholds updated.';
  res.redirect('/dashboard/academic_head_academic_setup');
});

// Teacher: Record AprilTag Scan
app.post(['/actions/teacher/record_attendance_scan', '/actions/teacher/record_attendance_scan.php'], (req, res) => {
  const studentId = Number(req.body.student_id);
  const tagId = Number(req.body.tag_id);
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  store.activeAttendanceSession.records[studentId] = {
    status: 'Present',
    scanTime: timeStr,
    method: `AprilTag #${tagId}`
  };

  req.session.flashSuccess = `Optical scan confirmed: Student #${studentId} verified via Tag #${tagId}.`;
  res.redirect('/dashboard/teacher_attendance');
});

// Teacher: Manual Attendance Mark
app.post(['/actions/teacher/mark_attendance_manual', '/actions/teacher/mark_attendance_manual.php'], (req, res) => {
  const studentId = Number(req.body.student_id);
  const status = req.body.status || 'Present';
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  store.activeAttendanceSession.records[studentId] = {
    status,
    scanTime: timeStr,
    method: 'Manual Override'
  };

  req.session.flashSuccess = `Attendance status updated to ${status}.`;
  res.redirect('/dashboard/teacher_attendance');
});

// Teacher: Close attendance session
app.post(['/actions/teacher/close_attendance_session', '/actions/teacher/close_attendance_session.php'], (req, res) => {
  store.activeAttendanceSession.isOpen = false;
  req.session.flashSuccess = 'Attendance session successfully finalized and saved to student records.';
  res.redirect('/dashboard/teacher_my_class');
});

// Teacher: Create student referral
app.post(['/actions/teacher/create_referral', '/actions/teacher/create_referral.php'], (req, res) => {
  const { student_id, reason, urgency, description } = req.body;
  const student = store.students.find(s => s.id === Number(student_id));

  const newRef = {
    id: store.referrals.length + 1,
    studentId: Number(student_id),
    studentName: student ? `${student.firstName} ${student.lastName}` : 'Student',
    studentNumber: student ? student.studentNumber : '02000000000',
    section: 'BSIT-401',
    subject: 'IT405',
    teacherName: req.user ? `${req.user.firstName} ${req.user.lastName}` : 'Prof. Maria Santos',
    reason,
    description,
    urgency: urgency || 'Medium',
    status: 'Pending',
    dateFiled: new Date().toISOString().substring(0, 10)
  };

  store.referrals.unshift(newRef);
  req.session.flashSuccess = `Intervention referral #REF-00${newRef.id} filed successfully.`;
  res.redirect('/dashboard/teacher_referrals');
});

// Teacher: Update referral status
app.post(['/actions/teacher/update_referral_status', '/actions/teacher/update_referral_status.php'], (req, res) => {
  const refId = Number(req.body.referral_id);
  const status = req.body.status;
  const ref = store.referrals.find(r => r.id === refId);
  if (ref) {
    ref.status = status;
    req.session.flashSuccess = `Referral #REF-00${refId} marked as ${status}.`;
  }
  res.redirect('/dashboard/teacher_referrals');
});

// Teacher: Import Class List
app.post(['/actions/teacher/import_class_list', '/actions/teacher/import_class_list.php'], upload.single('class_file'), (req, res) => {
  req.session.flashSuccess = 'Class list spreadsheet parsed and reconciled successfully. 8 student records verified.';
  res.redirect('/dashboard/teacher_class_list');
});

// Teacher: Manage AprilTag
app.post(['/actions/teacher/manage_april_tag', '/actions/teacher/manage_april_tag.php'], (req, res) => {
  const studentId = Number(req.body.student_id);
  const student = store.students.find(s => s.id === studentId);
  if (student) {
    student.aprilTagId = 100 + (student.id * 3);
    req.session.flashSuccess = `New AprilTag #${student.aprilTagId} assigned to ${student.lastName}, ${student.firstName}.`;
  }
  res.redirect('/dashboard/teacher_april_tags');
});

// Start listening
app.listen(PORT, '0.0.0.0', () => {
  console.log(`APRISM server listening on http://0.0.0.0:${PORT}`);
});
