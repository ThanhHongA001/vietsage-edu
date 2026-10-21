import 'package:flutter_test/flutter_test.dart';
import 'package:vietsage_edu/main.dart';

void main() {
  testWidgets('VietsageEdu smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const VietsageEduApp());
    expect(find.text('Đăng Nhập'), findsWidgets);
  });
}
