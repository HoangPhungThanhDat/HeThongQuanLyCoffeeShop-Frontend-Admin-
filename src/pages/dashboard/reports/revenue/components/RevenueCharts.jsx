
import { Card, Typography, Chip } from "@material-tailwind/react";
import { motion } from "framer-motion";
import {
  ChartPieIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/outline";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  AreaChart,
  Area,
} from "recharts";
import { COLORS } from "../constants";
import { formatPrice, formatCompact } from "../utils";

export const RevenueCharts = ({ dailyRevenue, paymentMethodData }) => {
  return (
    <>
      {/* Section title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center gap-3"
      >
        <div className="w-1 h-6 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
        <Typography className="font-extrabold text-[#4e342e] text-lg tracking-tight">
          Biểu đồ phân tích
        </Typography>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Daily Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="xl:col-span-2"
        >
          <Card className="p-5 rounded-3xl border border-amber-100 shadow-xl bg-white overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-lg">
                  <PresentationChartLineIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Typography className="font-extrabold text-[#4e342e] text-sm">
                    Doanh thu theo ngày
                  </Typography>
                  <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                    {dailyRevenue.length} ngày có doanh thu
                  </Typography>
                </div>
              </div>
              <Chip
                value="Realtime"
                className="bg-green-50 text-green-700 border border-green-200 text-[9px] font-extrabold uppercase w-fit"
                size="sm"
              />
            </div>
            <div className="h-72" style={{ minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyRevenue}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5E3C" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8B5E3C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f5ede3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#a4714b"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#a4714b"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={formatCompact}
                  />
                  <ReTooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #C89F77",
                      borderRadius: "12px",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(139, 94, 60, 0.15)",
                    }}
                    formatter={(v) => [formatPrice(v), "Doanh thu"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8B5E3C"
                    strokeWidth={2.5}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Payment Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="p-5 rounded-3xl border border-amber-100 shadow-xl bg-white overflow-hidden h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <ChartPieIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <Typography className="font-extrabold text-[#4e342e] text-sm">
                  Phương thức TT
                </Typography>
                <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                  Phân bổ doanh thu
                </Typography>
              </div>
            </div>
            <div className="h-72" style={{ minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={
                      paymentMethodData.length
                        ? paymentMethodData
                        : [{ name: "Chưa có", value: 1 }]
                    }
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {paymentMethodData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <ReTooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #C89F77",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                    formatter={(v) => formatPrice(v)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>
    </>
  );
};