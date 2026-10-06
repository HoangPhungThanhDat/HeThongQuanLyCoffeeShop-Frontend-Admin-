import { useState, useMemo } from "react";
import {
  Card,
  Typography,
  Button,
} from "@material-tailwind/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  SparklesIcon,
  ChevronDownIcon,
  InformationCircleIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  UsersIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  LifebuoyIcon,
  ArrowRightIcon,
  PaperAirplaneIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

// ==================== FAQ DATA ====================
const FAQ_DATA = [
  {
    category: "Tài khoản",
    icon: UsersIcon,
    gradient: "from-blue-500 to-indigo-600",
    bg: "from-blue-50 to-indigo-50",
    questions: [
      {
        q: "Làm thế nào để tạo tài khoản nhân viên mới?",
        a: "Vào menu Quản lý thành viên → Nhấn nút 'Thêm người dùng' → Điền đầy đủ thông tin (username, mật khẩu, họ tên, email, vai trò) → Nhấn 'Tạo tài khoản'. Hệ thống sẽ gửi email thông báo cho nhân viên.",
      },
      {
        q: "Tôi quên mật khẩu, làm sao để khôi phục?",
        a: "Nhấn vào 'Quên mật khẩu' ở trang đăng nhập, nhập email đã đăng ký. Hệ thống sẽ gửi link khôi phục mật khẩu qua email trong vòng 5 phút. Nếu không nhận được, vui lòng kiểm tra Spam hoặc liên hệ IT Support.",
      },
      {
        q: "Làm sao để phân quyền cho nhân viên?",
        a: "Vào menu Hệ thống → Phân quyền → Chọn vai trò cần chỉnh sửa → Bật/tắt các quyền tương ứng → Nhấn 'Lưu thay đổi'. Lưu ý: Chỉ Admin mới có quyền truy cập tính năng này.",
      },
    ],
  },
  {
    category: "Đơn hàng",
    icon: ClipboardDocumentListIcon,
    gradient: "from-green-500 to-emerald-600",
    bg: "from-green-50 to-emerald-50",
    questions: [
      {
        q: "Làm sao để tạo đơn hàng mới?",
        a: "Vào Quản lý đơn hàng → Nhấn 'Tạo đơn hàng' → Chọn bàn, nhân viên phục vụ, sản phẩm, số lượng → Nhấn 'Tạo đơn'. Đơn hàng sẽ tự động hiển thị trong danh sách với trạng thái 'Chờ xác nhận'.",
      },
      {
        q: "Tôi có thể hủy đơn hàng đã tạo không?",
        a: "Có, nhưng chỉ khi đơn hàng ở trạng thái 'Chờ xác nhận' hoặc 'Đã xác nhận'. Vào chi tiết đơn hàng → Nhấn 'Hủy đơn' → Xác nhận. Đơn hàng đã thanh toán hoặc đã phục vụ không thể hủy.",
      },
      {
        q: "Làm sao để in hóa đơn?",
        a: "Vào Quản lý hóa đơn → Tìm hóa đơn cần in → Nhấn biểu tượng máy in → Chọn máy in và khổ giấy → Nhấn 'In'. Hệ thống hỗ trợ in khổ A4 và A5.",
      },
    ],
  },
  {
    category: "Sản phẩm",
    icon: ShoppingBagIcon,
    gradient: "from-amber-500 to-orange-600",
    bg: "from-amber-50 to-orange-50",
    questions: [
      {
        q: "Làm sao để thêm sản phẩm mới vào menu?",
        a: "Vào Quản lý sản phẩm → Nhấn 'Thêm sản phẩm' → Upload ảnh, điền tên, mô tả, giá, số lượng tồn kho, chọn danh mục → Nhấn 'Tạo sản phẩm'. Sản phẩm sẽ hiển thị ngay trên menu.",
      },
      {
        q: "Làm sao để cảnh báo khi hàng sắp hết?",
        a: "Hệ thống tự động cảnh báo khi tồn kho dưới 10 sản phẩm. Vào Báo cáo → Báo cáo kho hàng để xem danh sách sản phẩm cần nhập thêm. Có thể bật thông báo qua Email trong phần Cài đặt.",
      },
      {
        q: "Tôi muốn đổi giá sản phẩm hàng loạt thì làm thế nào?",
        a: "Hiện tại hệ thống chưa hỗ trợ đổi giá hàng loạt. Vui lòng vào từng sản phẩm và chỉnh sửa giá. Tính năng cập nhật hàng loạt sẽ có trong phiên bản v3.0 sắp tới.",
      },
    ],
  },
  {
    category: "Báo cáo",
    icon: ChartBarIcon,
    gradient: "from-purple-500 to-fuchsia-600",
    bg: "from-purple-50 to-fuchsia-50",
    questions: [
      {
        q: "Làm sao để xuất báo cáo doanh thu?",
        a: "Vào Báo cáo → Báo cáo doanh thu → Chọn khoảng thời gian (Hôm nay/Tuần/Tháng/Năm) → Nhấn 'Xuất báo cáo'. File CSV sẽ được tải xuống tự động với đầy đủ dữ liệu chi tiết.",
      },
      {
        q: "Biểu đồ doanh thu cập nhật khi nào?",
        a: "Biểu đồ cập nhật theo thời gian thực (realtime), ngay khi có đơn hàng được đánh dấu 'Đã thanh toán'. Dữ liệu hiển thị tối đa 30 ngày gần nhất hoặc theo khoảng thời gian bạn chọn.",
      },
    ],
  },
  {
    category: "Hệ thống",
    icon: Cog6ToothIcon,
    gradient: "from-red-500 to-rose-600",
    bg: "from-red-50 to-rose-50",
    questions: [
      {
        q: "Làm sao để sao lưu dữ liệu?",
        a: "Vào Hệ thống → Cài đặt → Tab Bảo mật → Bật 'Tự động sao lưu' và chọn tần suất (Mỗi giờ/Hàng ngày/Hàng tuần). Cũng có thể nhấn 'Sao lưu ngay' để sao lưu thủ công bất kỳ lúc nào.",
      },
      {
        q: "Tôi muốn xem nhật ký hoạt động của hệ thống?",
        a: "Vào Hệ thống → Nhật ký hệ thống. Tại đây bạn có thể xem tất cả hoạt động (đăng nhập, tạo, sửa, xóa) với đầy đủ thông tin: người dùng, thời gian, IP, thiết bị.",
      },
    ],
  },
];

// ==================== QUICK ACTIONS ====================
const QUICK_ACTIONS = [
  {
    title: "Hướng dẫn bắt đầu",
    description: "Làm quen với hệ thống trong 5 phút",
    icon: RocketLaunchIcon,
    gradient: "from-[#8B5E3C] to-[#6d4c41]",
    tag: "Beginner",
  },
  {
    title: "Quản lý đơn hàng",
    description: "Cách tạo và xử lý đơn hàng hiệu quả",
    icon: ClipboardDocumentListIcon,
    gradient: "from-green-500 to-emerald-600",
    tag: "Popular",
  },
  {
    title: "Báo cáo & Thống kê",
    description: "Phân tích doanh thu và xu hướng kinh doanh",
    icon: ChartBarIcon,
    gradient: "from-blue-500 to-indigo-600",
    tag: "Advanced",
  },
  {
    title: "Bảo mật & Phân quyền",
    description: "Bảo vệ tài khoản và quản lý quyền truy cập",
    icon: ShieldCheckIcon,
    gradient: "from-purple-500 to-fuchsia-600",
    tag: "Security",
  },
];

// ==================== COMPONENT ====================
export function Help() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openAccordion, setOpenAccordion] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // ==================== FILTER FAQ ====================
  const filteredFAQ = useMemo(() => {
    let result = FAQ_DATA;

    if (selectedCategory !== "ALL") {
      result = result.filter((c) => c.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result
        .map((cat) => ({
          ...cat,
          questions: cat.questions.filter(
            (q) =>
              q.q.toLowerCase().includes(term) ||
              q.a.toLowerCase().includes(term)
          ),
        }))
        .filter((cat) => cat.questions.length > 0);
    }

    return result;
  }, [searchTerm, selectedCategory]);

  // ==================== HANDLERS ====================
  const handleSendTicket = () => {
    Swal.fire({
      title: "Gửi yêu cầu hỗ trợ?",
      html: `
        <div style="text-align:left">
          <p style="font-size:13px;color:#6d4c41;margin-bottom:8px">Chúng tôi sẽ phản hồi trong vòng 24 giờ.</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#8B5E3C",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Gửi ngay",
      cancelButtonText: "Hủy",
    }).then((r) => {
      if (r.isConfirmed) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Đã gửi yêu cầu hỗ trợ!",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  const handleContact = (method) => {
    Swal.fire({
      title: `Liên hệ qua ${method}`,
      text:
        method === "Email"
          ? "support@coffeeshop.vn"
          : method === "Hotline"
          ? "1900 1234 (8:00 - 22:00)"
          : "Live chat đang mở...",
      icon: "info",
      confirmButtonColor: "#8B5E3C",
      confirmButtonText: "Đã hiểu",
    });
  };

  // ==================== RENDER ====================
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#faf6f1] via-[#fffaf5] to-[#f5ede3] py-6 lg:py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col gap-6">

        {/* ===== PAGE HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <motion.div
            className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-lg shadow-[#8B5E3C]/30 flex-shrink-0"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <QuestionMarkCircleIcon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
          </motion.div>
          <div>
            <Typography
              variant="h4"
              className="font-extrabold text-[#4e342e] tracking-tight text-2xl lg:text-3xl"
            >
              Trung Tâm Trợ Giúp
            </Typography>
            <Typography className="text-xs lg:text-sm text-[#8B5E3C] font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7 ☕
            </Typography>
          </div>
        </motion.div>

        {/* ===== HERO SEARCH ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4e342e] via-[#6d4c41] to-[#8B5E3C] p-8 lg:p-12 shadow-2xl"
        >
          {/* Decorations */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-amber-300 blur-3xl" />
          </div>
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />

          {/* Steam particles */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-0 w-1 rounded-full bg-white/20"
              style={{ left: `${20 + i * 8}%`, height: 40 + i * 12 }}
              animate={{ y: [-5, -40, -5], opacity: [0.2, 0.5, 0.2] }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            />
          ))}

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 mb-5"
            >
              <LifebuoyIcon className="w-3.5 h-3.5 text-amber-200" />
              <span className="text-[10px] font-extrabold text-white uppercase tracking-widest">
                Support Center
              </span>
            </motion.div>

            <Typography
              variant="h2"
              className="font-extrabold text-white mb-3 drop-shadow-lg text-2xl lg:text-4xl"
            >
              Chúng tôi có thể giúp gì cho bạn?
            </Typography>
            <Typography className="text-sm lg:text-base text-white/80 mb-7 max-w-xl mx-auto leading-relaxed">
              Tìm kiếm câu trả lời cho câu hỏi của bạn hoặc liên hệ với đội ngũ hỗ trợ
              của chúng tôi
            </Typography>

            {/* Search bar */}
            <div className="relative max-w-2xl mx-auto">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B5E3C]" />
              <input
                type="text"
                placeholder="Tìm kiếm câu hỏi, hướng dẫn, tính năng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-2 border-white/30 text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl"
              />
            </div>

            {/* Quick tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              <Typography className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                Phổ biến:
              </Typography>
              {["Tạo đơn hàng", "In hóa đơn", "Phân quyền", "Báo cáo"].map(
                (tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-[10px] font-bold text-white transition-all duration-200 hover:scale-105"
                  >
                    {tag}
                  </button>
                )
              )}
            </div>
          </div>
        </motion.div>

        {/* ===== QUICK ACTIONS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <div className="w-1 h-6 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
          <Typography className="font-extrabold text-[#4e342e] text-lg tracking-tight">
            Hướng dẫn nhanh
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        >
          {QUICK_ACTIONS.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.06 }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-md hover:shadow-2xl border border-amber-100 transition-all duration-300 text-left"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#f5ede3] to-transparent rounded-full -translate-y-12 translate-x-12 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative flex items-start justify-between mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-lg bg-[#faf6f1] border border-[#C89F77]/30 text-[9px] font-extrabold text-[#8B5E3C] uppercase tracking-wider">
                    {action.tag}
                  </span>
                </div>

                <Typography className="text-sm font-extrabold text-[#4e342e] mb-1">
                  {action.title}
                </Typography>
                <Typography className="text-[11px] text-gray-500 leading-relaxed mb-3">
                  {action.description}
                </Typography>

                <div className="flex items-center gap-1.5 text-[#8B5E3C] group-hover:gap-2.5 transition-all duration-300">
                  <Typography className="text-[10px] font-extrabold uppercase tracking-wider">
                    Xem hướng dẫn
                  </Typography>
                  <ArrowRightIcon className="w-3 h-3" strokeWidth={2.5} />
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* ===== FAQ SECTION ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-3 mt-2"
        >
          <div className="w-1 h-6 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
          <Typography className="font-extrabold text-[#4e342e] text-lg tracking-tight">
            Câu hỏi thường gặp (FAQ)
          </Typography>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-white border border-amber-100 shadow-sm"
        >
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-3.5 py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wider transition-all duration-200 ${
              selectedCategory === "ALL"
                ? "bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] text-white shadow-lg shadow-[#8B5E3C]/30"
                : "bg-[#faf6f1] text-[#6d4c41] border border-[#C89F77]/30 hover:border-[#8B5E3C]"
            }`}
          >
            🎯 Tất cả
          </button>
          {FAQ_DATA.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.category;
            return (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(cat.category)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? `bg-gradient-to-r ${cat.gradient} text-white shadow-lg`
                    : "bg-[#faf6f1] text-[#6d4c41] border border-[#C89F77]/30 hover:border-[#8B5E3C]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
                {cat.category}
              </button>
            );
          })}
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {filteredFAQ.length === 0 ? (
            <Card className="rounded-3xl border border-amber-100 shadow-xl bg-white p-16">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] flex items-center justify-center mb-3">
                  <MagnifyingGlassIcon className="w-10 h-10 text-[#C89F77]" />
                </div>
                <Typography className="text-sm font-bold text-[#8B5E3C] mb-1">
                  Không tìm thấy câu hỏi nào
                </Typography>
                <Typography className="text-xs text-gray-400 mb-4">
                  Thử từ khóa khác hoặc liên hệ hỗ trợ
                </Typography>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] rounded-lg normal-case font-bold flex items-center gap-1.5 mx-auto"
                  onClick={handleSendTicket}
                >
                  <PaperAirplaneIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Gửi yêu cầu
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-5">
              {filteredFAQ.map((cat, catIdx) => {
                const CatIcon = cat.icon;
                return (
                  <motion.div
                    key={cat.category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + catIdx * 0.08 }}
                  >
                    <Card className="rounded-3xl border border-amber-100 shadow-xl bg-white overflow-hidden">
                      {/* Category header */}
                      <div className="p-4 border-b border-amber-100 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5] flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-lg`}
                        >
                          <CatIcon className="w-5 h-5 text-white" strokeWidth={2.2} />
                        </div>
                        <div>
                          <Typography className="font-extrabold text-[#4e342e] text-sm">
                            {cat.category}
                          </Typography>
                          <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                            {cat.questions.length} câu hỏi
                          </Typography>
                        </div>
                      </div>

                      {/* Questions */}
                      <div className="divide-y divide-amber-50">
                        {cat.questions.map((faq, qIdx) => {
                          const globalIdx = catIdx * 100 + qIdx;
                          const isOpen = openAccordion === globalIdx;
                          return (
                            <div key={qIdx} className="group">
                              <button
                                onClick={() =>
                                  setOpenAccordion(isOpen ? -1 : globalIdx)
                                }
                                className="w-full flex items-center justify-between gap-4 p-4 lg:p-5 hover:bg-gradient-to-r hover:from-[#faf6f1] hover:to-[#fffaf5] transition-all duration-200 text-left"
                              >
                                <div className="flex items-start gap-3 min-w-0 flex-1">
                                  <div
                                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                      isOpen
                                        ? `bg-gradient-to-br ${cat.gradient} shadow-md`
                                        : "bg-[#faf6f1] border border-[#C89F77]/30"
                                    }`}
                                  >
                                    <QuestionMarkCircleIcon
                                      className={`w-4 h-4 ${
                                        isOpen ? "text-white" : "text-[#8B5E3C]"
                                      }`}
                                      strokeWidth={2.5}
                                    />
                                  </div>
                                  <Typography
                                    className={`text-sm font-extrabold transition-colors ${
                                      isOpen
                                        ? "text-[#8B5E3C]"
                                        : "text-[#4e342e]"
                                    }`}
                                  >
                                    {faq.q}
                                  </Typography>
                                </div>
                                <motion.div
                                  animate={{ rotate: isOpen ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="flex-shrink-0"
                                >
                                  <ChevronDownIcon
                                    className={`w-4 h-4 ${
                                      isOpen ? "text-[#8B5E3C]" : "text-gray-400"
                                    }`}
                                    strokeWidth={2.5}
                                  />
                                </motion.div>
                              </button>

                              <AnimatePresence initial={false}>
                                {isOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-5 pb-5 pl-16">
                                      <div
                                        className={`p-4 rounded-xl bg-gradient-to-br ${cat.bg || "from-[#faf6f1] to-[#fffaf5]"} border-l-4 border-[#8B5E3C]`}
                                      >
                                        <div className="flex items-start gap-2">
                                          <LightBulbIcon
                                            className="w-4 h-4 text-[#8B5E3C] flex-shrink-0 mt-0.5"
                                            strokeWidth={2.2}
                                          />
                                          <Typography className="text-xs text-gray-700 leading-relaxed">
                                            {faq.a}
                                          </Typography>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* ===== CONTACT SUPPORT ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center gap-3 mt-2"
        >
          <div className="w-1 h-6 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
          <Typography className="font-extrabold text-[#4e342e] text-lg tracking-tight">
            Liên hệ hỗ trợ
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {[
            {
              title: "Email hỗ trợ",
              value: "support@coffeeshop.vn",
              description: "Phản hồi trong 24 giờ",
              icon: EnvelopeIcon,
              gradient: "from-blue-500 to-indigo-600",
              action: "Email",
            },
            {
              title: "Hotline",
              value: "1900 1234",
              description: "8:00 - 22:00 hàng ngày",
              icon: PhoneIcon,
              gradient: "from-green-500 to-emerald-600",
              action: "Hotline",
            },
            {
              title: "Live Chat",
              value: "Chat ngay",
              description: "Trò chuyện trực tuyến",
              icon: ChatBubbleLeftRightIcon,
              gradient: "from-purple-500 to-fuchsia-600",
              action: "Live Chat",
            },
          ].map((contact, i) => {
            const Icon = contact.icon;
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.06 }}
                whileHover={{ y: -4 }}
                onClick={() => handleContact(contact.action)}
                className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-md hover:shadow-2xl border border-amber-100 transition-all duration-300 text-left"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#f5ede3] to-transparent rounded-full -translate-y-12 translate-x-12 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${contact.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography className="text-[10px] font-extrabold uppercase text-gray-400 tracking-widest mb-1">
                      {contact.title}
                    </Typography>
                    <Typography className="text-sm font-extrabold text-[#4e342e] group-hover:text-[#8B5E3C] transition-colors truncate">
                      {contact.value}
                    </Typography>
                    <Typography className="text-[10px] text-gray-500 mt-0.5">
                      {contact.description}
                    </Typography>
                  </div>
                  <ArrowTopRightOnSquareIcon
                    className="w-4 h-4 text-[#C89F77] group-hover:text-[#8B5E3C] transition-colors flex-shrink-0"
                    strokeWidth={2.2}
                  />
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* ===== SEND TICKET CTA ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4e342e] via-[#6d4c41] to-[#8B5E3C] p-8 shadow-2xl"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-amber-300 blur-3xl" />
          </div>

          <div className="relative flex flex-col md:flex-row items-center gap-5">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
              <PaperAirplaneIcon className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <Typography
                variant="h5"
                className="font-extrabold text-white mb-1 drop-shadow"
              >
                Không tìm thấy câu trả lời?
              </Typography>
              <Typography className="text-sm text-white/85 leading-relaxed">
                Gửi yêu cầu hỗ trợ cho đội ngũ IT của chúng tôi. Chúng tôi sẽ
                phản hồi trong vòng 24 giờ làm việc.
              </Typography>
            </div>
            <Button
              size="lg"
              onClick={handleSendTicket}
              className="bg-white text-[#6d4c41] hover:bg-amber-50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl normal-case font-bold flex items-center gap-2 px-6 py-3.5 flex-shrink-0"
            >
              <PaperAirplaneIcon className="w-4 h-4" strokeWidth={2.5} />
              Gửi yêu cầu hỗ trợ
            </Button>
          </div>
        </motion.div>

        {/* ===== INFO NOTE ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
        >
          <InformationCircleIcon className="h-5 w-5 text-[#8B5E3C] flex-shrink-0 mt-0.5" />
          <Typography className="text-xs text-[#6d4c41] leading-relaxed">
            <span className="font-bold">Ghi chú:</span> Trung tâm Trợ giúp cung
            cấp hướng dẫn, FAQ và kênh liên hệ hỗ trợ. Nếu cần trợ giúp khẩn
            cấp, vui lòng gọi Hotline <span className="font-bold">1900 1234</span>.
            Đội ngũ IT luôn sẵn sàng hỗ trợ bạn từ 8:00 - 22:00 hàng ngày.
          </Typography>
        </motion.div>

        {/* ===== FOOTER ===== */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-amber-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center text-xs">
              ☕
            </div>
            <Typography className="text-xs text-[#6d4c41] font-bold">
              Coffee Shop Admin © 2025
            </Typography>
          </div>
          <Typography className="text-[10px] text-gray-400 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Support Center đang hoạt động
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default Help;