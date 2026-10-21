import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DataStoreService, HomeworkEntity, HomeworkSubmissionEntity } from '../../common/data-store/data-store.service';

@Injectable()
export class HomeworkService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dataStore: DataStoreService,
  ) {}

  async findAll(query?: { className?: string; subject?: string; teacherId?: string; studentId?: string }) {
    let list = [...this.dataStore.homeworks];
    if (query?.className && query.className !== 'ALL') {
      list = list.filter((h) => h.className === query.className);
    }
    if (query?.subject && query.subject !== 'ALL') {
      list = list.filter((h) => h.subject === query.subject);
    }
    if (query?.teacherId) {
      list = list.filter((h) => h.teacherId === query.teacherId);
    }

    return { success: true, data: list, total: list.length };
  }

  async findById(id: string) {
    const found = this.dataStore.homeworks.find((h) => h.id === id);
    if (!found) throw new NotFoundException('Không tìm thấy bài tập với ID: ' + id);
    return { success: true, data: found };
  }

  async create(dto: Partial<HomeworkEntity>) {
    const now = new Date().toISOString();
    const newHomework: HomeworkEntity = {
      id: dto.id || `hw_${Date.now()}`,
      title: dto.title || 'Bài tập mới',
      subject: dto.subject || 'Toán',
      className: dto.className || '10A1',
      teacherId: dto.teacherId || 'tc_001',
      teacherName: dto.teacherName || 'ThS. Nguyễn Văn Hùng',
      assignedDate: dto.assignedDate || now.split('T')[0],
      dueDate: dto.dueDate || '2026-10-25 23:59',
      description: dto.description || '',
      attachments: dto.attachments || [],
      isUrgent: dto.isUrgent ?? false,
      totalStudents: dto.totalStudents || 38,
      submittedCount: 0,
      gradedCount: 0,
      submissions: [],
      createdAt: now,
      updatedAt: now,
    };

    this.dataStore.homeworks.unshift(newHomework);
    return { success: true, message: 'Giao bài tập mới thành công', data: newHomework };
  }

  async update(id: string, dto: Partial<HomeworkEntity>) {
    const index = this.dataStore.homeworks.findIndex((h) => h.id === id);
    if (index === -1) throw new NotFoundException('Không tìm thấy bài tập');

    this.dataStore.homeworks[index] = {
      ...this.dataStore.homeworks[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    return { success: true, message: 'Cập nhật bài tập thành công', data: this.dataStore.homeworks[index] };
  }

  async remove(id: string) {
    const index = this.dataStore.homeworks.findIndex((h) => h.id === id);
    if (index === -1) throw new NotFoundException('Không tìm thấy bài tập');

    this.dataStore.homeworks.splice(index, 1);
    return { success: true, message: 'Đã xóa bài tập' };
  }

  async submit(
    homeworkId: string,
    dto: {
      studentId?: string;
      studentName?: string;
      studentCode?: string;
      content?: string;
      fileUrls?: string[];
    },
  ) {
    const hw = this.dataStore.homeworks.find((h) => h.id === homeworkId);
    if (!hw) throw new NotFoundException('Không tìm thấy bài tập');

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const submissionId = `sub_${Date.now()}`;

    const submission: HomeworkSubmissionEntity = {
      id: submissionId,
      studentId: dto.studentId || 'hs_001',
      studentName: dto.studentName || 'Nguyễn Minh Quân',
      studentCode: dto.studentCode || 'VS-2026-001',
      submittedAt: now,
      status: 'SUBMITTED',
      content: dto.content || 'Em đã nộp bài tập ạ.',
      fileUrls: dto.fileUrls || [],
    };

    // Kiểm tra xem đã nộp trước đó chưa
    const existingIndex = hw.submissions.findIndex((s) => s.studentId === submission.studentId);
    if (existingIndex !== -1) {
      hw.submissions[existingIndex] = { ...hw.submissions[existingIndex], ...submission };
    } else {
      hw.submissions.push(submission);
      hw.submittedCount += 1;
    }

    return { success: true, message: 'Nộp bài tập thành công', data: submission };
  }

  async gradeSubmission(
    homeworkId: string,
    submissionId: string,
    body: { score: number; feedback?: string },
  ) {
    const hw = this.dataStore.homeworks.find((h) => h.id === homeworkId);
    if (!hw) throw new NotFoundException('Không tìm thấy bài tập');

    const sub = hw.submissions.find((s) => s.id === submissionId);
    if (!sub) throw new NotFoundException('Không tìm thấy bài nộp');

    const wasGraded = sub.status === 'GRADED';
    sub.score = body.score;
    sub.feedback = body.feedback;
    sub.status = 'GRADED';
    sub.gradedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (!wasGraded) {
      hw.gradedCount += 1;
    }

    return { success: true, message: 'Chấm điểm bài nộp thành công', data: sub };
  }
}
