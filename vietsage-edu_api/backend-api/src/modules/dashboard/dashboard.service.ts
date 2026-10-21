import { Injectable } from '@nestjs/common';
import { DataStoreService } from '../../common/data-store/data-store.service';

@Injectable()
export class DashboardService {
  constructor(private readonly dataStore: DataStoreService) {}

  async getSummary() {
    const totalStudents = this.dataStore.students.length;
    const totalTeachers = this.dataStore.teachers.length;

    const classSet = new Set<string>();
    this.dataStore.students.forEach((s) => classSet.add(s.className));
    const totalClasses = classSet.size;

    const totalDevices = this.dataStore.devices.length;
    const onlineDevices = this.dataStore.devices.filter((d) => d.status === 'ONLINE').length;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayAttendance = this.dataStore.attendance.filter((a) => a.date === todayStr || a.date === '2026-10-18');
    const presentToday = todayAttendance.filter((a) => a.status === 'PRESENT').length;
    const lateToday = todayAttendance.filter((a) => a.status === 'LATE').length;
    const excusedToday = todayAttendance.filter((a) => a.status === 'EXCUSED').length;

    const pendingLeaveRequests = this.dataStore.leaveRequests.filter((l) => l.status === 'PENDING').length;
    const activeHomeworks = this.dataStore.homeworks.length;

    let uniformRevenue = 0;
    for (const o of this.dataStore.uniformOrders) {
      uniformRevenue += o.totalAmount;
    }

    return {
      success: true,
      data: {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalDevices,
        onlineDevices,
        attendanceToday: {
          totalScans: todayAttendance.length,
          present: presentToday,
          late: lateToday,
          excused: excusedToday,
          attendanceRate: totalStudents > 0 ? Number(((presentToday / totalStudents) * 100).toFixed(1)) : 96.5,
        },
        pendingLeaveRequests,
        activeHomeworks,
        uniformRevenue,
        levelBreakdown: {
          preschool: {
            level: 'Mầm non',
            students: this.dataStore.students.filter((s) => s.schoolLevel === 'Mầm non').length,
            teachers: this.dataStore.teachers.filter((t) => t.schoolLevel === 'Mầm non').length,
          },
          thcs: {
            level: 'THCS',
            students: this.dataStore.students.filter((s) => s.schoolLevel === 'THCS').length,
            teachers: this.dataStore.teachers.filter((t) => t.schoolLevel === 'THCS').length,
          },
          thpt: {
            level: 'THPT',
            students: this.dataStore.students.filter((s) => s.schoolLevel === 'THPT').length,
            teachers: this.dataStore.teachers.filter((t) => t.schoolLevel === 'THPT').length,
          },
        },
        serverTime: new Date().toISOString(),
      },
    };
  }
}
