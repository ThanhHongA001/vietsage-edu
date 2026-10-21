import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../../../logic/homework/homework_controller.dart';
import '../../theme/app_theme.dart';

class HomeworkDetailScreen extends StatefulWidget {
  final Map<String, dynamic> task;
  final HomeworkController? controller;

  const HomeworkDetailScreen({
    super.key,
    required this.task,
    this.controller,
  });

  @override
  State<HomeworkDetailScreen> createState() => _HomeworkDetailScreenState();
}

class _HomeworkDetailScreenState extends State<HomeworkDetailScreen> {
  late Map<String, dynamic> _task;
  final List<Map<String, dynamic>> _attachedFiles = [];
  final TextEditingController _noteController = TextEditingController();
  final ImagePicker _picker = ImagePicker();
  bool _isPicking = false;

  @override
  void initState() {
    super.initState();
    _task = Map<String, dynamic>.from(widget.task);
    // If the task was already submitted, load existing submitted files
    if (_task['isSubmitted'] == true) {
      final existing = _task['submittedFiles'] as List? ?? [];
      for (final item in existing) {
        if (item is Map) {
          _attachedFiles.add(Map<String, dynamic>.from(item));
        } else {
          _attachedFiles.add({
            'name': item.toString(),
            'path': '',
            'size': '',
            'isImage': item.toString().toLowerCase().endsWith('.jpg') ||
                item.toString().toLowerCase().endsWith('.png') ||
                item.toString().toLowerCase().endsWith('.jpeg'),
          });
        }
      }
    }
  }

  @override
  void dispose() {
    _noteController.dispose();
    super.dispose();
  }

  String _formatFileSize(int bytes) {
    if (bytes < 1024) return '$bytes B';
    if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(1)} KB';
    return '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
  }

  // 1. Chụp ảnh thật bằng Camera
  Future<void> _pickFromCamera() async {
    if (_isPicking) return;
    setState(() => _isPicking = true);
    try {
      final XFile? photo = await _picker.pickImage(
        source: ImageSource.camera,
        imageQuality: 85,
      );
      if (photo != null) {
        final file = File(photo.path);
        int size = 0;
        if (await file.exists()) {
          size = await file.length();
        }
        setState(() {
          _attachedFiles.add({
            'name': photo.name.isNotEmpty ? photo.name : 'Anh_chup_camera_${DateTime.now().millisecondsSinceEpoch}.jpg',
            'path': photo.path,
            'size': _formatFileSize(size),
            'isImage': true,
          });
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('📸 Đã chụp ảnh thành công: ${photo.name}'),
              backgroundColor: AppTheme.success,
              duration: const Duration(seconds: 2),
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Không thể mở máy ảnh: $e'),
            backgroundColor: AppTheme.danger,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isPicking = false);
    }
  }

  // 2. Chọn ảnh thật từ thư viện (hỗ trợ chọn nhiều ảnh)
  Future<void> _pickFromGallery() async {
    if (_isPicking) return;
    setState(() => _isPicking = true);
    try {
      final List<XFile> images = await _picker.pickMultiImage(imageQuality: 85);
      if (images.isNotEmpty) {
        for (final img in images) {
          final file = File(img.path);
          int size = 0;
          if (await file.exists()) {
            size = await file.length();
          }
          _attachedFiles.add({
            'name': img.name,
            'path': img.path,
            'size': _formatFileSize(size),
            'isImage': true,
          });
        }
        setState(() {});
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('🖼️ Đã chọn ${images.length} ảnh từ thư viện'),
              backgroundColor: AppTheme.success,
              duration: const Duration(seconds: 2),
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Không thể mở thư viện ảnh: $e'),
            backgroundColor: AppTheme.danger,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isPicking = false);
    }
  }

  // 3. Chọn tệp thật từ bộ nhớ thiết bị (PDF, Word, Excel, ZIP...)
  Future<void> _pickFromFiles() async {
    if (_isPicking) return;
    setState(() => _isPicking = true);
    try {
      final List<PlatformFile> files = await FilePicker.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf', 'doc', 'docx', 'txt', 'zip', 'rar', 'jpg', 'jpeg', 'png', 'xlsx', 'pptx'],
      );

      if (files.isNotEmpty) {
        for (final f in files) {
          if (f.path != null) {
            final ext = f.extension?.toLowerCase() ?? '';
            final isImg = ['jpg', 'jpeg', 'png', 'webp'].contains(ext);
            final size = f.lengthSync() ?? (await f.length()) ?? 0;
            _attachedFiles.add({
              'name': f.name,
              'path': f.path!,
              'size': _formatFileSize(size),
              'isImage': isImg,
            });
          }
        }
        setState(() {});
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('📁 Đã chọn ${files.length} tệp tài liệu'),
              backgroundColor: AppTheme.success,
              duration: const Duration(seconds: 2),
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Không thể mở tệp: $e'),
            backgroundColor: AppTheme.danger,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isPicking = false);
    }
  }


  void _previewImage(Map<String, dynamic> fileData) {
    final path = fileData['path'] as String? ?? '';
    if (path.isEmpty || !File(path).existsSync()) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Tệp: ${fileData['name']}'),
          backgroundColor: AppTheme.primary,
        ),
      );
      return;
    }

    showDialog(
      context: context,
      builder: (ctx) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        clipBehavior: Clip.antiAlias,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            AppBar(
              title: Text(fileData['name'] as String? ?? 'Xem Ảnh', style: const TextStyle(fontSize: 14)),
              automaticallyImplyLeading: false,
              actions: [
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(ctx),
                ),
              ],
            ),
            InteractiveViewer(
              child: Image.file(
                File(path),
                fit: BoxFit.contain,
                height: 350,
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Text(
                'Dung lượng: ${fileData['size'] ?? ''}',
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _confirmSubmit() {
    if (_attachedFiles.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Vui lòng chụp ảnh hoặc đính kèm ít nhất 1 tệp bài làm!'),
          backgroundColor: AppTheme.danger,
        ),
      );
      return;
    }

    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
          title: Row(
            children: const [
              Icon(Icons.help_outline_rounded, color: AppTheme.primary),
              SizedBox(width: 8),
              Expanded(
                child: Text('Xác Nhận Nộp Bài', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Bạn có chắc chắn muốn nộp bài tập môn "${_task['subject']}" cho ${_task['teacher']} không?'),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppTheme.background,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppTheme.border),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.attach_file, size: 18, color: AppTheme.textSecondary),
                    const SizedBox(width: 6),
                    Text(
                      'Số tệp đính kèm: ${_attachedFiles.length} tệp',
                      style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                    ),
                  ],
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Hủy', style: TextStyle(color: AppTheme.textSecondary)),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(ctx);
                _executeSubmit();
              },
              child: const Text('Nộp Ngay'),
            ),
          ],
        );
      },
    );
  }

  void _executeSubmit() {
    final success = widget.controller?.submitTask(
          taskId: _task['id'] ?? '',
          files: _attachedFiles,
          note: _noteController.text.trim(),
        ) ??
        true;

    if (success) {
      setState(() {
        _task['isSubmitted'] = true;
        _task['submittedDate'] = 'Vừa xong';
        _task['score'] = 'Chờ chấm điểm';
        _task['teacherComment'] = 'Bài tập đã được gửi tới giáo viên, đang chờ chấm điểm.';
        _task['submittedFiles'] = List<dynamic>.from(_attachedFiles);
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('🎉 Đã nộp bài tập thành công cho giáo viên!'),
          backgroundColor: AppTheme.success,
          duration: Duration(seconds: 3),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isSubmitted = _task['isSubmitted'] == true;
    final isUrgent = _task['isUrgent'] == true;
    final attachments = (_task['attachments'] as List?) ?? [];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Chi Tiết Bài Tập'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. Thẻ thông tin bài tập tổng quan
            _buildOverviewCard(isSubmitted, isUrgent),
            const SizedBox(height: 16),

            // 2. Nội dung văn bản chi tiết đề bài
            _buildContentCard(),
            const SizedBox(height: 16),

            // 3. Tài liệu / Đề bài đính kèm từ giáo viên (nếu có)
            if (attachments.isNotEmpty) ...[
              _buildAttachmentsCard(attachments),
              const SizedBox(height: 16),
            ],

            // 4. Khu vực Nộp Bài hoặc Kết quả đã nộp
            if (isSubmitted)
              _buildSubmittedResultCard()
            else
              _buildSubmissionSection(),

            const SizedBox(height: 32),
          ],
        ),
      ),
      bottomNavigationBar: isSubmitted
          ? null
          : Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    offset: const Offset(0, -3),
                    blurRadius: 10,
                  ),
                ],
              ),
              child: SafeArea(
                child: ElevatedButton.icon(
                  onPressed: _confirmSubmit,
                  icon: const Icon(Icons.upload_file_rounded),
                  label: const Text('NỘP BÀI TẬP CHO GIÁO VIÊN', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primary,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ),
            ),
    );
  }

  Widget _buildOverviewCard(bool isSubmitted, bool isUrgent) {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: AppTheme.border),
      ),
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryContainer,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    _task['subject'] ?? 'Môn Học',
                    style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primary, fontSize: 13),
                  ),
                ),
                if (isSubmitted)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFDCFCE7),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppTheme.success),
                    ),
                    child: const Text('Đã Nộp Bài', style: TextStyle(color: AppTheme.success, fontSize: 12, fontWeight: FontWeight.bold)),
                  )
                else if (isUrgent)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFEF2F2),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppTheme.danger),
                    ),
                    child: const Text('Hạn Chót Gấp', style: TextStyle(color: AppTheme.danger, fontSize: 12, fontWeight: FontWeight.bold)),
                  )
                else
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFEF3C7),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppTheme.warning),
                    ),
                    child: const Text('Chưa Nộp', style: TextStyle(color: AppTheme.warning, fontSize: 12, fontWeight: FontWeight.bold)),
                  ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              _task['title'] ?? '',
              style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold, height: 1.3),
            ),
            const SizedBox(height: 12),
            const Divider(height: 1),
            const SizedBox(height: 12),
            Row(
              children: [
                const CircleAvatar(
                  radius: 14,
                  backgroundColor: Color(0xFFE2E8F0),
                  child: Icon(Icons.person, size: 16, color: AppTheme.textSecondary),
                ),
                const SizedBox(width: 8),
                Text(
                  'Giáo viên: ${_task['teacher'] ?? ''}',
                  style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                ),
              ],
            ),
            if (_task['assignedDate'] != null) ...[
              const SizedBox(height: 6),
              Row(
                children: [
                  const Icon(Icons.event_note, size: 16, color: AppTheme.textSecondary),
                  const SizedBox(width: 8),
                  Text(
                    'Ngày giao: ${_task['assignedDate']}',
                    style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13),
                  ),
                ],
              ),
            ],
            const SizedBox(height: 6),
            Row(
              children: [
                Icon(
                  Icons.access_time_filled,
                  size: 16,
                  color: isUrgent ? AppTheme.danger : AppTheme.textSecondary,
                ),
                const SizedBox(width: 8),
                Text(
                  _task['deadline'] ?? '',
                  style: TextStyle(
                    fontWeight: isUrgent ? FontWeight.bold : FontWeight.w500,
                    color: isUrgent ? AppTheme.danger : AppTheme.textPrimary,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildContentCard() {
    final content = _task['content'] ?? 'Không có nội dung chi tiết.';
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: AppTheme.border),
      ),
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: const [
                Icon(Icons.menu_book_rounded, color: AppTheme.primary, size: 20),
                SizedBox(width: 8),
                Text(
                  'Nội Dung Bài Tập & Yêu Cầu',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppTheme.background,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: SelectableText(
                content,
                style: const TextStyle(
                  fontSize: 14,
                  height: 1.5,
                  color: AppTheme.textPrimary,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAttachmentsCard(List attachments) {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: AppTheme.border),
      ),
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.attach_file_rounded, color: AppTheme.primary, size: 20),
                const SizedBox(width: 8),
                Text(
                  'Tài Liệu Đính Kèm (${attachments.length})',
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ...attachments.map((item) {
              final name = item is Map ? (item['name'] ?? 'File đính kèm') : item.toString();
              final size = item is Map ? (item['size'] ?? '') : '';
              final isPdf = name.endsWith('.pdf');

              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                decoration: BoxDecoration(
                  color: AppTheme.background,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppTheme.border),
                ),
                child: Row(
                  children: [
                    Icon(
                      isPdf ? Icons.picture_as_pdf_rounded : Icons.image_rounded,
                      color: isPdf ? Colors.red : Colors.blue,
                      size: 24,
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(name, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                          if (size.isNotEmpty)
                            Text(size, style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.download_rounded, color: AppTheme.primary, size: 20),
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Đang tải xuống tài liệu: $name'),
                            backgroundColor: AppTheme.primary,
                          ),
                        );
                      },
                    ),
                  ],
                ),
              );
            }),
          ],
        ),
      ),
    );
  }

  Widget _buildSubmissionSection() {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: AppTheme.border),
      ),
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: const [
                Icon(Icons.cloud_upload_rounded, color: AppTheme.primary, size: 20),
                SizedBox(width: 8),
                Text(
                  'Bài Làm Của Học Sinh',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 6),
            const Text(
              'Chụp ảnh trực tiếp từ camera, chọn ảnh từ thư viện hoặc tải tệp tài liệu:',
              style: TextStyle(fontSize: 13, color: AppTheme.textSecondary),
            ),
            const SizedBox(height: 12),

            // 3 nút thao tác nhanh (Chụp ảnh thật, Chọn thư viện, Tải tệp thật)
            Row(
              children: [
                Expanded(
                  child: _buildQuickActionButton(
                    icon: Icons.camera_alt_rounded,
                    label: 'Chụp ảnh',
                    color: AppTheme.primary,
                    onTap: _pickFromCamera,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildQuickActionButton(
                    icon: Icons.photo_library_rounded,
                    label: 'Thư viện',
                    color: const Color(0xFF4338CA),
                    onTap: _pickFromGallery,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildQuickActionButton(
                    icon: Icons.folder_open_rounded,
                    label: 'Chọn tệp',
                    color: const Color(0xFFD97706),
                    onTap: _pickFromFiles,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // Danh sách ảnh/tệp thực tế đã chọn
            if (_attachedFiles.isEmpty)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 20),
                decoration: BoxDecoration(
                  color: AppTheme.background,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.border, style: BorderStyle.solid),
                ),
                child: Column(
                  children: const [
                    Icon(Icons.upload_file_outlined, size: 36, color: AppTheme.textSecondary),
                    SizedBox(height: 6),
                    Text(
                      'Chưa có ảnh hoặc tệp bài làm nào',
                      style: TextStyle(fontSize: 13, color: AppTheme.textSecondary),
                    ),
                    SizedBox(height: 4),
                    Text(
                      'Bấm vào các nút trên để chụp ảnh hoặc tải file',
                      style: TextStyle(fontSize: 11, color: AppTheme.textSecondary),
                    ),
                  ],
                ),
              )
            else
              Column(
                children: _attachedFiles.map((fileData) {
                  final name = fileData['name'] as String? ?? 'Tệp bài làm';
                  final path = fileData['path'] as String? ?? '';
                  final size = fileData['size'] as String? ?? '';
                  final isImg = fileData['isImage'] == true;
                  final hasLocalFile = path.isNotEmpty && File(path).existsSync();

                  return Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFCBD5E1)),
                    ),
                    child: InkWell(
                      onTap: isImg && hasLocalFile ? () => _previewImage(fileData) : null,
                      child: Row(
                        children: [
                          if (isImg && hasLocalFile)
                            ClipRRect(
                              borderRadius: BorderRadius.circular(8),
                              child: Image.file(
                                File(path),
                                width: 44,
                                height: 44,
                                fit: BoxFit.cover,
                              ),
                            )
                          else
                            Container(
                              width: 44,
                              height: 44,
                              decoration: BoxDecoration(
                                color: isImg ? const Color(0xFFDBEAFE) : const Color(0xFFFEF3C7),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Icon(
                                isImg ? Icons.image_rounded : Icons.insert_drive_file_rounded,
                                color: isImg ? AppTheme.primary : const Color(0xFFD97706),
                                size: 24,
                              ),
                            ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  name,
                                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                                  overflow: TextOverflow.ellipsis,
                                ),
                                if (size.isNotEmpty)
                                  Text(
                                    size,
                                    style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary),
                                  ),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.close_rounded, size: 20, color: AppTheme.danger),
                            onPressed: () {
                              setState(() {
                                _attachedFiles.remove(fileData);
                              });
                            },
                          ),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ),

            const SizedBox(height: 14),
            TextField(
              controller: _noteController,
              decoration: InputDecoration(
                hintText: 'Ghi chú gửi giáo viên (ví dụ: em gửi bài làm 1 đến 5)...',
                hintStyle: const TextStyle(fontSize: 13, color: AppTheme.textSecondary),
                filled: true,
                fillColor: AppTheme.background,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: const BorderSide(color: AppTheme.border),
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              ),
              maxLines: 2,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActionButton({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      borderRadius: BorderRadius.circular(10),
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: color.withValues(alpha: 0.2)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: color, size: 20),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: color),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSubmittedResultCard() {
    final submittedFiles = (_task['submittedFiles'] as List?) ?? [];
    final score = _task['score'] as String?;
    final comment = _task['teacherComment'] as String?;

    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: AppTheme.border),
      ),
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: const [
                Icon(Icons.check_circle_rounded, color: AppTheme.success, size: 22),
                SizedBox(width: 8),
                Text(
                  'Thông Tin Nộp Bài',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.success),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF0FDF4),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFFBBF7D0)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.schedule_rounded, color: AppTheme.success, size: 18),
                  const SizedBox(width: 8),
                  Text(
                    'Thời gian nộp: ${_task['submittedDate'] ?? 'Đã ghi nhận'}',
                    style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: Color(0xFF166534)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            if (score != null) ...[
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFEFF6FF),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFBFDBFE)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Điểm Đánh Giá:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                        Text(
                          score,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.primary,
                          ),
                        ),
                      ],
                    ),
                    if (comment != null && comment.isNotEmpty) ...[
                      const SizedBox(height: 8),
                      const Divider(height: 1),
                      const SizedBox(height: 8),
                      Text(
                        'Nhận xét từ ${_task['teacher'] ?? 'giáo viên'}:',
                        style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: AppTheme.textSecondary),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        comment,
                        style: const TextStyle(fontSize: 13, fontStyle: FontStyle.italic, color: AppTheme.textPrimary),
                      ),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: 14),
            ],

            const Text(
              'Tệp bài làm đã nộp:',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
            ),
            const SizedBox(height: 8),
            ...submittedFiles.map((f) {
              final name = f is Map ? (f['name'] ?? 'Tệp') : f.toString();
              final path = f is Map ? (f['path'] as String? ?? '') : '';
              final size = f is Map ? (f['size'] as String? ?? '') : '';
              final isImg = f is Map ? (f['isImage'] == true) : false;
              final hasLocalFile = path.isNotEmpty && File(path).existsSync();

              return Container(
                margin: const EdgeInsets.only(bottom: 6),
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                decoration: BoxDecoration(
                  color: AppTheme.background,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppTheme.border),
                ),
                child: InkWell(
                  onTap: isImg && hasLocalFile ? () => _previewImage(f as Map<String, dynamic>) : null,
                  child: Row(
                    children: [
                      if (isImg && hasLocalFile)
                        ClipRRect(
                          borderRadius: BorderRadius.circular(6),
                          child: Image.file(
                            File(path),
                            width: 36,
                            height: 36,
                            fit: BoxFit.cover,
                          ),
                        )
                      else
                        const Icon(Icons.check_circle_outline, color: AppTheme.success, size: 18),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              name,
                              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
                              overflow: TextOverflow.ellipsis,
                            ),
                            if (size.isNotEmpty)
                              Text(size, style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
                          ],
                        ),
                      ),
                      const Text('Đã gửi', style: TextStyle(fontSize: 12, color: AppTheme.success, fontWeight: FontWeight.w600)),
                    ],
                  ),
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}
