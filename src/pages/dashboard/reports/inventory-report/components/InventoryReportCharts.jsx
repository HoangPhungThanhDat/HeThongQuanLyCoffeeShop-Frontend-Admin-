
import { Card, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import {
  ChartBarIcon,
  ChartPieIcon,
  PresentationChartLineIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import {
  ResponsiveContainer,
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
import { PIE_COLORS } from "../constants";
import { formatPrice, formatCompact } from "../utils";

export const InventoryReportCharts = ({
  categoryDistribution,
  stockDistribution,
  categoryRadarData,
  topValueProducts,
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
          Phân tích tồn kho
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
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-lg">
                <ChartBarIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <Typography className="font-extrabold text-[#4e342e] text-sm">
                  Tồn kho theo danh mục
                </Typography>
                <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                  Top 10 danh mục
                </Typography>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5ede3" horizontal={false} />
                  <XAxis type="number" stroke="#a4714b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis
                    dataKey="shortName"
                    type="category"
                    stroke="#a4714b"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    width={100}
                  />
                  <ReTooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #C89F77",
                      borderRadius: "12px",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(139, 94, 60, 0.15)",
                    }}
                    formatter={(v, n) => [`${v} đơn vị`, "Tồn kho"]}
                  />
                  <Bar dataKey="stock" fill="#C89F77" radius={[0, 8, 8, 0]} />
                </BarChart>
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
                  Trạng thái kho
                </Typography>
                <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                  Phân bổ theo mức
                </Typography>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={
                      stockDistribution.length
                        ? stockDistribution
                        : [{ name: "Chưa có", value: 1 }]
                    }
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {stockDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color || PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <ReTooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #C89F77",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                    formatter={(v, n) => [`${v} sản phẩm`, n]}
                  />
                  <Legend wrapperStyle={{ fontSize: "10px", color: "#6d4c41" }} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="p-5 rounded-3xl border border-amber-100 shadow-xl bg-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                <PresentationChartLineIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <Typography className="font-extrabold text-[#4e342e] text-sm">
                  Tồn kho theo danh mục (Radar)
                </Typography>
                <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                  So sánh 6 danh mục
                </Typography>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={categoryRadarData}>
                  <PolarGrid stroke="#e8d9c7" />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fill: "#6d4c41" }} />
                  <PolarRadiusAxis tick={{ fontSize: 9, fill: "#a4714b" }} axisLine={false} />
                  <Radar
                    name="Tồn kho"
                    dataKey="stock"
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
                    formatter={(v) => [`${v} đơn vị`, "Tồn kho"]}
                  />
                </RadarChart>
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <BanknotesIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <Typography className="font-extrabold text-[#4e342e] text-sm">
                  Top giá trị tồn kho
                </Typography>
                <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                  10 SP giá trị cao nhất
                </Typography>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topValueProducts.slice(0, 8).map((p) => ({
                    name:
                      p.name?.length > 14
                        ? p.name.substring(0, 14) + "..."
                        : p.name,
                    value: p.stockValue,
                  }))}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5ede3" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="#a4714b"
                    fontSize={9}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={formatCompact}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#a4714b"
                    fontSize={9}
                    tickLine={false}
                    axisLine={false}
                    width={100}
                  />
                  <ReTooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #C89F77",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                    formatter={(v) => [formatPrice(v), "Giá trị tồn"]}
                  />
                  <Bar dataKey="value" fill="#22c55e" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>
    </>
  );
};