import 'package:flutter/material.dart';
import '../../../logic/uniform/uniform_controller.dart';
import '../../theme/app_theme.dart';
import '../../widgets/top_notification_banner.dart';
import 'uniform_cart_screen.dart';
import 'uniform_order_history_screen.dart';

class UniformScreen extends StatefulWidget {
  const UniformScreen({super.key});

  @override
  State<UniformScreen> createState() => _UniformScreenState();
}

class _UniformScreenState extends State<UniformScreen> {
  late final UniformController _controller;

  @override
  void initState() {
    super.initState();
    _controller = UniformController();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _openCart() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => UniformCartScreen(controller: _controller),
      ),
    );
  }

  void _openHistory() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => UniformOrderHistoryScreen(controller: _controller),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: _controller,
      builder: (context, _) {
        final uniformList = _controller.uniforms;

        return Scaffold(
          appBar: AppBar(
            title: const Text('Đồng Phục'),
            actions: [
              // Nút xem Lịch sử mua hàng
              IconButton(
                tooltip: 'Lịch sử mua hàng',
                icon: const Icon(Icons.receipt_long_rounded),
                onPressed: _openHistory,
              ),
              // Icon Giỏ hàng chỉ để ở góc trên cùng bên phải
              IconButton(
                tooltip: 'Xem giỏ hàng',
                icon: Badge(
                  label: Text('${_controller.totalCartCount}'),
                  isLabelVisible: _controller.totalCartCount > 0,
                  backgroundColor: const Color(0xFFEA580C),
                  child: const Icon(Icons.shopping_cart_outlined),
                ),
                onPressed: _openCart,
              ),
              const SizedBox(width: 4),
            ],
          ),
          body: ListView.builder(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 20),
            itemCount: uniformList.length,
            itemBuilder: (context, index) {
              final item = uniformList[index];
              return _buildUniformCard(item);
            },
          ),
          bottomNavigationBar: _controller.totalCartCount > 0
              ? _buildQuickCartBar()
              : null,
        );
      },
    );
  }

  Widget _buildUniformCard(UniformItem item) {
    return Card(
      margin: const EdgeInsets.only(bottom: 14),
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: AppTheme.border.withValues(alpha: 0.8)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 58,
                  height: 58,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF3E8FF),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Icon(item.icon, size: 30, color: const Color(0xFF7C3AED)),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              item.name,
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppTheme.background,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: AppTheme.border),
                            ),
                            child: Text(
                              item.category,
                              style: const TextStyle(fontSize: 10.5, color: AppTheme.textSecondary),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        item.desc,
                        style: const TextStyle(fontSize: 11.5, color: AppTheme.textSecondary),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 6),
                      Text(
                        item.priceText,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFFEA580C),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            const Divider(height: 1, thickness: 0.8, color: Color(0xFFF1F5F9)),
            const SizedBox(height: 10),

            // Lựa chọn Size
            Row(
              children: [
                const Text(
                  'Chọn Size:',
                  style: TextStyle(fontWeight: FontWeight.w600, fontSize: 12.5),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Wrap(
                    spacing: 6,
                    runSpacing: 4,
                    children: item.sizes.map((size) {
                      final isSelected = item.selectedSize == size;
                      return ChoiceChip(
                        label: Text(size),
                        selected: isSelected,
                        selectedColor: const Color(0xFF7C3AED),
                        labelStyle: TextStyle(
                          color: isSelected ? Colors.white : AppTheme.textPrimary,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                          fontSize: 12,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        onSelected: (selected) {
                          if (selected) {
                            _controller.selectSize(item.id, size);
                          }
                        },
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 12),
            // Nút Thêm Vào Giỏ Hàng
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  _controller.addToCart(item);

                  // Hiển thị thông báo dạng hộp thoại ở ngay trên cùng dưới AppBar tự động mờ và mất sau 2s
                  TopNotificationBanner.show(
                    context: context,
                    title: 'Đã Thêm Vào Giỏ Hàng',
                    message: '${item.name} (Size ${item.selectedSize}) đã sẵn sàng trong giỏ.',
                    icon: Icons.add_shopping_cart_rounded,
                    iconColor: const Color(0xFF7C3AED),
                    iconBgColor: const Color(0xFFF3E8FF),
                    duration: const Duration(milliseconds: 2000),
                  );
                },
                icon: const Icon(Icons.add_shopping_cart_rounded, size: 18),
                label: const Text('Thêm Vào Giỏ Hàng'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 11),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickCartBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 10,
            offset: const Offset(0, -3),
          ),
        ],
      ),
      child: SafeArea(
        child: Row(
          children: [
            Expanded(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Giỏ hàng: ${_controller.totalCartCount} sản phẩm',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5),
                  ),
                  Text(
                    _controller.totalCartAmountText,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFFEA580C),
                    ),
                  ),
                ],
              ),
            ),
            ElevatedButton.icon(
              onPressed: _openCart,
              icon: const Icon(Icons.shopping_bag_outlined, size: 18),
              label: const Text('Xem Giỏ Hàng'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF7C3AED),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
