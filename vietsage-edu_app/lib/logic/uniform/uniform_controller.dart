import 'package:flutter/material.dart';
import '../../core/network/services/api_services.dart';
import '../auth/account_manager.dart';

String formatCurrency(int amount) {
  final str = amount.toString();
  final buffer = StringBuffer();
  int count = 0;
  for (int i = str.length - 1; i >= 0; i--) {
    buffer.write(str[i]);
    count++;
    if (count % 3 == 0 && i != 0) {
      buffer.write('.');
    }
  }
  return '${buffer.toString().split('').reversed.join()} đ';
}

class UniformItem {
  final String id;
  final String name;
  final int price;
  final String category;
  final IconData icon;
  final List<String> sizes;
  String selectedSize;
  final String desc;

  UniformItem({
    required this.id,
    required this.name,
    required this.price,
    required this.category,
    required this.icon,
    required this.sizes,
    required this.selectedSize,
    required this.desc,
  });

  String get priceText => formatCurrency(price);
}

class CartItem {
  final String id;
  final String uniformId;
  final String name;
  final String category;
  final int unitPrice;
  final IconData icon;
  final String size;
  int quantity;

  CartItem({
    required this.id,
    required this.uniformId,
    required this.name,
    required this.category,
    required this.unitPrice,
    required this.icon,
    required this.size,
    this.quantity = 1,
  });

  int get totalPrice => unitPrice * quantity;
  String get totalPriceText => formatCurrency(totalPrice);
  String get unitPriceText => formatCurrency(unitPrice);
}

class UniformOrder {
  final String orderCode;
  final DateTime orderDate;
  final String status; // 'Chờ nhận tại trường' | 'Đã nhận'
  final Color statusColor;
  final List<CartItem> items;
  final int totalAmount;
  final String studentName;
  final String studentClass;

  UniformOrder({
    required this.orderCode,
    required this.orderDate,
    required this.status,
    required this.statusColor,
    required this.items,
    required this.totalAmount,
    required this.studentName,
    required this.studentClass,
  });

  String get totalAmountText => formatCurrency(totalAmount);
  int get totalItemCount {
    int sum = 0;
    for (final it in items) {
      sum += it.quantity;
    }
    return sum;
  }
}

class UniformController extends ChangeNotifier {
  final List<UniformItem> uniforms = [
    // Đồng phục Mầm Non
    UniformItem(
      id: 'uf_mn_1',
      name: 'Bộ Cộc Tay Mầm Non VietSage Kids',
      price: 135000,
      category: 'Mầm non',
      icon: Icons.child_care_rounded,
      sizes: ['Số 2 (3 tuổi)', 'Số 3 (4 tuổi)', 'Số 4 (5 tuổi)'],
      selectedSize: 'Số 3 (4 tuổi)',
      desc: 'Vải cotton 100% mềm mịn, thấm hút mồ hôi, an toàn cho làn da nhạy cảm của bé',
    ),
    UniformItem(
      id: 'uf_mn_2',
      name: 'Ba Lô Chống Gù Hình Thú VietSage Kids',
      price: 185000,
      category: 'Mầm non',
      icon: Icons.backpack_rounded,
      sizes: ['Tiêu chuẩn'],
      selectedSize: 'Tiêu chuẩn',
      desc: 'Ba lô siêu nhẹ đệm mút êm ái chống gù lưng, kèm ngăn để bình nước và khăn mềm',
    ),
    UniformItem(
      id: 'uf_mn_3',
      name: 'Mũ Tai Bèo Vải Cotton Bé Mầm Non',
      price: 55000,
      category: 'Mầm non',
      icon: Icons.face_rounded,
      sizes: ['Freesize'],
      selectedSize: 'Freesize',
      desc: 'Mũ vành che nắng ngoài trời kèm quai đeo co giãn nhẹ nhàng cho bé',
    ),
    // Đồng phục THCS & THPT
    UniformItem(
      id: 'uf_1',
      name: 'Áo Sơ Mi Trắng Tay Ngắn',
      price: 145000,
      category: 'Chính khóa',
      icon: Icons.checkroom_rounded,
      sizes: ['S', 'M', 'L', 'XL'],
      selectedSize: 'M',
      desc: 'Vải kate cao cấp chống nhăn, thoáng mát hút mồ hôi tốt',
    ),
    UniformItem(
      id: 'uf_2',
      name: 'Quần Tây Xanh Đen Nam',
      price: 180000,
      category: 'Chính khóa',
      icon: Icons.dry_cleaning_rounded,
      sizes: ['28', '29', '30', '31'],
      selectedSize: '29',
      desc: 'Chất vải tuyết mưa đứng form, co giãn nhẹ thoải mái vận động',
    ),
    UniformItem(
      id: 'uf_3',
      name: 'Chân Váy Xếp Ly Nữ',
      price: 165000,
      category: 'Chính khóa',
      icon: Icons.shopping_bag_rounded,
      sizes: ['S', 'M', 'L'],
      selectedSize: 'M',
      desc: 'Chân váy xếp ly xanh đen có quần bảo hộ bên trong tiện lợi',
    ),
    UniformItem(
      id: 'uf_4',
      name: 'Bộ Quần Áo Thể Dục Trường',
      price: 210000,
      category: 'Thể thao',
      icon: Icons.sports_tennis_rounded,
      sizes: ['S', 'M', 'L', 'XL'],
      selectedSize: 'L',
      desc: 'Chất thun mè thể thao co giãn 4 chiều, nhanh khô thoáng khí',
    ),
    UniformItem(
      id: 'uf_5',
      name: 'Áo Khoác Gió Mùa Đông 2 Lớp',
      price: 260000,
      category: 'Mùa đông',
      icon: Icons.ac_unit_rounded,
      sizes: ['M', 'L', 'XL', 'XXL'],
      selectedSize: 'L',
      desc: 'Lớp ngoài cản gió chống nước nhẹ, lớp trong lót nỉ ấm áp',
    ),
    UniformItem(
      id: 'uf_6',
      name: 'Bộ Cà Vạt & Phù Hiệu Dệt',
      price: 45000,
      category: 'Phụ kiện',
      icon: Icons.military_tech_rounded,
      sizes: ['Tiêu chuẩn'],
      selectedSize: 'Tiêu chuẩn',
      desc: 'Phù hiệu thêu chỉ dệt sắc nét kèm cà vạt đồng phục trường',
    ),
  ];

  final List<CartItem> cartItems = [];

  // Lịch sử mua hàng
  final List<UniformOrder> orderHistory = [];

  void selectSize(String uniformId, String size) {
    final item = uniforms.firstWhere((u) => u.id == uniformId);
    item.selectedSize = size;
    notifyListeners();
  }

  void addToCart(UniformItem item, {int qty = 1}) {
    final cartItemId = '${item.id}_${item.selectedSize}';
    final existingIndex = cartItems.indexWhere((c) => c.id == cartItemId);

    if (existingIndex != -1) {
      cartItems[existingIndex].quantity += qty;
    } else {
      cartItems.add(
        CartItem(
          id: cartItemId,
          uniformId: item.id,
          name: item.name,
          category: item.category,
          unitPrice: item.price,
          icon: item.icon,
          size: item.selectedSize,
          quantity: qty,
        ),
      );
    }
    notifyListeners();
  }

  void updateQuantity(String cartItemId, int delta) {
    final index = cartItems.indexWhere((c) => c.id == cartItemId);
    if (index != -1) {
      cartItems[index].quantity += delta;
      if (cartItems[index].quantity <= 0) {
        cartItems.removeAt(index);
      }
      notifyListeners();
    }
  }

  void removeFromCart(String cartItemId) {
    cartItems.removeWhere((c) => c.id == cartItemId);
    notifyListeners();
  }

  void clearCart() {
    cartItems.clear();
    notifyListeners();
  }

  // Chốt mua giỏ hàng hiện tại -> Lưu vào lịch sử đơn hàng
  UniformOrder checkoutCurrentCart() {
    final acc = AccountManager().currentAccount;
    final orderCode = '#DP-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';
    final newOrder = UniformOrder(
      orderCode: orderCode,
      orderDate: DateTime.now(),
      status: 'Chờ nhận tại trường',
      statusColor: const Color(0xFFEA580C),
      items: List.from(cartItems),
      totalAmount: totalCartAmount,
      studentName: acc.name,
      studentClass: acc.studentClass,
    );

    orderHistory.insert(0, newOrder);
    _syncOrderToApi(newOrder);
    cartItems.clear();
    notifyListeners();
    return newOrder;
  }

  void _syncOrderToApi(UniformOrder order) async {
    try {
      final itemsDto = order.items.map((it) => {
        'uniformId': it.uniformId,
        'name': it.name,
        'size': it.size,
        'quantity': it.quantity,
        'unitPrice': it.unitPrice,
      }).toList();

      await ApiServices.uniform.createOrder(
        items: itemsDto,
        totalAmount: order.totalAmount.toDouble(),
        studentName: order.studentName,
        studentClass: order.studentClass,
      );
    } catch (_) {}
  }

  int get totalCartCount {
    int sum = 0;
    for (final c in cartItems) {
      sum += c.quantity;
    }
    return sum;
  }

  int get totalCartAmount {
    int sum = 0;
    for (final c in cartItems) {
      sum += c.totalPrice;
    }
    return sum;
  }

  String get totalCartAmountText => formatCurrency(totalCartAmount);
}
