export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) ||
  'https://vgv2316k-1000.asse.devtunnels.ms/api/v1';

export interface HealthResponse {
  status: string;
  database?: string;
  timestamp?: string;
  service?: string;
}

export const ApiService = {
  async checkHealth(): Promise<{ isOnline: boolean; data?: HealthResponse }> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const data = await res.json();
        return { isOnline: true, data };
      }
      return { isOnline: false };
    } catch {
      return { isOnline: false };
    }
  },

  // Attendance & HN212
  async getAttendanceList(limit = 100, className?: string) {
    try {
      const url = new URL(`${API_BASE_URL}/attendance`);
      url.searchParams.set('limit', String(limit));
      if (className && className !== 'ALL') url.searchParams.set('className', className);

      const res = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
      return null;
    } catch {
      return null;
    }
  },

  async sendHN212Event(eventData: {
    eventId: string;
    deviceCode: string;
    userId?: string;
    occurredAt: string;
    method?: string;
    direction?: string;
  }) {
    try {
      const res = await fetch(`${API_BASE_URL}/hn212/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-device-api-key': 'dev-hn212-key',
        },
        body: JSON.stringify(eventData),
        signal: AbortSignal.timeout(3000),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async saveClassAttendance(body: {
    className: string;
    date: string;
    records: Array<{
      studentId: string;
      studentCode: string;
      studentName: string;
      status: 'PRESENT' | 'LATE' | 'EXCUSED' | 'UNEXCUSED';
      checkInTime?: string;
      note?: string;
    }>;
  }) {
    try {
      const res = await fetch(`${API_BASE_URL}/attendance/class`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Teachers
  async getTeachers() {
    try {
      const res = await fetch(`${API_BASE_URL}/teachers`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  // Students
  async getStudents(className?: string) {
    try {
      const url = new URL(`${API_BASE_URL}/students`);
      if (className && className !== 'ALL') url.searchParams.set('className', className);
      const res = await fetch(url.toString());
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  // Devices
  async getDevices() {
    try {
      const res = await fetch(`${API_BASE_URL}/devices`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  // Schedules
  async getSchedules(className?: string) {
    try {
      const url = new URL(`${API_BASE_URL}/schedules`);
      if (className && className !== 'ALL') url.searchParams.set('className', className);
      const res = await fetch(url.toString());
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  // Grades
  async getGrades(className?: string, subject?: string) {
    try {
      const url = new URL(`${API_BASE_URL}/grades`);
      if (className && className !== 'ALL') url.searchParams.set('className', className);
      if (subject && subject !== 'ALL') url.searchParams.set('subject', subject);
      const res = await fetch(url.toString());
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  async saveGrades(grades: any[]) {
    try {
      const res = await fetch(`${API_BASE_URL}/grades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(grades),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Homework
  async getHomeworks(className?: string) {
    try {
      const url = new URL(`${API_BASE_URL}/homework`);
      if (className && className !== 'ALL') url.searchParams.set('className', className);
      const res = await fetch(url.toString());
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  // Canteen
  async getCanteenMenu() {
    try {
      const res = await fetch(`${API_BASE_URL}/canteen/menu`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  // Uniforms
  async getUniforms() {
    try {
      const res = await fetch(`${API_BASE_URL}/uniforms`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  // Announcements
  async getAnnouncements() {
    try {
      const res = await fetch(`${API_BASE_URL}/announcements`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  // Dashboard
  async getDashboardSummary() {
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/summary`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  // Authentication
  async login(credentials: { email?: string; username?: string; identifier?: string; phone?: string; password: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-platform': 'web',
        },
        body: JSON.stringify({
          ...credentials,
          clientPlatform: 'web',
        }),
      });
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    } catch (err: any) {
      return { ok: false, status: 0, data: null, error: err.message || 'Lỗi kết nối máy chủ' };
    }
  },
};
