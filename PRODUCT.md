# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Đối tượng chính:** Học sinh chuyên Tin, thí sinh luyện thi Học sinh giỏi (HSG) Quốc gia / VOI, và sinh viên tham gia thi đấu lập trình ACM-ICPC, Codeforces, VNOJ, CSES.
- **Bối cảnh & Mục tiêu:** Đang học tập, nghiên cứu và luyện giải các dạng thuật toán nâng cao và cấu trúc dữ liệu phức tạp. Người dùng cần hiểu sâu sắc bản chất cơ chế vận hành nội tại từng bước (state transitions, dịch chuyển con trỏ, bảng phương án DP, phân rã cây, luồng mạng) thay vì chỉ đọc tài liệu lý thuyết tĩnh hoặc xem code mẫu.

## Product Purpose

- Cung cấp công cụ trực quan hóa thuật toán chuyên sâu (Staff-level Algorithmic Visualizer) chuẩn xác về mặt logic giải thuật, hỗ trợ mô phỏng vết thực thi từng bước (step-by-step trace playback) và cho phép người dùng nạp bộ test case tùy chỉnh (custom input parsing).
- Thước đo thành công: Người học thông qua hình ảnh trực quan động, bảng trạng thái và dòng code đồng bộ có thể nhanh chóng nắm bắt trực giác thuật toán, hiểu rõ cách dữ liệu biến đổi qua từng thao tác, từ đó tự tin cài đặt lại thuật toán và giải bài thi đấu.

## Positioning

- Khác biệt hoàn toàn với các trang trực quan hóa thông thường chỉ dừng ở mức thuật toán nhập môn (như sắp xếp cơ bản hay BFS đơn giản), **3T ALGO VIS** tập trung chuyên sâu vào các thuật toán và cấu trúc dữ liệu nâng cao đặc thù của Tin học thi đấu (Competitive Programming) và LeetCode Hard: Centroid Decomposition, Heavy-Light Decomposition (HLD), Thuật toán Dinic (Luồng cực đại), Thuật toán Mo (Chia căn), Convex Hull Trick (CHT), Digit DP, Bracket DP, Rerooting DP và chuỗi bài toán Quy hoạch động CSES.
- Tích hợp bộ sinh vết thuật toán (algorithmic tracer) chạy thuần trên client, kết hợp bộ phân tích cú pháp dữ liệu văn bản CP (CP Text Parser) hỗ trợ nạp dữ liệu theo định dạng chuẩn đề thi.

## Operating Context

- Môi trường sử dụng chính là trình duyệt web trên máy tính để bàn/laptop trong lúc người dùng học thuật toán hoặc luyện tập lập trình.
- Thường được dùng song song với IDE/trình biên dịch (C++, Python, Java) và các nền tảng chấm bài trực tuyến (Codeforces, VNOJ, CSES, LeetCode) khi người dùng giải đề hoặc cần gỡ lỗi (debug) luồng tư duy.
- Thao tác qua bộ điều khiển tiến trình (Play, Pause, Step Next/Prev, Speed Slider, Reset), bộ tìm kiếm & chọn thuật toán (Catalog/Command palette), và bảng nhập/chỉnh sửa dữ liệu test case.

## Capabilities and Constraints

- **Năng lực cốt lõi:**
  - Hỗ trợ 24 thuật toán thi đấu nâng cao thuộc các nhóm: Đồ thị, Cây, Quy hoạch động (cơ bản & nâng cao), Xử lý chuỗi, Tối ưu/Hình học, Quay lui.
  - Điều khiển dòng thời gian thực thi: Phát tự động, tạm dừng, bước tới/lùi, tua nhanh, khôi phục trạng thái ban đầu.
  - Phân tích cú pháp dữ liệu CP dạng text thô giúp thử nghiệm linh hoạt với các test case tự chọn.
  - Khung code mẫu song song hiển thị vị trí thực thi tương ứng với từng bước chạy trực quan.
- **Ràng buộc:**
  - Ngôn ngữ: Toàn bộ giao diện, đề bài, mô tả giải thuật, nhãn chức năng và thông báo phản hồi được bản địa hóa thuần tiếng Việt (Pure Vietnamese).
  - Giới hạn kích thước dữ liệu test case để bảo toàn hiệu năng render DOM/SVG và đảm bảo trải nghiệm tương tác mượt mà trên trình duyệt.

## Brand Commitments

- **Tên sản phẩm:** 3T ALGO VIS.
- **Phong cách & Ngôn ngữ:** Thuần tiếng Việt (Pure Vietnamese), diễn đạt thuật ngữ học thuật và tin học thi đấu chuẩn xác, gãy gọn, có tính sư phạm cao.

## Evidence on Hand

- Toàn bộ 24 bộ tracer logic và mã nguồn giải thuật tại `lib/tracers/`.
- Bộ phân tích dữ liệu đầu vào `lib/cp-parser.ts` và danh sách test case mẫu `lib/sample-testcases.ts`.
- Bộ component trực quan hóa cho từng thuật toán tại `components/visualizers/`.

## Product Principles

1. **Chuẩn xác logic tuyệt đối:** Mọi bước mô phỏng và biến đổi trạng thái (đỉnh đồ thị, ô nhớ DP, nhánh cây, luồng) phải phản ánh chính xác 100% bản chất thuật toán chuẩn.
2. **Đồng bộ trực quan ba chiều:** Trạng thái trực quan trên màn hình, dòng nhật ký/giải thích bước chạy và dòng code thuật toán đang trỏ tới phải luôn khớp nhau hoàn hảo tại mỗi khung hình (step).
3. **Ưu tiên chiều sâu Competitive Programming:** Luôn hướng tới các kỹ thuật giải thuật phức tạp, có giá trị cao trong các kỳ thi học sinh giỏi và lập trình đỉnh cao thay vì dàn trải sang các bài toán sơ cấp.
4. **Trải nghiệm tiếng Việt chuẩn mực, mạch lạc:** Giúp người học Việt Nam tiếp cận tri thức thuật toán đỉnh cao mà không gặp rào cản thuật ngữ hay dịch thuật máy móc.
