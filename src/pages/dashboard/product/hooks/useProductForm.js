
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  productSchema,
  toProductFormData,
} from "../schemas/productSchema";
import { PRODUCT_MESSAGES } from "../constants/messages";
import { toast } from "@/lib/toast";
import { useProductMutations } from "./useProductMutations";

const DEFAULT_FORM = {
  name: "",
  description: "",
  price: "",
  stockQuantity: "",
  isActive: true,
  categoryId: "",
};

/**
 * Hook quản lý form product (dùng chung create & edit)
 */
export function useProductForm({ id = null, initialData = null, onSuccess, onClose } = {}) {
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({ ...DEFAULT_FORM });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [errors, setErrors] = useState({});

  const { create, update, isCreating, isUpdating } = useProductMutations();
  const isSubmitting = isCreating || isUpdating;

  const initializedRef = useRef(false);

  // ============ INIT: EDIT MODE ============
  useEffect(() => {
    if (isEditMode && initialData && !initializedRef.current) {
      const data = {
        name: initialData.name || "",
        description: initialData.description || "",
        price: String(initialData.price || ""),
        stockQuantity: String(initialData.stockQuantity || ""),
        isActive: initialData.isActive ?? true,
        categoryId: String(initialData.category?.id || ""),
      };
      setFormData(data);
      setOriginalData(data);
      setImagePreview(initialData.imageUrl || null);
      initializedRef.current = true;
    }
  }, [isEditMode, initialData]);

  useEffect(() => {
    if (!isEditMode) initializedRef.current = false;
  }, [isEditMode]);

  // ============ CHANGE HANDLERS ============
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleSelectChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleSwitchChange = useCallback((name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.warning(PRODUCT_MESSAGES.IMAGE_INVALID_TYPE);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.warning(PRODUCT_MESSAGES.IMAGE_TOO_LARGE);
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const removeImage = useCallback(() => {
    setImagePreview(null);
    setImageFile(null);
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ ...DEFAULT_FORM });
    setImageFile(null);
    setImagePreview(null);
    setOriginalData(null);
    setErrors({});
    initializedRef.current = false;
  }, []);

  // ============ VALIDATE ============
  const validate = useCallback(() => {
    const result = productSchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return false;
    }

    // Create mode bắt buộc có ảnh
    if (!isEditMode && !imageFile) {
      toast.warning(PRODUCT_MESSAGES.IMAGE_REQUIRED);
      return false;
    }

    setErrors({});
    return true;
  }, [formData, isEditMode, imageFile]);

  // ============ SUBMIT ============
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    if (!validate()) {
      return;
    }

    try {
      const submitData = toProductFormData(formData, imageFile, isEditMode);

      if (isEditMode) {
        await update({ id, data: submitData });
      } else {
        await create(submitData);
      }

      resetForm();
      onClose?.();
      onSuccess?.();
    } catch {
      // Mutation đã show toast
    }
  }, [
    isSubmitting,
    validate,
    formData,
    imageFile,
    isEditMode,
    id,
    create,
    update,
    resetForm,
    onClose,
    onSuccess,
  ]);

  // ============ CLOSE ============
  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    if (!isEditMode) resetForm();
    onClose?.();
  }, [isSubmitting, isEditMode, resetForm, onClose]);

  // ============ CHANGE DETECTION ============
  const changes = useMemo(() => {
    if (!isEditMode || !originalData) {
      return {
        hasChanges: false,
        nameChanged: false,
        priceChanged: false,
        stockChanged: false,
        categoryChanged: false,
        statusChanged: false,
        imageChanged: false,
      };
    }

    const nameChanged = formData.name !== originalData.name;
    const priceChanged =
      String(formData.price) !== String(originalData.price);
    const stockChanged =
      String(formData.stockQuantity) !== String(originalData.stockQuantity);
    const categoryChanged = formData.categoryId !== originalData.categoryId;
    const statusChanged = formData.isActive !== originalData.isActive;
    const imageChanged = Boolean(imageFile);

    return {
      nameChanged,
      priceChanged,
      stockChanged,
      categoryChanged,
      statusChanged,
      imageChanged,
      hasChanges:
        nameChanged ||
        priceChanged ||
        stockChanged ||
        categoryChanged ||
        statusChanged ||
        imageChanged,
    };
  }, [isEditMode, originalData, formData, imageFile]);

  // ============ COMPUTED ============
  const formattedPrice = useMemo(() => {
    if (!formData.price) return null;
    const num = parseFloat(formData.price);
    if (isNaN(num) || num <= 0) return null;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num);
  }, [formData.price]);

  const stockQty = parseInt(formData.stockQuantity) || 0;
  const canSubmit = isEditMode ? changes.hasChanges : true;

  return {
    // Data
    formData,
    errors,
    changes,
    isEditMode,
    imageFile,
    imagePreview,

    // Computed
    formattedPrice,
    stockQty,
    canSubmit,

    // State
    isSubmitting,

    // Actions
    handleInputChange,
    handleSelectChange,
    handleSwitchChange,
    handleImageChange,
    removeImage,
    handleSubmit,
    handleClose,
    resetForm,
  };
}

export default useProductForm;