import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { AdminSidebar, AdminTab } from './components/layout/AdminSidebar';
import { TeacherSidebar, TeacherTab } from './components/layout/TeacherSidebar';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { TeachersManager } from './pages/admin/TeachersManager';
import { StudentsManager } from './pages/admin/StudentsManager';
import { ScheduleManager } from './pages/admin/ScheduleManager';
import { AttendanceDeviceManager } from './pages/admin/AttendanceDeviceManager';
import { CanteenManager } from './pages/admin/CanteenManager';
import { UniformManager } from './pages/admin/UniformManager';
import { AnnouncementsManager } from './pages/admin/AnnouncementsManager';
import { SettingsManager } from './pages/admin/SettingsManager';

// Teacher Pages
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { ClassAttendance } from './pages/teacher/ClassAttendance';
import { HomeworkManager } from './pages/teacher/HomeworkManager';
import { Gradebook } from './pages/teacher/Gradebook';
import { TeacherSchedule } from './pages/teacher/TeacherSchedule';
import { StudentDirectory } from './pages/teacher/StudentDirectory';
import { TeacherCheckIn } from './pages/teacher/TeacherCheckIn';

import { LoginPage } from './pages/auth/LoginPage';

const MainLayout: React.FC = () => {
  const { role } = useAuth();
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [teacherTab, setTeacherTab] = useState<TeacherTab>('dashboard');

  return (
    <div className="flex h-screen flex-col bg-slate-50 overflow-hidden">
      {/* Top Global Navbar */}
      <Navbar />

      {/* Main Workspace: Sidebar + Dynamic Content */}
      <div className="flex flex-1 overflow-hidden">
        {role === 'ADMIN' ? (
          <>
            <AdminSidebar currentTab={adminTab} onSelectTab={setAdminTab} />
            <main className="flex-1 overflow-y-auto p-4 lg:p-8 animate-fade-in">
              {adminTab === 'dashboard' && <AdminDashboard onNavigate={setAdminTab} />}
              {adminTab === 'teachers' && <TeachersManager />}
              {adminTab === 'students' && <StudentsManager />}
              {adminTab === 'schedule' && <ScheduleManager />}
              {adminTab === 'attendance' && <AttendanceDeviceManager />}
              {adminTab === 'canteen' && <CanteenManager />}
              {adminTab === 'uniforms' && <UniformManager />}
              {adminTab === 'announcements' && <AnnouncementsManager />}
              {adminTab === 'settings' && <SettingsManager />}
            </main>
          </>
        ) : (
          <>
            <TeacherSidebar currentTab={teacherTab} onSelectTab={setTeacherTab} />
            <main className="flex-1 overflow-y-auto p-4 lg:p-8 animate-fade-in">
              {teacherTab === 'dashboard' && <TeacherDashboard onNavigate={setTeacherTab} />}
              {teacherTab === 'attendance' && <ClassAttendance />}
              {teacherTab === 'homework' && <HomeworkManager />}
              {teacherTab === 'gradebook' && <Gradebook />}
              {teacherTab === 'schedule' && <TeacherSchedule />}
              {teacherTab === 'students' && <StudentDirectory />}
              {teacherTab === 'checkin' && <TeacherCheckIn />}
            </main>
          </>
        )}
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <MainLayout />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
