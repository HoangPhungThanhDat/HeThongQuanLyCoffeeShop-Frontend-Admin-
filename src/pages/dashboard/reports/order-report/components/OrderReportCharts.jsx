
import { Card, Typography, Chip } from "@material-tailwind/react";
import { motion } from "framer-motion";
import {
  PresentationChartLineIcon,
  ChartPieIcon,
  ChartBarIcon,
  ClockIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
} from "recharts";
import dayjs from "dayjs";
import { STATUS_CONFIG, PIE_COLORS } from "../constants";

export const OrderReportCharts = ({
  dailyOrders,
  monthlyOrders,
  statusPieData,
  hourlyOrders,
  weekdayData,
}) => {
  return (
    <>
      {/* Section title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="flex items-center gap-3"
      >
        <div className="w-1 h-6 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
        <Typography className="font-extrabold text-[#4e342e] text-lg tracking-tight">
          Phân tích đơn hàng
        </Typography>
      </motion.div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="xl:col-span-2"
        >
          <Card className="p-5 rounded-3xl border border-amber-100 shadow-xl bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-lg">
                  <PresentationChartLineIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Typography className="font-extrabold text-[#4e342e] text-sm">
                    Đơn hàng 30 ngày gần nhất
                  </Typography>
                  <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                    Tổng / Hoàn thành / Đã hủy
                  </Typography>
                </div>
              </div>
              <Chip
                value="Realtime"
                className="bg-green-50 text-green-700 border border-green-200 text-[9px] font-extrabold uppercase w-fit"
                size="sm"
              />
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyOrders}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5ede3" vertical={false} />
                  <XAxis dataKey="date" stroke="#a4714b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#a4714b" fontSize={10} tickLine={false} axisLine={false} />
                  <ReTooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #C89F77",
                      borderRadius: "12px",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(139, 94, 60, 0.15)",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", color: "#6d4c41" }} iconType="circle" />
                  <Line type="monotone" dataKey="total" name="Tổng" stroke="#8B5E3C" strokeWidth={2.5} dot={{ r: 3, fill: "#8B5E3C" }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="completed" name="Hoàn thành" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 3, fill: "#22c55e" }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="cancelled" name="Đã hủy" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3, fill: "#ef4444" }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Card className="p-5 rounded-3xl border border-amber-100 shadow-xl bg-white h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg">
                <ChartPieIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <Typography className="font-extrabold text-[#4e342e] text-sm">
                  Trạng thái đơn
                </Typography>
                <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                  Phân bổ
                </Typography>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData.length ? statusPieData : [{ name: "Chưa có", value: 1 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={STATUS_CONFIG[entry.status]?.color || PIE_COLORS[i % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ReTooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #C89F77",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                    formatter={(v, n) => [`${v} đơn`, n]}
                  />
                  <Legend wrapperStyle={{ fontSize: "10px", color: "#6d4c41" }} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="p-5 rounded-3xl border border-amber-100 shadow-xl bg-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                <ChartBarIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <Typography className="font-extrabold text-[#4e342e] text-sm">
                  Đơn hàng theo tháng
                </Typography>
                <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                  Năm {dayjs().year()}
                </Typography>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyOrders}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5ede3" vertical={false} />
                  <XAxis dataKey="month" stroke="#a4714b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#a4714b" fontSize={10} tickLine={false} axisLine={false} />
                  <ReTooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #C89F77",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                    cursor={{ fill: "#faf6f1" }}
                  />
                  <Bar dataKey="total" name="Tổng" fill="#8B5E3C" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="completed" name="Hoàn thành" fill="#22c55e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <Card className="p-5 rounded-3xl border border-amber-100 shadow-xl bg-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <ClockIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <Typography className="font-extrabold text-[#4e342e] text-sm">
                  Đơn hàng theo giờ
                </Typography>
                <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                  Giờ cao điểm
                </Typography>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyOrders}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5ede3" vertical={false} />
                  <XAxis dataKey="hour" stroke="#a4714b" fontSize={9} tickLine={false} axisLine={false} interval={2} />
                  <YAxis stroke="#a4714b" fontSize={10} tickLine={false} axisLine={false} />
                  <ReTooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #C89F77",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                    formatter={(v) => [`${v} đơn`, "Số đơn"]}
                    cursor={{ fill: "#faf6f1" }}
                  />
                  <Bar dataKey="orders" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="p-5 rounded-3xl border border-amber-100 shadow-xl bg-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                <FireIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <Typography className="font-extrabold text-[#4e342e] text-sm">
                  Đơn hàng theo thứ
                </Typography>
                <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                  Xu hướng trong tuần
                </Typography>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={weekdayData}>
                  <PolarGrid stroke="#e8d9c7" />
                  <PolarAngleAxis dataKey="weekday" tick={{ fontSize: 10, fill: "#6d4c41" }} />
                  <PolarRadiusAxis tick={{ fontSize: 9, fill: "#a4714b" }} axisLine={false} />
                  <Radar
                    name="Đơn hàng"
                    dataKey="orders"
                    stroke="#0891b2"
                    fill="#0891b2"
                    fillOpacity={0.4}
                    strokeWidth={2.5}
                  />
                  <ReTooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #C89F77",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                    formatter={(v) => [`${v} đơn`, "Số đơn"]}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>
    </>
  );
};