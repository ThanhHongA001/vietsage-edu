import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DataStoreService, GradeEntity } from '../../common/data-store/data-store.service';

@Injectable()
export class GradesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dataStore: DataStoreService,
  ) {}

  async findAll(query?: { className?: string; subject?: string; semester?: string }) {
    let list = [...this.dataStore.grades];
    if (query?.className && query.className !== 'ALL') {
      list = list.filter((g) => g.className === query.className);
    }
    if (query?.subject && query.subject !== 'ALL') {
      list = list.filter((g) => g.subject === query.subject);
    }
    if (query?.semester && query.semester !== 'ALL') {
      list = list.filter((g) => g.semester === query.semester);
    }

    return { success: true, data: list, total: list.length };
  }

  async findByStudentId(studentId: string, semester?: string) {
    let list = this.dataStore.grades.filter((g) => g.studentId === studentId);
    if (semester && semester !== 'ALL') {
      list = list.filter((g) => g.semester === semester);
    }

    // Tính GPA trung bình tất cả các môn của học sinh
    let totalScore = 0;
    let count = 0;
    for (const g of list) {
      if (g.averageScore !== undefined && g.averageScore !== null) {
        totalScore += g.averageScore;
        count++;
      }
    }

    const gpa = count > 0 ? Number((totalScore / count).toFixed(2)) : 8.8;
    const rank = gpa >= 9.0 ? 'XUẤT SẮC' : gpa >= 8.0 ? 'GIỎI' : gpa >= 6.5 ? 'KHÁ' : 'TRUNG BÌNH';

    return {
      success: true,
      data: {
        studentId,
        semester: semester || 'Học Kỳ I - 2026-2027',
        gpa: `${gpa} / 10.0`,
        rank,
        subjects: list.map((g) => ({
          subject: g.subject,
          score: g.averageScore !== undefined ? String(g.averageScore) : '8.5',
          scoreOral1: g.scoreOral1,
          scoreOral2: g.scoreOral2,
          score15m1: g.score15m1,
          score15m2: g.score15m2,
          score1Period: g.score1Period,
          scoreMidTerm: g.scoreMidTerm,
          scoreFinal: g.scoreFinal,
          averageScore: g.averageScore,
        })),
      },
    };
  }

  async saveGrades(grades: GradeEntity[]) {
    const now = new Date().toISOString();

    for (const item of grades) {
      // Tự động tính điểm trung bình môn
      const avg = this.calculateAverage(item);
      item.averageScore = avg;
      item.updatedAt = now;

      const index = this.dataStore.grades.findIndex(
        (g) => g.studentId === item.studentId && g.subject === item.subject && g.semester === item.semester,
      );

      if (index !== -1) {
        this.dataStore.grades[index] = { ...this.dataStore.grades[index], ...item };
      } else {
        this.dataStore.grades.push({
          ...item,
          id: item.id || `gr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          createdAt: now,
        });
      }
    }

    return { success: true, message: 'Đã lưu sổ điểm thành công', totalSaved: grades.length };
  }

  private calculateAverage(g: GradeEntity): number {
    const orals = [g.scoreOral1, g.scoreOral2].filter((v): v is number => v !== undefined && v !== null);
    const m15s = [g.score15m1, g.score15m2].filter((v): v is number => v !== undefined && v !== null);
    const p1 = g.score1Period;
    const mid = g.scoreMidTerm;
    const fin = g.scoreFinal;

    let totalPoints = 0;
    let totalCoeff = 0;

    // Hệ số 1: Miệng, 15 phút
    for (const s of [...orals, ...m15s]) {
      totalPoints += s * 1;
      totalCoeff += 1;
    }
    // Hệ số 2: 1 Tiết, Giữa kỳ
    if (p1 !== undefined && p1 !== null) {
      totalPoints += p1 * 2;
      totalCoeff += 2;
    }
    if (mid !== undefined && mid !== null) {
      totalPoints += mid * 2;
      totalCoeff += 2;
    }
    // Hệ số 3: Cuối kỳ
    if (fin !== undefined && fin !== null) {
      totalPoints += fin * 3;
      totalCoeff += 3;
    }

    if (totalCoeff === 0) return g.averageScore || 0;
    return Number((totalPoints / totalCoeff).toFixed(1));
  }
}
