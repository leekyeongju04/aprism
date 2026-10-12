// Navigation helper mirroring aprism-main/includes/navigation/sidebar_items.php

export function getSidebarItems(roleId, responsibilities = []) {
  const role = Number(roleId);

  // Technical Administrator (Role 1)
  if (role === 1) {
    return [
      { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', url: '/dashboard/technical_admin' },
      { id: 'users', label: 'Users', icon: 'users', url: '/dashboard/technical_admin_users' },
      { id: 'audit_logs', label: 'Audit Logs', icon: 'scroll-text', url: '/dashboard/technical_admin_audit_logs' },
      { id: 'backups', label: 'Database Backups', icon: 'database-backup', url: '/dashboard/technical_admin_backups' },
      { id: 'settings', label: 'Settings', icon: 'settings', url: '/dashboard/technical_admin_settings' },
    ];
  }

  // Academic Head (Role 2)
  if (role === 2) {
    return [
      { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', url: '/dashboard/academic_head', enabled: true },
      { id: 'academic_setup', label: 'Academic Setup', icon: 'clipboard-list', url: '/dashboard/academic_head_academic_setup', enabled: true },
      { id: 'sections', label: 'Sections', icon: 'layers-3', url: '/dashboard/academic_head_sections', enabled: true },
      { id: 'schedules', label: 'Schedules', icon: 'calendar-days', url: '/dashboard/academic_head_schedules', enabled: true },
      { id: 'students', label: 'Students', icon: 'users', url: '/dashboard/academic_head_students', enabled: true },
      { id: 'reports', label: 'Reports', icon: 'file-text', url: '/dashboard/academic_head_reports', enabled: true },
    ];
  }

  // Teacher (Role 3)
  if (role === 3) {
    const items = [
      { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', url: '/dashboard/teacher', enabled: true },
      { id: 'my_classes', label: 'My Classes', icon: 'book-open', url: '/dashboard/teacher_my_class', enabled: true },
      { id: 'attendance', label: 'Attendance', icon: 'users', url: '/dashboard/teacher_attendance', enabled: true },
      { id: 'class_list', label: 'Class List', icon: 'file-up', url: '/dashboard/teacher_class_list', enabled: true },
      { id: 'april_tags', label: 'AprilTags', icon: 'tag', url: '/dashboard/teacher_april_tags', enabled: true },
      { id: 'referrals', label: 'Referrals', icon: 'triangle-alert', url: '/dashboard/teacher_referrals', enabled: true },
      { id: 'reports', label: 'Reports', icon: 'file-text', url: '/dashboard/teacher_reports', enabled: true },
    ];

    if (responsibilities.includes('Adviser')) {
      items.push({
        type: 'section',
        id: 'adviser',
        label: 'Adviser',
        items: [
          { id: 'advisory_monitoring', label: 'Advisory Monitoring', icon: 'layout-dashboard', url: '/dashboard/teacher_my_class', enabled: true },
          { id: 'advisory_students', label: 'Advisory Students', icon: 'users', url: '/dashboard/academic_head_students', enabled: true },
          { id: 'risk_alerts', label: 'Risk Alerts', icon: 'triangle-alert', url: '/dashboard/teacher_referrals', enabled: true },
        ]
      });
    }

    if (responsibilities.includes('Program Head')) {
      items.push({
        type: 'section',
        id: 'program_head',
        label: 'Program Head',
        items: [
          { id: 'program_overview', label: 'Program Overview', icon: 'layout-dashboard', url: '/dashboard/academic_head', enabled: true },
          { id: 'faculty_overview', label: 'Faculty Overview', icon: 'users', url: '/dashboard/academic_head_sections', enabled: true },
        ]
      });
    }

    return items;
  }

  // Disciplinary Officer (Role 4)
  if (role === 4) {
    return [
      { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', url: '/dashboard/teacher_referrals', enabled: true },
      { id: 'referrals', label: 'Intervention Cases', icon: 'triangle-alert', url: '/dashboard/teacher_referrals', enabled: true },
      { id: 'students', label: 'Student Records', icon: 'users', url: '/dashboard/academic_head_students', enabled: true },
      { id: 'reports', label: 'Case Reports', icon: 'file-text', url: '/dashboard/academic_head_reports', enabled: true },
    ];
  }

  return [];
}
