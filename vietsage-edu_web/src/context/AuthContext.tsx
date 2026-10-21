import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, User, Teacher } from '../types';
import { INITIAL_TEACHERS } from '../data/mockData';
import { API_BASE_URL, ApiService } from '../services/api';

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  currentUser: User;
  currentTeacher: Teacher;
  setCurrentTeacher: (teacher: Teacher) => void;
  switchRole: (role: Role) => void;
  backendOnline: boolean;
  checkBackendStatus: () => Promise<void>;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const ADMIN_USER: User = {
  id: 'usr_admin',
  email: 'admin@vietsage.edu.vn',
  fullName: 'ThS. Lê Văn Đức (Hiệu trưởng)',
  role: 'ADMIN',
  phone: '0901 234 567',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('vietsage_auth_user') !== null;
  });

  const [role, setRole] = useState<Role>(() => {
    const savedUser = localStorage.getItem('vietsage_auth_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role) return parsed.role as Role;
      } catch (_) {}
    }
    return (localStorage.getItem('vietsage_current_role') as Role) || 'ADMIN';
  });

  const [currentTeacher, setCurrentTeacher] = useState<Teacher>(() => {
    const savedUser = localStorage.getItem('vietsage_auth_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const match = INITIAL_TEACHERS.find(t => t.id === parsed.id || t.email === parsed.email);
        if (match) return match;
      } catch (_) {}
    }
    return INITIAL_TEACHERS[0];
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUser = localStorage.getItem('vietsage_auth_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser) as User;
      } catch (_) {}
    }
    return ADMIN_USER;
  });

  const [backendOnline, setBackendOnline] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('vietsage_current_role', role);
  }, [role]);

  const checkBackendStatus = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, {
        signal: AbortSignal.timeout(1500)
      });
      setBackendOnline(res.ok);
    } catch {
      setBackendOnline(false);
    }
  };

  useEffect(() => {
    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const switchRole = (newRole: Role) => {
    // Nếu tài khoản hiện tại là Giáo viên và không phải Admin thì không thể vào Cổng Admin
    if (currentUser.role === 'TEACHER' && newRole === 'ADMIN') {
      alert('Tài khoản của bạn là Giáo Viên, không có quyền quản trị Cổng Admin. Vui lòng đăng nhập bằng tài khoản Quản Trị Viên.');
      return;
    }
    setRole(newRole);
  };

  const login = async (identifier: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const idClean = identifier.trim();

    // 1. Thử đăng nhập qua Backend API nếu có kết nối
    try {
      const res = await ApiService.login({
        identifier: idClean,
        email: idClean.includes('@') ? idClean : undefined,
        phone: !idClean.includes('@') ? idClean : undefined,
        password: password.trim()
      });

      if (res.ok && res.data?.success) {
        const u = res.data.data.user;
        const normalizedRole = (u.role || '').toUpperCase();

        // Kiểm tra phân quyền: Phụ huynh KHÔNG ĐƯỢC VÀO WEB
        if (normalizedRole === 'PARENT') {
          return {
            success: false,
            message: 'Tài khoản Phụ huynh chỉ có thể đăng nhập trên ứng dụng di động (VietSage Edu App). Cổng Web chỉ dành cho Quản trị viên và Giáo viên.'
          };
        }

        if (normalizedRole === 'ADMIN') {
          setRole('ADMIN');
          setCurrentUser(ADMIN_USER);
          setIsAuthenticated(true);
          localStorage.setItem('vietsage_auth_user', JSON.stringify(ADMIN_USER));
          localStorage.setItem('vietsage_current_role', 'ADMIN');
          return { success: true };
        }

        if (normalizedRole === 'TEACHER') {
          const matchedTeacher = INITIAL_TEACHERS.find(t => 
            t.email.toLowerCase() === u.email?.toLowerCase() ||
            t.phone.replace(/\s+/g, '') === u.phone?.replace(/\s+/g, '')
          ) || INITIAL_TEACHERS[0];

          const teacherUser: User = {
            id: matchedTeacher.id,
            email: u.email || matchedTeacher.email,
            fullName: u.fullName || matchedTeacher.fullName,
            role: 'TEACHER',
            phone: u.phone || matchedTeacher.phone,
            avatar: matchedTeacher.avatar
          };

          setRole('TEACHER');
          setCurrentTeacher(matchedTeacher);
          setCurrentUser(teacherUser);
          setIsAuthenticated(true);
          localStorage.setItem('vietsage_auth_user', JSON.stringify(teacherUser));
          localStorage.setItem('vietsage_current_role', 'TEACHER');
          return { success: true };
        }
      }

      if (res.status === 403 || (res.data && !res.data.success)) {
        return {
          success: false,
          message: res.data?.message || 'Quyền truy cập bị từ chối: Tài khoản này không được phép đăng nhập Cổng Web.'
        };
      }
    } catch (_) {
      // Fallback xuống offline demo
    }

    // 2. Chế độ Mock / Offline Fallback (áp dụng khi backend offline)
    const lowerId = idClean.toLowerCase();

    // A. Kiểm tra nếu là tài khoản Phụ huynh -> CHẶN
    const isParentAccount =
      lowerId === 'crush001' ||
      lowerId === '0988123456' ||
      lowerId === '0988001001' ||
      lowerId === '0912888777' ||
      lowerId.startsWith('ph_') ||
      lowerId.startsWith('hs_') ||
      /^[0-9+ ]{8,15}$/.test(lowerId);

    if (isParentAccount) {
      return {
        success: false,
        message: 'Tài khoản Phụ huynh chỉ có thể đăng nhập trên ứng dụng di động (VietSage Edu App). Cổng Web chỉ dành cho Quản trị viên và Giáo viên.'
      };
    }

    // B. Kiểm tra nếu là Admin
    if (lowerId === 'admin@vietsage.edu.vn' || lowerId === 'admin') {
      if (password === 'AdminPassword_123!' || password === '12345678' || password.length >= 6) {
        setRole('ADMIN');
        setCurrentUser(ADMIN_USER);
        setIsAuthenticated(true);
        localStorage.setItem('vietsage_auth_user', JSON.stringify(ADMIN_USER));
        localStorage.setItem('vietsage_current_role', 'ADMIN');
        return { success: true };
      } else {
        return { success: false, message: 'Mật khẩu quản trị viên không chính xác.' };
      }
    }

    // C. Kiểm tra nếu là Giáo viên
    const matchedTeacher = INITIAL_TEACHERS.find(t => 
      t.email.toLowerCase() === lowerId ||
      t.email.toLowerCase().replace('.', '') === lowerId.replace('.', '') ||
      t.code.toLowerCase() === lowerId ||
      t.phone.replace(/\s+/g, '') === lowerId.replace(/\s+/g, '') ||
      (lowerId === 'giaovien' && t.id === 'tc_mn_01')
    );

    if (matchedTeacher) {
      if (password === '12345678' || password.length >= 6) {
        const teacherUser: User = {
          id: matchedTeacher.id,
          email: matchedTeacher.email,
          fullName: matchedTeacher.fullName,
          role: 'TEACHER',
          phone: matchedTeacher.phone,
          avatar: matchedTeacher.avatar
        };
        setRole('TEACHER');
        setCurrentTeacher(matchedTeacher);
        setCurrentUser(teacherUser);
        setIsAuthenticated(true);
        localStorage.setItem('vietsage_auth_user', JSON.stringify(teacherUser));
        localStorage.setItem('vietsage_current_role', 'TEACHER');
        return { success: true };
      } else {
        return { success: false, message: 'Mật khẩu giáo viên không chính xác.' };
      }
    }

    return {
      success: false,
      message: 'Email hoặc mật khẩu không chính xác. Quý phụ huynh vui lòng sử dụng ứng dụng di động.'
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('vietsage_auth_user');
    localStorage.removeItem('vietsage_token');
    setRole('ADMIN');
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        currentTeacher,
        setCurrentTeacher,
        switchRole,
        backendOnline,
        checkBackendStatus,
        isAuthenticated,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
