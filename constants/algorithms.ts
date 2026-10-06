import { 
  Cpu, Layers, GitBranch, Terminal, LayoutGrid, Network, Coins 
} from 'lucide-react';
import { TabType, AlgoMeta, CategoryItem, CategoryStyle } from '@/types/algorithm';

export const ALGORITHM_CATALOG: Record<TabType, AlgoMeta> = {
  DIJKSTRA: {
    id: 'DIJKSTRA',
    name: "Dijkstra - Đường Đi Ngắn Nhất",
    category: "GRAPH",
    complexity: "O((V+E) log V)",
    sourceBadge: "Đồ Thị Kinh Điển",
    desc: "Tìm đường đi ngắn nhất từ đỉnh nguồn trên đồ thị trọng số không âm bằng hàng đợi ưu tiên Min-Heap.",
    help: "Dòng 1: N M Nguồn (Số đỉnh, số cạnh, đỉnh nguồn)\nM dòng tiếp theo: u v trọng_số",
    tags: ["Min-Heap", "Đồ Thị Trọng Số", "Thuật Toán Tham Lam"],
    keywords: ["duong di ngan nhat", "heap", "priority queue", "do thi", "shortest path", "dijkstra"],
    problemStatement: "Cho đồ thị có N đỉnh và M cạnh có trọng số không âm, cùng đỉnh nguồn S. Hãy tìm khoảng cách đường đi ngắn nhất từ đỉnh S tới tất cả các đỉnh còn lại trên đồ thị."
  },
  DP: {
    id: 'DP',
    name: "Quy Hoạch Động Cái Túi 0/1",
    category: "DP",
    complexity: "O(N · W)",
    sourceBadge: "Quy Hoạch Động Kinh Điển",
    desc: "Tối ưu hóa tổng giá trị vật phẩm thu được trong giới hạn sức chứa tối đa W của ba lô.",
    help: "Dòng 1: Sức chứa W\nDòng 2: Danh sách trọng lượng (w1 w2 ... wn)\nDòng 3: Danh sách giá trị (v1 v2 ... vn)",
    tags: ["Quy Hoạch Động", "Ba Lô 0/1", "Tối Ưu Sức Chứa"],
    keywords: ["cai tui", "ba lo", "knapsack", "quy hoach dong", "0/1 knapsack"],
    problemStatement: "Cho N đồ vật, mỗi đồ vật thứ i có trọng lượng W[i] và giá trị V[i]. Giới hạn sức chứa tối đa của ba lô là W. Hãy chọn một tập hợp các đồ vật sao cho tổng trọng lượng không vượt quá W và mang lại tổng giá trị lớn nhất."
  },
  MO: {
    id: 'MO',
    name: "Thuật Toán Mo (Chia Căn Mảng)",
    category: "GRAPH",
    complexity: "O((N+Q) √N)",
    sourceBadge: "Chia Căn √N",
    desc: "Xử lý hàng loạt truy vấn đoạn [L, R] ngoại tuyến (Offline) bằng kỹ thuật chia căn mảng thành các khối √N.",
    help: "Dòng 1: N (Số phần tử mảng)\nDòng 2: Mảng N số nguyên\nDòng 3: Q (Số lượng truy vấn)\nQ dòng tiếp theo: L R (Chỉ số 0-indexed)",
    tags: ["Chia Căn √N", "Truy Vấn Ngoại Tuyến", "Kỹ Thuật Hai Con Trỏ"],
    keywords: ["chia can", "offline queries", "block decomposition", "mo algorithm", "truy van doan"],
    problemStatement: "Cho một mảng gồm N phần tử và Q truy vấn đoạn [L, R]. Bằng cách sắp xếp các truy vấn theo thứ tự tối ưu và chia mảng thành các khối kích thước √N, thuật toán Mo cho phép duy trì và mở rộng cửa sổ trượt để trả lời toàn bộ các truy vấn ngoại tuyến (Offline) trong thời gian O((N + Q)√N)."
  },
  CENTROID: {
    id: 'CENTROID',
    name: "Phân Rã Trọng Tâm Cây",
    category: "TREE",
    complexity: "O(N log N)",
    sourceBadge: "Chia Để Trị Trên Cây",
    desc: "Đệ quy tìm trọng tâm cây để phân rã cây thành Cây Trọng Tâm (Centroid Tree) giải quyết các bài toán đường đi.",
    help: "Dòng 1: N (Số đỉnh của cây)\nN-1 dòng tiếp theo: u v (Cạnh nối hai đỉnh)",
    tags: ["Phân Rã Trọng Tâm", "Đệ Quy Trên Cây", "Đường Đi Trên Cây"],
    keywords: ["trong tam cay", "chia de tri", "tree path", "centroid", "cay"],
    problemStatement: "Cho một cây gồm N đỉnh. Bằng cách đệ quy tìm đỉnh trọng tâm (Centroid) – đỉnh mà khi loại bỏ sẽ chia cây thành các cây con có kích thước không vượt quá N/2 – ta xây dựng Cây Trọng Tâm với độ cao tối đa O(log N), làm nền tảng giải quyết hiệu quả các bài toán truy vấn đường đi trên cây."
  },
  DP_BS: {
    id: 'DP_BS',
    name: "LIS - Dãy Con Tăng Dài Nhất",
    category: "DP",
    complexity: "O(N log N)",
    sourceBadge: "Quy Hoạch Động Nhị Phân",
    desc: "Tìm độ dài dãy con tăng dài nhất tối ưu bằng mảng Tails kết hợp tìm kiếm nhị phân (Patience Sorting).",
    help: "Dòng 1: N (Số phần tử)\nDòng 2: Mảng N phần tử",
    tags: ["Mảng Tails", "Tìm Kiếm Nhị Phân", "Dãy Con Tăng Dài Nhất"],
    keywords: ["day con tang dai nhat", "longest increasing subsequence", "binary search", "tails", "lis"],
    problemStatement: "Cho một dãy số gồm N phần tử. Hãy tìm độ dài của dãy con tăng dần nghiêm ngặt dài nhất (Longest Increasing Subsequence). Thuật toán kết hợp lưu vết quy hoạch động với tìm kiếm nhị phân trên mảng Tails để đạt độ phức tạp tối ưu O(N log N)."
  },
  PBS: {
    id: 'PBS',
    name: "Chia Nhị Phân Song Song",
    category: "GRAPH",
    complexity: "O((N+Q) log K)",
    sourceBadge: "Chia Nhị Phân Ngoại Tuyến",
    desc: "Tìm kiếm nhị phân song song giải quyết đồng thời nhiều truy vấn ngoại tuyến trên cấu trúc dữ liệu.",
    help: "Dòng 1: N (Kích thước mảng)\nDòng 2: U (Số thao tác cập nhật)\nU dòng tiếp theo: vị_trí giá_trị\nDòng tiếp theo: Q (Số truy vấn)\nQ dòng tiếp theo: vị_trí_đích giá_trị_yêu_cầu",
    tags: ["Tìm Kiếm Song Song", "Đa Truy Vấn", "Chia Để Trị Ngoại Tuyến"],
    keywords: ["tim kiem nhi phan song song", "parallel binary search", "queries", "offline"],
    problemStatement: "Khi có Q truy vấn độc lập cùng cần tìm kiếm nhị phân kết quả, thay vì giải quyết tuần tự từng truy vấn làm tăng thời gian thực thi, kỹ thuật Chia nhị phân song song (Parallel Binary Search) duy trì khoảng nghiệm [L, R] cho toàn bộ truy vấn và đồng thời duyệt chia để trị qua từng bước cập nhật dữ liệu, tối ưu độ phức tạp xuống O((N + Q) log K)."
  },
  DIGIT_DP: {
    id: 'DIGIT_DP',
    name: "Quy Hoạch Động Chữ Số",
    category: "DP",
    complexity: "O(Số Chữ Số · Tổng)",
    sourceBadge: "DP Chữ Số",
    desc: "Quy hoạch động theo từng vị trí chữ số để đếm số lượng số ≤ N thỏa mãn ràng buộc tổng chữ số và tiền tố.",
    help: "Dòng 1: Cận trên N\nDòng 2: Tổng chữ số mong muốn S",
    tags: ["DP Chữ Số", "Tiền Tố Số", "Đếm Thỏa Điều Kiện"],
    keywords: ["chu so", "dem so", "digit dp", "prefix", "tong chu so"],
    problemStatement: "Cho khoảng số nguyên [L, R] với cận trên R có thể lên đến 10^18 hoặc lớn hơn. Hãy đếm số lượng các số nguyên trong đoạn thỏa mãn các điều kiện chữ số đặt ra (ví dụ: tổng các chữ số bằng S, không chứa chữ số cấm). Thuật toán quy hoạch động xây dựng số theo từng chữ số từ trái qua phải kết hợp biến cờ giới hạn (tight)."
  },
  BRACKET_DP: {
    id: 'BRACKET_DP',
    name: "Quy Hoạch Động Dãy Ngoặc",
    category: "DP",
    complexity: "O(N³)",
    sourceBadge: "LeetCode 32 / 678",
    desc: "Quy hoạch động đoạn (Range DP) tìm dãy ngoặc hợp lệ dài nhất hoặc đếm số phương án điền ngoặc hoàn chỉnh.",
    help: "Dòng 1: Chuỗi S gồm các ký tự ngoặc (), [], {}",
    tags: ["Quy Hoạch Động Đoạn", "Dãy Ngoặc Hợp Lệ", "Độ Khó LeetCode Hard"],
    keywords: ["ngoac", "bracket", "parentheses", "range dp", "leetcode 32", "leetcode 678"],
    problemStatement: "Cho một chuỗi chứa các dấu ngoặc mở, đóng hoặc các vị trí chưa xác định '?'. Thuật toán quy hoạch động đoạn (Range DP) tính số cách điền dấu vào các khe '?' để chuỗi trở thành dãy ngoặc hợp lệ hoàn chỉnh, hoặc tìm độ dài dãy ngoặc con hợp lệ dài nhất."
  },
  SUDOKU: {
    id: 'SUDOKU',
    name: "Giải Đố Sudoku (Quay Lui Ràng Buộc)",
    category: "BACKTRACKING",
    complexity: "O(9^(N²))",
    sourceBadge: "Quay Lui Ràng Buộc",
    desc: "Thuật toán quay lui giải Sudoku kết hợp kiểm tra phạm vi hàng, cột, khối con 3 chiều và lọc ứng viên.",
    help: "Dòng 1: Kích thước N N\nN dòng tiếp theo: N số (0 tương ứng ô trống)",
    tags: ["Quay Lui Backtracking", "Kiểm Tra Không Gian 3D", "Lọc Ứng Viên"],
    keywords: ["quay lui", "sudoku", "scope", "bang 9x9", "backtracking"],
    problemStatement: "Cho bảng ô vuông ma trận kích thước N x N (ví dụ 4x4 hoặc 9x9) bị khuyết một số ô số. Hãy điền các chữ số hợp lệ vào ô trống sao cho thỏa mãn ràng buộc: không trùng lặp trên mỗi hàng, mỗi cột và trong mỗi khối con."
  },
  NQUEENS: {
    id: 'NQUEENS',
    name: "Bài Toán N Quân Hậu",
    category: "BACKTRACKING",
    complexity: "O(N!)",
    sourceBadge: "Quay Lui Kinh Điển",
    desc: "Đặt N quân Hậu trên bàn cờ N x N không đe dọa lẫn nhau với hiển thị trực quan các tia kiểm soát.",
    help: "Dòng 1: N (Kích thước bàn cờ N x N)",
    tags: ["Quay Lui Backtracking", "Tia Kiểm Soát Đe Dọa", "Bàn Cờ N x N"],
    keywords: ["quan hau", "n queens", "threat rays", "ban co", "backtracking"],
    problemStatement: "Cho bàn cờ vua kích thước N x N. Hãy tìm cách đặt đúng N quân Hậu lên bàn cờ sao cho không có bất kỳ hai quân Hậu nào đe dọa nhau (không cùng hàng, cùng cột, hoặc cùng trên một đường chéo)."
  },
  DINIC: {
    id: 'DINIC',
    name: "Thuật Toán Dinic (Luồng Cực Đại)",
    category: "GRAPH",
    complexity: "O(V² · E)",
    sourceBadge: "Mạng Luồng Cực Đại",
    desc: "Tìm luồng cực đại trên mạng bằng đồ thị phân tầng Level Graph (BFS) và luồng cản Blocking Flow (DFS).",
    help: "Dòng 1: N Nguồn Đích M\nM dòng tiếp theo: u v dung_lượng",
    tags: ["Đồ Thị Phân Tầng (BFS)", "Luồng Cản (DFS)", "Luồng Cực Đại"],
    keywords: ["luong cuc dai", "max flow", "blocking flow", "level graph", "dinic", "mang luong"],
    problemStatement: "Cho đồ thị mạng luồng đơn hướng có sức chứa trên mỗi cung, đỉnh phát nguồn (Source) và đỉnh thu (Sink). Hãy tìm tổng luồng chảy lớn nhất có thể bơm từ đỉnh nguồn sang đỉnh thu. Thuật toán Dinic tối ưu hóa quá trình tăng luồng qua đồ thị phân tầng (Level Graph) và tìm luồng cản (Blocking Flow)."
  },
  HLD: {
    id: 'HLD',
    name: "Phân Rã Nhánh Nặng - Nhẹ (HLD)",
    category: "TREE",
    complexity: "O(N log² N)",
    sourceBadge: "Cây & Segment Tree",
    desc: "Phân rã cây Heavy-Light Decomposition trải phẳng cây thành mảng 1D để truy vấn Segment Tree cực nhanh.",
    help: "Dòng 1: N (Số đỉnh của cây)\nN-1 dòng tiếp theo: u v (Cạnh nối)\nDòng cuối cùng: u v (Đường đi cần truy vấn)",
    tags: ["Chuỗi Nhánh Nặng", "Trải Phẳng Mảng 1D", "Cây Phân Đoạn (Segment Tree)"],
    keywords: ["hld", "canh nang nhe", "segment tree", "cay", "heavy light"],
    problemStatement: "Cho cấu trúc cây gồm N đỉnh. Thuật toán Heavy-Light Decomposition (HLD) phân chia cây thành các chuỗi đường đi thẳng (chuỗi nặng - Heavy Chains), giúp dàn phẳng cây thành các đoạn liên tiếp trên mảng một chiều để truy vấn và cập nhật giá trị trên đường đi giữa hai đỉnh bất kỳ với cây phân đoạn (Segment Tree) trong thời gian O(log² N)."
  },
  AHO_CORASICK: {
    id: 'AHO_CORASICK',
    name: "Thuật Toán Aho-Corasick",
    category: "STRING",
    complexity: "O(N + ΣM)",
    sourceBadge: "Cây Trie & Liên Kết Rẽ",
    desc: "Tự động hóa tìm kiếm đồng thời nhiều chuỗi mẫu trong văn bản chỉ với một lượt duyệt O(N) nhờ Trie & Fail Links.",
    help: "Dòng 1: K (Số lượng mẫu)\nK dòng tiếp theo: Chuỗi mẫu\nDòng cuối cùng: Đoạn văn bản cần tìm kiếm",
    tags: ["Trie Đa Mẫu", "Liên Kết Thất Bại (Fail Links)", "Khớp Chuỗi Tuyến Tính O(N)"],
    keywords: ["chuoi", "string matching", "trie", "fail link", "aho corasick", "khop mau"],
    problemStatement: "Cho tập K chuỗi mẫu và một văn bản T. Cấu trúc tự động Aho-Corasick kết hợp cây tiền tố (Trie) với các liên kết thất bại (Fail Links), cho phép duyệt và phát hiện tất cả các vị trí xuất hiện của mọi chuỗi mẫu trong văn bản chỉ với độ phức tạp tuyến tính O(|T| + tổng độ dài các chuỗi mẫu)."
  },
  CHT: {
    id: 'CHT',
    name: "Tối Ưu Hóa Bao Lồi (Convex Hull Trick)",
    category: "DP",
    complexity: "O(N log N)",
    sourceBadge: "Tối Ưu Hóa DP",
    desc: "Duy trì bao lồi đường thẳng (Lower / Upper Envelope) trên mặt phẳng 2D để giảm bậc thời gian tính quy hoạch động.",
    help: "Dòng 1: K (Số lượng đường thẳng)\nK dòng tiếp theo: m c (Hệ số góc m và tung độ gốc c)\nDòng tiếp theo: Q (Số truy vấn)\nQ dòng tiếp theo: x (Hoành độ cần truy vấn)",
    tags: ["Bao Lồi 2D", "Đường Bao Dưới (Lower Envelope)", "Tối Ưu Bậc Thời Gian DP"],
    keywords: ["bao loi", "convex hull", "duong thang", "cht", "toi uu dp"],
    problemStatement: "Kỹ thuật tối ưu hóa bao lồi (Convex Hull Trick): Cho tập hợp các phương trình đường thẳng bậc nhất y = m · x + c. Tại mỗi truy vấn với hoành độ x cho trước, tìm giá trị cực trị (lớn nhất hoặc nhỏ nhất) của y. CHT sử dụng cấu trúc dữ liệu hình học để loại bỏ các đường thẳng không thuộc bao lồi, hỗ trợ truy vấn trong O(log N)."
  },
  REROOTING: {
    id: 'REROOTING',
    name: "Quy Hoạch Động Đổi Gốc Cây",
    category: "TREE",
    complexity: "O(N)",
    sourceBadge: "LeetCode 834",
    desc: "Quy hoạch động 2 lượt duyệt DFS đổi gốc cây để tính kết quả cho toàn bộ N đỉnh trong thời gian tuyến tính O(N).",
    help: "Dòng 1: N (Số đỉnh của cây)\nN-1 dòng tiếp theo: u v (Cạnh nối)",
    tags: ["Đổi Gốc Cây", "2 Lượt Duyệt DFS", "LeetCode 834"],
    keywords: ["doi goc cay", "rerooting", "dfs", "leetcode 834", "cay dp"],
    problemStatement: "Trong các bài toán trên cây cần tìm đáp án độc lập khi lần lượt giả định từng đỉnh từ 1 đến N làm gốc của cây, kỹ thuật đổi gốc (Tree Rerooting DP) cho phép chuyển gốc từ đỉnh u sang đỉnh lân cận v bằng cách tái cấu trúc thông tin quy hoạch động chỉ qua hai lượt duyệt DFS với tổng thời gian O(N)."
  },
  DICE: {
    id: 'DICE',
    name: "Tổ Hợp Xúc Xắc (CSES Dice Combinations)",
    category: "DP_BASIC",
    complexity: "O(N · 6)",
    sourceBadge: "CSES #1633",
    desc: "Đếm số cách tạo ra tổng điểm N bằng các lần gieo xúc xắc từ 1 đến 6 theo modulo 10^9+7.",
    help: "Dòng 1: N (Tổng điểm mục tiêu)",
    tags: ["CSES #1633", "DP 1 Chiều", "Modulo 10^9+7"],
    keywords: ["xuc xac", "dice", "cses 1633", "tong", "dice combinations"],
    problemStatement: "Bạn có một con xúc xắc 6 mặt (giá trị từ 1 đến 6) và được gieo xúc xắc bao nhiêu lần tùy ý. Cho số nguyên N, hãy tính số tổ hợp các lần gieo (có phân biệt thứ tự) sao cho tổng các mặt gieo được đúng bằng N theo modulo 10^9+7."
  },
  MINIMIZING_COINS: {
    id: 'MINIMIZING_COINS',
    name: "Đổi Ít Xu Nhất (CSES Minimizing Coins)",
    category: "DP_BASIC",
    complexity: "O(N · X)",
    sourceBadge: "CSES #1634",
    desc: "Tìm số lượng đồng xu ít nhất để tạo ra tổng số tiền X (hoặc trả về -1 nếu không thể tạo được).",
    help: "Dòng 1: N X (Số mệnh giá và số tiền mục tiêu)\nDòng 2: Mảng N mệnh giá xu (c1 c2 ... cn)",
    tags: ["CSES #1634", "Đổi Tiền Tối Thiểu", "Quy Hoạch Động"],
    keywords: ["dong xu", "coins", "cses 1634", "so luong it nhat", "doi tien", "minimizing coins"],
    problemStatement: "Cho số tiền mục tiêu X và N mệnh giá đồng xu phân biệt với số lượng không giới hạn. Hãy tìm số lượng đồng xu ít nhất cần dùng để ghép thành đúng tổng số tiền X, hoặc in ra -1 nếu không có cách nào tạo được tổng đó."
  },
  COIN_COMBINATIONS_1: {
    id: 'COIN_COMBINATIONS_1',
    name: "Tổ Hợp Đồng Xu I (CSES Coin Combinations I)",
    category: "DP_BASIC",
    complexity: "O(N · X)",
    sourceBadge: "CSES #1635",
    desc: "Đếm số cách tạo ra số tiền X khi thứ tự chọn đồng xu quan trọng (bài toán hoán vị).",
    help: "Dòng 1: N X (Số mệnh giá và số tiền mục tiêu)\nDòng 2: Mảng N mệnh giá xu (c1 c2 ... cn)",
    tags: ["CSES #1635", "Hoán Vị Có Thứ Tự", "CSES DP"],
    keywords: ["dong xu", "coins", "cses 1635", "hoan vi", "thu tu quan trong", "coin combinations 1"],
    problemStatement: "Cho số tiền mục tiêu X và N mệnh giá đồng xu khác nhau. Hãy đếm số cách tạo ra tổng số tiền X. Hai cách chọn có cùng tập hợp đồng xu nhưng khác nhau về thứ tự chọn vẫn được tính là hai cách riêng biệt."
  },
  COIN_COMBINATIONS_2: {
    id: 'COIN_COMBINATIONS_2',
    name: "Tổ Hợp Đồng Xu II (CSES Coin Combinations II)",
    category: "DP_BASIC",
    complexity: "O(N · X)",
    sourceBadge: "CSES #1636",
    desc: "Đếm số cách tạo ra số tiền X khi KHÔNG quan tâm thứ tự chọn đồng xu (bài toán tổ hợp).",
    help: "Dòng 1: N X (Số mệnh giá và số tiền mục tiêu)\nDòng 2: Mảng N mệnh giá xu (c1 c2 ... cn)",
    tags: ["CSES #1636", "Tổ Hợp Không Thứ Tự", "CSES DP"],
    keywords: ["dong xu", "coins", "cses 1636", "to hop", "khong quan tam thu tu", "coin combinations 2"],
    problemStatement: "Cho số tiền mục tiêu X và N mệnh giá đồng xu. Hãy đếm số tổ hợp cách chọn đồng xu để tạo ra tổng X. Điểm khác biệt so với phần I là ở đây thứ tự chọn không quan trọng (ví dụ tổ hợp 2+3 và 3+2 chỉ tính là một tổ hợp duy nhất)."
  },
  REMOVING_DIGITS: {
    id: 'REMOVING_DIGITS',
    name: "Trừ Chữ Số (CSES Removing Digits)",
    category: "DP_BASIC",
    complexity: "O(N · 9)",
    sourceBadge: "CSES #1637",
    desc: "Ở mỗi bước trừ đi một chữ số bất kỳ xuất hiện trong N, tìm số bước ít nhất để đưa N về 0.",
    help: "Dòng 1: N (Số nguyên dương ban đầu)",
    tags: ["CSES #1637", "Trừ Chữ Số Lớn Nhất", "Tham Lam & Quy Hoạch Động"],
    keywords: ["tru chu so", "cses 1637", "digits", "so buoc it nhat", "removing digits"],
    problemStatement: "Cho một số nguyên dương N. Tại mỗi bước, bạn được phép trừ N đi một giá trị đúng bằng một trong các chữ số xuất hiện trong biểu diễn thập phân của N. Hãy tìm số bước ít nhất để đưa N về bằng 0."
  },
  GRID_PATHS: {
    id: 'GRID_PATHS',
    name: "Đường Đi Trên Lưới (CSES Grid Paths I)",
    category: "DP_BASIC",
    complexity: "O(N²)",
    sourceBadge: "CSES #1638",
    desc: "Đếm số đường đi an toàn từ ô (1,1) đến ô (N,N) trên lưới NxN tránh các ô chướng ngại vật '*'.",
    help: "Dòng 1: N (Kích thước lưới N x N)\nN dòng tiếp theo: Mỗi dòng N ký tự ('.' là ô đi được, '*' là chướng ngại vật)",
    tags: ["CSES #1638", "Đường Đi Trên Lưới 2D", "Tránh Ô Chướng Ngại Vật '*'"],
    keywords: ["duong di tren luoi", "grid paths", "cses 1638", "me cung", "bay"],
    problemStatement: "Cho lưới ô vuông ma trận kích thước N x N với một số ô bị đánh dấu chướng ngại vật '*'. Xuất phát từ ô trên cùng bên trái (0, 0) và chỉ được di chuyển sang phải hoặc đi xuống, hãy tính số đường đi an toàn để đến ô đích ở góc dưới cùng bên phải (N-1, N-1)."
  },
  BOOK_SHOP: {
    id: 'BOOK_SHOP',
    name: "Hiệu Sách (CSES Book Shop)",
    category: "DP_BASIC",
    complexity: "O(N · X)",
    sourceBadge: "CSES #1158",
    desc: "Chọn mua sách để tối đa hóa tổng số trang đọc được với ngân sách tối đa X (biến thể ba lô 0/1).",
    help: "Dòng 1: N X (Số cuốn sách và ngân sách tối đa)\nDòng 2: Mảng N giá sách (h1 h2 ... hn)\nDòng 3: Mảng N số trang sách (s1 s2 ... sn)",
    tags: ["CSES #1158", "Mua Sách Ba Lô", "Ngân Sách Tối Đa"],
    keywords: ["mua sach", "book shop", "cses 1158", "ngan sach", "trang sach", "knapsack"],
    problemStatement: "Tại một hiệu sách có N cuốn sách, cuốn thứ i có giá H[i] đồng và gồm S[i] trang. Với ngân sách giới hạn tối đa là X đồng, hãy chọn mua các cuốn sách sao cho thu được tổng số trang sách đọc được nhiều nhất có thể."
  },
  SPARSE_TABLE: {
    id: 'SPARSE_TABLE',
    name: "Bảng Thưa RMQ (Sparse Table)",
    category: "DP",
    complexity: "O(N log N) / O(1)",
    sourceBadge: "Tiền Xử Lý Lũy Thừa 2",
    desc: "Tiền xử lý bảng thưa lũy thừa của 2 để truy vấn phần tử nhỏ nhất trên đoạn (Range Minimum Query) trong thời gian O(1).",
    help: "Dòng 1: N (Số phần tử mảng)\nDòng 2: Mảng N số nguyên\nDòng 3: Q (Số lượng truy vấn)\nQ dòng tiếp theo: L R (Chỉ số 0-indexed)",
    tags: ["Bảng Thưa (Sparse Table)", "RMQ Tĩnh", "Truy Vấn O(1)", "Lũy Thừa 2"],
    keywords: ["sparse table", "rmq", "bang thua", "range minimum query", "luy thua 2", "idempotent", "truy van doan"],
    problemStatement: "Cho một dãy số nguyên gồm N phần tử và Q truy vấn đoạn [L, R]. Với cấu trúc dữ liệu Bảng Thưa (Sparse Table), ta tiền xử lý các đoạn con có độ dài lũy thừa của 2 (1, 2, 4, 8, ...) bằng quy hoạch động trong O(N log N). Do phép toán lấy cực trị (min/max) có tính chất lũy đẳng (idempotent: min(x, x) = x), ta có thể phủ kín bất kỳ đoạn [L, R] nào bằng hai đoạn con độ dài 2^k chồng lấn nhau (với k = ⌊log₂(R - L + 1)⌋), từ đó trả lời mỗi truy vấn RMQ chỉ mất thời gian O(1)."
  },
  TRIE: {
    id: 'TRIE',
    name: "Cây Tiền Tố (Trie)",
    category: "STRING",
    complexity: "O(L)",
    sourceBadge: "Cấu Trúc Dữ Liệu Bất Biến",
    desc: "Cấu trúc cây đa phân hỗ trợ tra cứu chuỗi con, tiền tố, autocomplete với thời gian tỷ lệ thuận theo độ dài chuỗi O(L).",
    help: "Dòng 1: N (Số lượng từ điển cần thêm)\nN dòng tiếp theo: Mỗi dòng 1 từ viết thường\nDòng tiếp theo: Q (Số lượng truy vấn)\nQ dòng tiếp theo: SEARCH <từ> hoặc PREFIX <tiền_tố>",
    tags: ["Cây Tiền Tố (Trie)", "Xử Lý Chuỗi O(L)", "Automata Cơ Bản"],
    keywords: ["trie", "cay tien to", "chuoi", "string", "prefix", "tu dien", "search"],
    problemStatement: "Cho một tập từ điển ban đầu. Bạn cần xây dựng cấu trúc dữ liệu cho phép: (1) Thêm một từ mới vào tập hợp, (2) Kiểm tra xem một từ đã có trong tập hợp hay chưa (word search), và (3) Kiểm tra xem có bất kì từ nào trong tập hợp bắt đầu bằng một chuỗi tiền tố hay không (prefix match). Tất cả các thao tác phải đạt thời gian thực thi O(L), với L là chiều dài của chuỗi mục tiêu."
  },

  BINARY_SEQUENCE: {
    id: 'BINARY_SEQUENCE',
    name: 'Sinh Dãy Nhị Phân',
    category: 'BACKTRACKING',
    complexity: 'O(2^N)',
    sourceBadge: 'Backtracking',
    desc: 'Sinh tất cả các cấu hình nhị phân độ dài N bằng quay lui trên không gian trạng thái.',
    help: 'Khởi tạo n: độ dài chuỗi nhị phân (vd: 3 hoặc 4).',
    tags: ['Sinh', 'Quay lui', 'Tập con']
  },
  PERMUTATION: {
    id: 'PERMUTATION',
    name: 'Sinh Hoán Vị',
    category: 'BACKTRACKING',
    complexity: 'O(N!)',
    sourceBadge: 'Backtracking',
    desc: 'Liệt kê không gian trạng thái các cấu trúc hoán vị của N phần tử.',
    help: 'Sử dụng mảng đánh dấu (used) để loại bỏ các phần tử đã chọn đi sâu vào cây cấu hình.',
    tags: ['Hoán vị', 'Quay lui']
  },
  COMBINATION: {
    id: 'COMBINATION',
    name: 'Sinh Tổ Hợp',
    category: 'BACKTRACKING',
    complexity: 'O(C(N, K))',
    sourceBadge: 'Backtracking',
    desc: 'Theo dõi sinh tập tổ hợp chập K của N phần tử theo thứ tự từ điển, với nhánh luôn thoả mãn.',
    help: 'Sử dụng phần tử nhánh luôn lớn hơn để tránh trùng lặp. Thiết lập C và N.',
    tags: ['Tổ hợp', 'Quay lui']
  },
  SUBSET: {
    id: 'SUBSET',
    name: 'Sinh Tập Con',
    category: 'BACKTRACKING',
    complexity: 'O(2^N)',
    sourceBadge: 'Backtracking',
    desc: 'Mô phỏng cây trạng thái đệ quy liệt kê mọi tập con của một tập hợp N phần tử.',
    help: 'Quyết định thêm hoặc không thêm theo chiều đệ quy sâu.',
    tags: ['Tập con', 'Quay lui']
  }
};
;

export const CATEGORY_ITEMS: CategoryItem[] = [
  { id: 'ALL', label: 'Tất Cả', icon: LayoutGrid },
  { id: 'DP_BASIC', label: 'DP CSES', icon: Coins },
  { id: 'DP', label: 'DP Nâng Cao', icon: Layers },
  { id: 'GRAPH', label: 'Đồ Thị & Luồng', icon: Network },
  { id: 'TREE', label: 'Cấu Trúc Cây', icon: GitBranch },
  { id: 'BACKTRACKING', label: 'Quay Lui', icon: Cpu },
  { id: 'STRING', label: 'Xử Lý Chuỗi', icon: Terminal }
];

export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  DP_BASIC: {
    color: 'emerald',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-400',
    badgeBorder: 'border border-emerald-500/30',
    borderHover: 'hover:border-emerald-400/40 hover:shadow-md',
    glow: 'rgba(16,185,129,0.15)',
    accentBar: '#10b981'
  },
  DP: {
    color: 'purple',
    badgeBg: 'bg-purple-500/10',
    badgeText: 'text-purple-300',
    badgeBorder: 'border border-purple-500/30',
    borderHover: 'hover:border-purple-400/40 hover:shadow-md',
    glow: 'rgba(168,85,247,0.15)',
    accentBar: '#a855f7'
  },
  GRAPH: {
    color: 'sky',
    badgeBg: 'bg-sky-500/10',
    badgeText: 'text-sky-400',
    badgeBorder: 'border border-sky-500/30',
    borderHover: 'hover:border-sky-400/40 hover:shadow-md',
    glow: 'rgba(14,165,233,0.15)',
    accentBar: '#0ea5e9'
  },
  TREE: {
    color: 'amber',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-400',
    badgeBorder: 'border border-amber-500/30',
    borderHover: 'hover:border-amber-400/40 hover:shadow-md',
    glow: 'rgba(245,158,11,0.15)',
    accentBar: '#f59e0b'
  },
  BACKTRACKING: {
    color: 'rose',
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-400',
    badgeBorder: 'border border-rose-500/30',
    borderHover: 'hover:border-rose-400/40 hover:shadow-md',
    glow: 'rgba(244,63,94,0.15)',
    accentBar: '#f43f5e'
  },
  STRING: {
    color: 'fuchsia',
    badgeBg: 'bg-fuchsia-500/10',
    badgeText: 'text-fuchsia-300',
    badgeBorder: 'border border-fuchsia-500/30',
    borderHover: 'hover:border-fuchsia-400/40 hover:shadow-md',
    glow: 'rgba(217,70,239,0.15)',
    accentBar: '#d946ef'
  }
};
