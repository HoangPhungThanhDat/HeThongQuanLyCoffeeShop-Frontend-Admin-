

export function ProductCategoryFilter({
    categories = [],
    value,
    onChange,
  }) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2.5 2xl:py-3 rounded-xl bg-white/95 border border-white/50 text-sm 2xl:text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-sm cursor-pointer"
      >
        <option value="ALL">📁 Tất cả danh mục</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id.toString()}>
            {cat.name}
          </option>
        ))}
      </select>
    );
  }
  
  export default ProductCategoryFilter;