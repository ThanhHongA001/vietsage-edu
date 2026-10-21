import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertTriangle,
  Smartphone,
  Info,
  Server,
  ArrowRight
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, backendOnline, checkBackendStatus } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isParentBlocked, setIsParentBlocked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ tài khoản và mật khẩu.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setIsParentBlocked(false);

    const result = await login(identifier.trim(), password);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.message || 'Đăng nhập không thành công.');
      if (
        result.message?.toLowerCase().includes('phụ huynh') ||
        result.message?.toLowerCase().includes('di động') ||
        result.message?.toLowerCase().includes('app')
      ) {
        setIsParentBlocked(true);
      }
    }
  };

  const handleQuickLogin = (userType: 'admin' | 'teacher_cs' | 'teacher_mn' | 'parent') => {
    setErrorMessage(null);
    setIsParentBlocked(false);

    if (userType === 'admin') {
      setIdentifier('admin@vietsage.edu.vn');
      setPassword('AdminPassword_123!');
      login('admin@vietsage.edu.vn', 'AdminPassword_123!');
    } else if (userType === 'teacher_cs') {
      setIdentifier('hang.vt@vietsage.edu.vn');
      setPassword('12345678');
      login('hang.vt@vietsage.edu.vn', '12345678');
    } else if (userType === 'teacher_mn') {
      setIdentifier('chau.dm@vietsage.edu.vn');
      setPassword('12345678');
      login('chau.dm@vietsage.edu.vn', '12345678');
    } else if (userType === 'parent') {
      setIdentifier('0988123456');
      setPassword('12345678');
      // Thử đăng nhập bằng tài khoản phụ huynh để kích hoạt chặn
      login('0988123456', '12345678').then((res) => {
        if (!res.success) {
          setErrorMessage(res.message || 'Tài khoản Phụ huynh chỉ có thể đăng nhập trên ứng dụng di động (VietSage Edu App).');
          setIsParentBlocked(true);
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 text-white shadow-xl shadow-blue-500/25 ring-1 ring-white/20 mb-4 animate-fade-in">
            <GraduationCap className="h-9 w-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            VietSage <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">Edu</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1.5 font-medium">
            Cổng Thông Tin & Quản Lý Giáo Dục Liên Cấp
          </p>
        </div>

        {/* Access Policy Pill */}
        <div className="mb-4 rounded-xl bg-blue-950/60 border border-blue-500/30 p-3.5 backdrop-blur-sm shadow-inner">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-blue-300 uppercase tracking-wider block mb-0.5">
                Phân quyền truy cập hệ thống
              </span>
              <p className="text-slate-300 leading-relaxed">
                Cổng Web dành riêng cho <strong className="text-white">Quản Trị Viên</strong> &amp; <strong className="text-white">Giáo Viên</strong>.
              </p>
              <div className="mt-1.5 flex items-center gap-1.5 text-amber-300 font-medium">
                <Smartphone className="h-3.5 w-3.5 shrink-0" />
                <span>Phụ huynh chỉ truy cập qua ứng dụng di động (App)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error / Blocked Banner */}
        {errorMessage && (
          <div
            className={`mb-4 rounded-xl p-4 border animate-shake transition-all ${
              isParentBlocked
                ? 'bg-amber-950/70 border-amber-500/50 text-amber-200'
                : 'bg-red-950/70 border-red-500/50 text-red-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {isParentBlocked ? (
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                  <Smartphone className="h-5 w-5" />
                </div>
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs flex-1">
                <span className="font-bold uppercase tracking-wider block mb-1">
                  {isParentBlocked ? 'Từ Chối Quyền Truy Cập Web' : 'Lỗi Đăng Nhập'}
                </span>
                <p className="leading-relaxed opacity-95">{errorMessage}</p>
                {isParentBlocked && (
                  <div className="mt-2.5 pt-2.5 border-t border-amber-500/20 text-[11px] text-amber-300/90 flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 shrink-0" />
                    <span>Vui lòng tải hoặc mở ứng dụng VietSage Edu trên điện thoại.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Identifier input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tài khoản / Email / Mã Giáo viên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@vietsage.edu.vn hoặc chau.dm@vietsage.edu.vn"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Đăng Nhập Cổng Web</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="mt-6 pt-6 border-t border-slate-700/60">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
              Tài Khoản Mẫu Trực Tiếp
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-700/40 hover:bg-slate-700 border border-slate-600/40 text-left transition group cursor-pointer"
              >
                <div className="p-1.5 rounded-md bg-blue-500/20 text-blue-400 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">Hiệu Trưởng</div>
                  <div className="text-[10px] text-slate-400">Cổng Quản Trị</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('teacher_cs')}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-700/40 hover:bg-slate-700 border border-slate-600/40 text-left transition group cursor-pointer"
              >
                <div className="p-1.5 rounded-md bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">GV Vũ Thúy Hằng</div>
                  <div className="text-[10px] text-slate-400">Khối THCS</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('teacher_mn')}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-700/40 hover:bg-slate-700 border border-slate-600/40 text-left transition group cursor-pointer"
              >
                <div className="p-1.5 rounded-md bg-sky-500/20 text-sky-400 group-hover:scale-105 transition-transform">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">GV Đặng Minh Châu</div>
                  <div className="text-[10px] text-slate-400">Khối Mầm Non</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('parent')}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-950/30 hover:bg-amber-900/40 border border-amber-600/40 text-left transition group cursor-pointer"
                title="Bấm để kiểm tra tính năng chặn phụ huynh trên Web"
              >
                <div className="p-1.5 rounded-md bg-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-300">Phụ Huynh (Test Chặn)</div>
                  <div className="text-[10px] text-amber-400/80">Chỉ cho phép trên App</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info & API status */}
        <div className="mt-6 flex items-center justify-between text-xs text-slate-500 px-2">
          <span>VietSage Edu &copy; 2026</span>
          <button
            onClick={() => checkBackendStatus()}
            className="flex items-center gap-1.5 hover:text-slate-300 transition"
          >
            <Server className="h-3 w-3" />
            <span>{backendOnline ? 'API: Online' : 'Chế độ CSDL Demo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
