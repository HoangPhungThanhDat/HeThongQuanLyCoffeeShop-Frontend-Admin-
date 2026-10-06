
import { Card, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { ChartBarIcon, FireIcon } from "@heroicons/react/24/outline";
import {
  ResponsiveContainer,
  PieChart, Pie, Cell,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, Legend,
} from "recharts";
import { PIE_COLORS } from "../constants";

export const LogCharts = ({ dailyActivity, levelDistribution }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      {/* Daily Area Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="xl:col-span-2"
      >
        <Card className="p-5 rounded-3xl border border-amber-100 shadow-xl bg-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-lg">
              <ChartBarIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <Typography className="font-extrabold text-[#4e342e] text-sm">
                Hoạt động 7 ngày gần nhất
              </Typography>
              <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                Tổng logs và lỗi
              </Typography>
            </div>
          </div>
          <div className="h-64 w-full" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyActivity}>
                <defs>
                  <linearGradient id="colorLogs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5E3C" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5E3C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5ede3" vertical={false} />
                <XAxis dataKey="day" stroke="#a4714b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#a4714b" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
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
                <Area type="monotone" dataKey="total" name="Tổng" stroke="#8B5E3C" strokeWidth={2.5} fill="url(#colorLogs)" />
                <Area type="monotone" dataKey="errors" name="Lỗi" stroke="#ef4444" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <Card className="p-5 rounded-3xl border border-amber-100 shadow-xl bg-white h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg">
              <FireIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <Typography className="font-extrabold text-[#4e342e] text-sm">Mức độ</Typography>
              <Typography className="text-[10px] text-[#8B5E3C] font-medium">Phân bổ logs</Typography>
            </div>
          </div>
          <div className="h-64 w-full" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={
                    levelDistribution.length
                      ? levelDistribution
                      : [{ name: "Chưa có", value: 1, color: "#e5e7eb" }]
                  }
                  cx="50%" cy="50%" innerRadius={50} outerRadius={85}
                  paddingAngle={3} dataKey="value"
                >
                  {(levelDistribution.length
                    ? levelDistribution
                    : [{ color: "#e5e7eb" }]
                  ).map((entry, i) => (
                    <Cell key={i} fill={entry.color || PIE_COLORS[i % 4]} />
                  ))}
                </Pie>
                <ReTooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #C89F77",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                  formatter={(v, n) => [`${v} logs`, n]}
                />
                <Legend wrapperStyle={{ fontSize: "10px", color: "#6d4c41" }} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};