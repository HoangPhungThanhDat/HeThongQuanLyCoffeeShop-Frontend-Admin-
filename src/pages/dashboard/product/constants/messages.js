
export const PRODUCT_MESSAGES = {
    // Fetch
    FETCH_ERROR: "❌ Không thể tải danh sách sản phẩm!",
    FETCH_CATEGORIES_ERROR: "❌ Không thể tải danh sách danh mục!",
    FETCH_DETAIL_ERROR: "❌ Không thể tải chi tiết sản phẩm!",
  
    // Create
    CREATE_SUCCESS: "🎉 Thêm sản phẩm mới thành công!",
    CREATE_ERROR: "❌ Không thể thêm sản phẩm!",
  
    // Update
    UPDATE_SUCCESS: "✅ Cập nhật sản phẩm thành công!",
    UPDATE_ERROR: "❌ Không thể cập nhật sản phẩm!",
  
    // Delete
    DELETE_SUCCESS: "🗑️ Xóa sản phẩm thành công!",
    DELETE_ERROR: "❌ Không thể xóa sản phẩm!",
  
    // Upload
    IMAGE_INVALID_TYPE: "⚠️ Vui lòng chọn file ảnh!",
    IMAGE_TOO_LARGE: "⚠️ Ảnh không được vượt quá 5MB!",
    IMAGE_REQUIRED: "⚠️ Vui lòng chọn ảnh sản phẩm!",
  
    // Validation
    NAME_REQUIRED: "⚠️ Vui lòng nhập tên sản phẩm!",
    PRICE_REQUIRED: "⚠️ Vui lòng nhập giá hợp lệ!",
    STOCK_REQUIRED: "⚠️ Vui lòng nhập số lượng hợp lệ!",
    CATEGORY_REQUIRED: "⚠️ Vui lòng chọn danh mục!",
    VALIDATION_ERROR: "⚠️ Vui lòng kiểm tra lại thông tin!",
  };
  
  export const PRODUCT_DELETE_CONFIRM = {
    title: "Bạn có chắc chắn muốn xóa?",
    text: "Hành động này không thể hoàn tác!",
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  };