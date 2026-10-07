
import { useState, useEffect, useMemo } from "react";
import ProductAPI from "@/api/productApi";
import CategoryAPI from "@/api/categoryApi";
import Swal from "sweetalert2";
import { getStockConfig, PAGE_SIZE } from "../constants";
import { toArray } from "../utils";

export const useInventoryReport = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("stock");

  // ✅ PHÂN TRANG
  const [page, setPage] = useState(0);
  const pageSize = PAGE_SIZE;

  // ==================== FETCH ====================
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          ProductAPI.getAll({ size: 10000 }),
          CategoryAPI.getAll({ size: 10000 }),
        ]);

        if (!isMounted) return;

        setProducts(toArray(productsRes));
        setCategories(toArray(categoriesRes));
      } catch (error) {
        if (!isMounted) return;
        console.error("Lỗi tải dữ liệu:", error);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Không thể tải dữ liệu!",
          showConfirmButton: false,
          timer: 2500,
        });
      } finally {
        if (isMounted) {
          setTimeout(() => setLoading(false), 1200);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // ==================== FILTER ====================
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (categoryFilter !== "ALL") {
      result = result.filter(
        (p) => p.category?.id?.toString() === categoryFilter
      );
    }

    if (stockFilter !== "ALL") {
      result = result.filter((p) => {
        const qty = p.stockQuantity || 0;
        if (stockFilter === "OUT") return qty === 0;
        if (stockFilter === "LOW") return qty > 0 && qty < 10;
        if (stockFilter === "MEDIUM") return qty >= 10 && qty < 30;
        if (stockFilter === "HIGH") return qty >= 30;
        return true;
      });
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.id?.toString().includes(term)
      );
    }

    if (sortBy === "stock") {
      result.sort((a, b) => (a.stockQuantity || 0) - (b.stockQuantity || 0));
    } else if (sortBy === "name") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "value") {
      result.sort(
        (a, b) =>
          (b.price || 0) * (b.stockQuantity || 0) -
          (a.price || 0) * (a.stockQuantity || 0)
      );
    }

    return result;
  }, [products, categoryFilter, stockFilter, searchTerm, sortBy]);

  // ✅ RESET PAGE khi filter thay đổi
  useEffect(() => {
    setPage(0);
  }, [categoryFilter, stockFilter, searchTerm, sortBy]);

  // ✅ TÍNH PHÂN TRANG
  const totalElements = filteredProducts.length;
  const totalPages = Math.ceil(totalElements / pageSize);

  const paginatedProducts = useMemo(() => {
    const start = page * pageSize;
    const end = start + pageSize;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, page, pageSize]);

  // ==================== STATS ====================
  const stats = useMemo(() => {
    const total = products.length;
    const totalStock = products.reduce(
      (s, p) => s + (p.stockQuantity || 0),
      0
    );
    const totalValue = products.reduce(
      (s, p) => s + (p.price || 0) * (p.stockQuantity || 0),
      0
    );
    const outOfStock = products.filter((p) => (p.stockQuantity || 0) === 0).length;
    const lowStock = products.filter(
      (p) => (p.stockQuantity || 0) > 0 && (p.stockQuantity || 0) < 10
    ).length;
    const mediumStock = products.filter(
      (p) => (p.stockQuantity || 0) >= 10 && (p.stockQuantity || 0) < 30
    ).length;
    const highStock = products.filter((p) => (p.stockQuantity || 0) >= 30).length;
    const activeProducts = products.filter((p) => p.isActive).length;
    const inactiveProducts = products.filter((p) => !p.isActive).length;
    const avgStock = total > 0 ? totalStock / total : 0;

    return {
      total,
      totalStock,
      totalValue,
      outOfStock,
      lowStock,
      mediumStock,
      highStock,
      activeProducts,
      inactiveProducts,
      avgStock,
    };
  }, [products]);

  // ==================== CHART DATA ====================
  const stockDistribution = useMemo(() => {
    return [
      { name: "Đầy đủ", value: stats.highStock, color: "#22c55e" },
      { name: "Trung bình", value: stats.mediumStock, color: "#3b82f6" },
      { name: "Sắp hết", value: stats.lowStock, color: "#f59e0b" },
      { name: "Hết hàng", value: stats.outOfStock, color: "#dc2626" },
    ].filter((d) => d.value > 0);
  }, [stats]);

  const categoryDistribution = useMemo(() => {
    return categories
      .map((cat) => {
        const catProducts = products.filter((p) => p.category?.id === cat.id);
        return {
          name: cat.name,
          shortName:
            cat.name?.length > 12
              ? cat.name.substring(0, 12) + "..."
              : cat.name,
          products: catProducts.length,
          stock: catProducts.reduce((s, p) => s + (p.stockQuantity || 0), 0),
          value: catProducts.reduce(
            (s, p) => s + (p.price || 0) * (p.stockQuantity || 0),
            0
          ),
        };
      })
      .filter((c) => c.products > 0)
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 10);
  }, [categories, products]);

  const topValueProducts = useMemo(() => {
    return products
      .map((p) => ({
        ...p,
        stockValue: (p.price || 0) * (p.stockQuantity || 0),
      }))
      .sort((a, b) => b.stockValue - a.stockValue)
      .slice(0, 10);
  }, [products]);

  const categoryRadarData = useMemo(() => {
    return categoryDistribution.slice(0, 6).map((c) => ({
      category: c.shortName,
      stock: c.stock,
    }));
  }, [categoryDistribution]);

  return {
    loading,
    products,
    categories,
    filteredProducts,
    paginatedProducts,
    categoryFilter, setCategoryFilter,
    stockFilter, setStockFilter,
    searchTerm, setSearchTerm,
    sortBy, setSortBy,
    page, setPage,
    pageSize,
    totalPages,
    totalElements,
    stats,
    stockDistribution,
    categoryDistribution,
    topValueProducts,
    categoryRadarData,
  };
};