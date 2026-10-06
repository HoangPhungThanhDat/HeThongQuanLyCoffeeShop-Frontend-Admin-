import { Typography, Tooltip } from "@material-tailwind/react";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export function UserTable({ users, onShow, onEdit, onDelete }) {
  const getRoleBadge = (role) => {
    const roleConfig = {
      ADMIN: { bg: "bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41]", text: "text-white", label: "Quản trị" },
      MANAGER: { bg: "bg-gradient-to-r from-amber-500 to-amber-600", text: "text-white", label: "Quản lý" },
      STAFF: { bg: "bg-gradient-to-r from-[#C89F77] to-[#a4714b]", text: "text-white", label: "Nhân viên" },
      USER: { bg: "bg-gradient-to-r from-gray-400 to-gray-500", text: "text-white", label: "Khách hàng" },
    };
    const config = roleConfig[role?.toUpperCase()] || roleConfig.USER;
    return (
      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${config.bg} ${config.text} shadow-sm`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-white shadow-2xl rounded-3xl overflow-hidden border border-amber-100"
      >
        <div className="h-1.5 bg-gradient-to-r from-[#8B5E3C] via-[#C89F77] to-[#8B5E3C]" />

        <div className="overflow-x-auto">
          <table className="w-full table-fixed min-w-[900px]">
            <colgroup>
              <col className="w-[6%]" />
              <col className="w-[10%]" />
              <col className="w-[16%]" />
              <col className="w-[18%]" />
              <col className="w-[24%]" />
              <col className="w-[12%]" />
              <col className="w-[14%]" />
              <col className="w-[14%]" />
            </colgroup>

            <thead>
              <tr className="bg-gradient-to-r from-[#faf6f1] via-[#f5ede3] to-[#faf6f1] border-b-2 border-amber-100">
                {["STT", "Ảnh", "Username", "Họ Tên", "Email", "Vai Trò", "Trạng Thái", "Hành Động"].map((el) => (
                  <th
                    key={el}
                    className={`py-4 px-3 lg:px-5 2xl:px-6 ${
                      el === "Hành Động" ? "text-center" : "text-left"
                    }`}
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] 2xl:text-xs font-extrabold uppercase text-[#6d4c41] tracking-wider whitespace-nowrap"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-16">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] flex items-center justify-center mb-4">
                        <span className="text-5xl">👤</span>
                      </div>
                      <Typography className="text-base text-[#8B5E3C] font-bold mb-1">
                        Chưa có người dùng nào
                      </Typography>
                      <Typography className="text-xs text-gray-400">
                        Hãy thêm người dùng mới để bắt đầu
                      </Typography>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user, index) => {
                  const className = `py-4 px-3 lg:px-5 2xl:px-6 align-middle ${
                    index === users.length - 1 ? "" : "border-b border-amber-50"
                  }`;

                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="group hover:bg-gradient-to-r hover:from-[#faf6f1] hover:to-[#fffaf5] transition-all duration-300"
                    >
                      <td className={className}>
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] group-hover:from-[#8B5E3C] group-hover:to-[#6d4c41] transition-all duration-300">
                          <Typography className="text-xs font-bold text-[#6d4c41] group-hover:text-white transition-colors">
                            {index + 1}
                          </Typography>
                        </div>
                      </td>
                      <td className={className}>
                        <div className="relative inline-block">
                          {/* ⭐ ĐÃ SỬA: dùng trực tiếp URL Cloudinary */}
                          <img
                            src={user.imageUrl || "https://via.placeholder.com/150"}
                            alt={user.fullName}
                            className="h-12 w-12 xl:h-14 xl:w-14 rounded-2xl object-cover shadow-md border-2 border-white ring-2 ring-amber-100 group-hover:ring-[#8B5E3C]/40 transition-all duration-300 group-hover:scale-105"
                          />
                          <span
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                              user.isActive ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-sm font-bold text-[#6d4c41] group-hover:text-[#8B5E3C] transition-colors truncate">
                          @{user.username}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-sm font-semibold text-gray-800 truncate">
                          {user.fullName}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-sm text-gray-600 truncate">
                          {user.email}
                        </Typography>
                      </td>
                      <td className={className}>{getRoleBadge(user.role)}</td>
                      <td className={className}>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm whitespace-nowrap ${
                            user.isActive
                              ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700"
                              : "bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-700"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.isActive ? "bg-green-500 animate-pulse" : "bg-red-500"
                            }`}
                          />
                          {user.isActive ? "Hoạt động" : "Vô hiệu hóa"}
                        </span>
                      </td>
                      <td className={`${className} text-center`}>
                        <div className="flex justify-center gap-1.5 xl:gap-2">
                          <Tooltip content="Xem chi tiết" placement="top">
                            <button
                              onClick={() => onShow(user)}
                              className="group/btn inline-flex items-center justify-center w-9 h-9 xl:w-10 xl:h-10 rounded-xl bg-white border-2 border-[#8B5E3C]/20 hover:border-[#8B5E3C] hover:bg-gradient-to-br hover:from-[#8B5E3C] hover:to-[#6d4c41] shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              <EyeIcon className="w-4 h-4 xl:w-5 xl:h-5 text-[#8B5E3C] group-hover/btn:text-white transition-colors" />
                            </button>
                          </Tooltip>

                          <Tooltip content="Chỉnh sửa" placement="top">
                            <button
                              onClick={() => onEdit(user)}
                              className="group/btn inline-flex items-center justify-center w-9 h-9 xl:w-10 xl:h-10 rounded-xl bg-white border-2 border-amber-500/30 hover:border-amber-500 hover:bg-gradient-to-br hover:from-amber-500 hover:to-amber-600 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              <PencilIcon className="w-4 h-4 xl:w-5 xl:h-5 text-amber-600 group-hover/btn:text-white transition-colors" />
                            </button>
                          </Tooltip>

                          <Tooltip content="Xóa người dùng" placement="top">
                            <button
                              onClick={() => onDelete(user.id)}
                              className="group/btn inline-flex items-center justify-center w-9 h-9 xl:w-10 xl:h-10 rounded-xl bg-white border-2 border-red-300 hover:border-red-500 hover:bg-gradient-to-br hover:from-red-500 hover:to-red-600 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              <TrashIcon className="w-4 h-4 xl:w-5 xl:h-5 text-red-500 group-hover/btn:text-white transition-colors" />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {users.length > 0 && (
          <div className="px-4 lg:px-6 2xl:px-8 py-4 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5] border-t border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-2">
            <Typography className="text-xs font-semibold text-[#6d4c41]">
              Tổng cộng: <span className="font-bold text-[#8B5E3C]">{users.length}</span> người dùng
            </Typography>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-green-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {users.filter((u) => u.isActive).length} Hoạt động
              </span>
              <span className="flex items-center gap-1.5 text-red-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                {users.filter((u) => !u.isActive).length} Vô hiệu
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default UserTable;