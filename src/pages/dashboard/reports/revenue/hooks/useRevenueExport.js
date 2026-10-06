
import dayjs from "dayjs";
import Swal from "sweetalert2";

export const useRevenueExport = (dailyRevenue, topProducts, fromDate, toDate) => {
  const handleExport = () => {
    if (!dailyRevenue.length) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "Không có dữ liệu để xuất",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    const csvData = [
      [`Báo cáo doanh thu từ ${fromDate} đến ${toDate}`],
      [],
      ["Ngày", "Doanh thu", "Số đơn"],
      ...dailyRevenue.map((d) => [d.fullDate, d.revenue, d.orders]),
      [],
      ["Top sản phẩm", "", "", ""],
      ["Sản phẩm", "Số lượng", "Doanh thu"],
      ...topProducts.map((p) => [p.name, p.quantity, p.revenue]),
    ];

    const csv = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `bao-cao-doanh-thu-${fromDate}_${toDate}.csv`;
    link.click();

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Đã xuất báo cáo!",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  return { handleExport };
};