import {
  Teacher,
  Student,
  AttendanceRecord,
  DeviceHN212,
  Homework,
  CanteenMeal,
  UniformItem,
  Announcement,
  ClassScheduleItem,
  GradeEntry
} from '../types';
import {
  INITIAL_TEACHERS,
  INITIAL_STUDENTS,
  INITIAL_DEVICES_HN212,
  INITIAL_ATTENDANCE,
  INITIAL_HOMEWORKS,
  INITIAL_SCHEDULE,
  INITIAL_GRADES,
  INITIAL_CANTEEN_MENU,
  INITIAL_UNIFORMS,
  INITIAL_ANNOUNCEMENTS
} from '../data/mockData';

const KEYS = {
  TEACHERS: 'vietsage_teachers_v2',
  STUDENTS: 'vietsage_students_v2',
  DEVICES: 'vietsage_devices_v2',
  ATTENDANCE: 'vietsage_attendance_v2',
  HOMEWORKS: 'vietsage_homeworks_v2',
  SCHEDULE: 'vietsage_schedule_v2',
  GRADES: 'vietsage_grades_v2',
  CANTEEN: 'vietsage_canteen_v2',
  UNIFORMS: 'vietsage_uniforms_v2',
  ANNOUNCEMENTS: 'vietsage_announcements_v2'
};

function load<T>(key: string, initial: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initial;
  } catch (e) {
    console.error(`Error loading key ${key}:`, e);
    return initial;
  }
}

function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving key ${key}:`, e);
  }
}

export const StorageService = {
  getTeachers: (): Teacher[] => load(KEYS.TEACHERS, INITIAL_TEACHERS),
  saveTeachers: (data: Teacher[]) => save(KEYS.TEACHERS, data),

  getStudents: (): Student[] => load(KEYS.STUDENTS, INITIAL_STUDENTS),
  saveStudents: (data: Student[]) => save(KEYS.STUDENTS, data),

  getDevices: (): DeviceHN212[] => load(KEYS.DEVICES, INITIAL_DEVICES_HN212),
  saveDevices: (data: DeviceHN212[]) => save(KEYS.DEVICES, data),

  getAttendance: (): AttendanceRecord[] => load(KEYS.ATTENDANCE, INITIAL_ATTENDANCE),
  saveAttendance: (data: AttendanceRecord[]) => save(KEYS.ATTENDANCE, data),

  getHomeworks: (): Homework[] => load(KEYS.HOMEWORKS, INITIAL_HOMEWORKS),
  saveHomeworks: (data: Homework[]) => save(KEYS.HOMEWORKS, data),

  getSchedule: (): ClassScheduleItem[] => load(KEYS.SCHEDULE, INITIAL_SCHEDULE),
  saveSchedule: (data: ClassScheduleItem[]) => save(KEYS.SCHEDULE, data),

  getGrades: (): GradeEntry[] => load(KEYS.GRADES, INITIAL_GRADES),
  saveGrades: (data: GradeEntry[]) => save(KEYS.GRADES, data),

  getCanteen: (): CanteenMeal[] => load(KEYS.CANTEEN, INITIAL_CANTEEN_MENU),
  saveCanteen: (data: CanteenMeal[]) => save(KEYS.CANTEEN, data),

  getUniforms: (): UniformItem[] => load(KEYS.UNIFORMS, INITIAL_UNIFORMS),
  saveUniforms: (data: UniformItem[]) => save(KEYS.UNIFORMS, data),

  getAnnouncements: (): Announcement[] => load(KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS),
  saveAnnouncements: (data: Announcement[]) => save(KEYS.ANNOUNCEMENTS, data),

  resetAll: () => {
    localStorage.clear();
    window.location.reload();
  }
};
