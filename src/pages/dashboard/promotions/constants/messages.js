
export const PROMOTION_MESSAGES = {
    // Fetch
    FETCH_ERROR: "❌ Không thể tải danh sách khuyến mãi!",
    FETCH_PRODUCTS_ERROR: "❌ Không thể tải danh sách sản phẩm!",
    FETCH_DETAIL_ERROR: "❌ Không thể tải chi tiết khuyến mãi!",
  
    // Create
    CREATE_SUCCESS: "🎉 Thêm khuyến mãi thành công!",
    CREATE_ERROR: "❌ Không thể thêm khuyến mãi!",
  
    // Update
    UPDATE_SUCCESS: "✅ Cập nhật khuyến mãi thành công!",
    UPDATE_ERROR: "❌ Không thể cập nhật khuyến mãi!",
  
    // Delete
    DELETE_SUCCESS: "🗑️ Xóa khuyến mãi thành công!",
    DELETE_ERROR: "❌ Không thể xóa khuyến mãi!",
  
    // Validation
    NAME_REQUIRED: "⚠️ Vui lòng nhập tên khuyến mãi!",
    DISCOUNT_REQUIRED: "⚠️ Vui lòng nhập phần trăm hoặc số tiền giảm giá!",
    DATES_REQUIRED: "⚠️ Vui lòng nhập ngày bắt đầu và kết thúc!",
    END_BEFORE_START: "⚠️ Ngày kết thúc phải sau ngày bắt đầu!",
    PERCENT_INVALID: "⚠️ Phần trăm giảm phải từ 0 đến 100!",
    AMOUNT_INVALID: "⚠️ Số tiền giảm phải lớn hơn 0!",
    VALIDATION_ERROR: "⚠️ Vui lòng kiểm tra lại thông tin!",
  };
  
  export const PROMOTION_DELETE_CONFIRM = {
    title: "Bạn có chắc chắn muốn xóa?",
    text: "Hành động này không thể hoàn tác!",
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  };