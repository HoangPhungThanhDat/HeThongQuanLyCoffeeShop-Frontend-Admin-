import {
  HomeIcon,
  UserCircleIcon,
  InformationCircleIcon,
  ServerStackIcon,
  Squares2X2Icon,
  ShoppingBagIcon,
  RectangleStackIcon,
  GiftIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  DocumentChartBarIcon,
  ChartBarIcon,
  UsersIcon,
  CubeIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  StarIcon,
  EnvelopeIcon,
  SparklesIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";

import { Home, Profile } from "@/pages/dashboard";
import { Product } from "@/pages/dashboard/product/index";
import { Category } from "@/pages/dashboard/category/index";
import { Orders } from "@/pages/dashboard/orders/index";
import { Tables } from "@/pages/dashboard/tables/index";
import { User } from "@/pages/dashboard/user/index";
import { Promotions } from "@/pages/dashboard/promotions/index";
import { OrderItems } from "@/pages/dashboard/orderitems/index";
import { Bill } from "@/pages/dashboard/bill/index";
import { SignIn, SignUp } from "@/pages/auth";

// 👇 CÁC TRANG MỚI - Chỉ cần tạo file .jsx tương ứng sau
// Ví dụ: tạo src/pages/dashboard/reports/revenue.jsx export function Revenue() {...}
import { Revenue } from "@/pages/dashboard/reports/revenue";
import { OrderReport } from "@/pages/dashboard/reports/order-report";
import { InventoryReport } from "@/pages/dashboard/reports/inventory-report";
import { Reviews } from "@/pages/dashboard/reviews/index";

import { Settings } from "@/pages/dashboard/settings/index";
import { Roles } from "@/pages/dashboard/roles/index";
import { Logs } from "@/pages/dashboard/log/index";
import { Help } from "@/pages/dashboard/help/index";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  // ============================================
  // ========== DASHBOARD - QUẢN LÝ =============
  // ============================================
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Trang chủ",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Quản lý thành viên",
        path: "/users",
        element: <User />,
      },
      {
        icon: <ShoppingBagIcon {...icon} />,
        name: "Quản lý sản phẩm",
        path: "/product",
        element: <Product />,
      },
      {
        icon: <Squares2X2Icon {...icon} />,
        name: "Quản lý danh mục",
        path: "/category",
        element: <Category />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Quản lý bàn",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <ClipboardDocumentListIcon {...icon} />,
        name: "Quản lý đơn hàng",
        path: "/orders",
        element: <Orders />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Chi tiết đơn hàng",
        path: "/orderitems",
        element: <OrderItems />,
      },
      {
        icon: <GiftIcon {...icon} />,
        name: "Quản lý khuyến mãi",
        path: "/promotions",
        element: <Promotions />,
      },
      {
        icon: <Cog6ToothIcon {...icon} />,
        name: "Quản lý hóa đơn",
        path: "/bills",
        element: <Bill />,
      },
    ],
  },

  // ============================================
  // ========== BÁO CÁO & THỐNG KÊ ==============
  // ============================================
  {
    title: "📊 Báo cáo & Thống kê",
    layout: "dashboard",
    pages: [
      {
        icon: <ChartBarIcon {...icon} />,
        name: "Báo cáo doanh thu",
        path: "/reports/revenue",
        element: <Revenue />,
      },
      {
        icon: <ClipboardDocumentListIcon {...icon} />,
        name: "Báo cáo đơn hàng",
        path: "/reports/orders",
        element: <OrderReport />,
      },
      {
        icon: <CubeIcon {...icon} />,
        name: "Báo cáo kho hàng",
        path: "/reports/inventory",
        element: <InventoryReport />,
      },
      {
        icon: <ArrowDownTrayIcon {...icon} />,
        name: "Xuất dữ liệu",
        path: "/reports/export",
        element: <Revenue />, // Tạm dùng lại Revenue
      },
    ],
  },

  // ============================================
  // ========== MARKETING =======================
  // ============================================
  {
    title: "📣 Marketing",
    layout: "dashboard",
    pages: [
      {
        icon: <StarIcon {...icon} />,
        name: "Đánh giá & Feedback",
        path: "/reviews",
        element: <Reviews />,
      },
      
      
    ],
  },

  // ============================================
  // ========== HỆ THỐNG ========================
  // ============================================
  {
    title: "⚙️ Hệ thống",
    layout: "dashboard",
    pages: [
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Hồ sơ cá nhân",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <Cog6ToothIcon {...icon} />,
        name: "Cài đặt hệ thống",
        path: "/settings",
        element: <Settings />,
      },
      {
        icon: <ShieldCheckIcon {...icon} />,
        name: "Phân quyền",
        path: "/roles",
        element: <Roles />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "Nhật ký hệ thống",
        path: "/logs",
        element: <Logs />,
      },
      {
        icon: <QuestionMarkCircleIcon {...icon} />,
        name: "Trợ giúp",
        path: "/help",
        element: <Help />,
      },
    ],
  },

  // ============================================
  // ========== AUTH (GIỮ LẠI CHO ROUTES) =======
  // ============================================
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Đăng Nhập",
        path: "/sign-in",
        element: <SignIn />,
      },
     
    ],
  },
];

export default routes;