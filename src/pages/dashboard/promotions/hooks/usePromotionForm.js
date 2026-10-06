
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  promotionSchema,
  toPromotionPayload,
} from "../schemas/promotionSchema";
import { PROMOTION_MESSAGES } from "../constants/messages";
import { toast } from "@/lib/toast";
import { usePromotionMutations } from "./usePromotionMutations";

const DEFAULT_FORM = {
  name: "",
  discountPercentage: "",
  discountAmount: "",
  startDate: "",
  endDate: "",
  isActive: true,
};

/**
 * Hook quản lý form promotion (dùng chung create & edit)
 */
export function usePromotionForm({ id = null, initialData = null, onSuccess, onClose } = {}) {
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({ ...DEFAULT_FORM });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [errors, setErrors] = useState({});

  const { create, update, isCreating, isUpdating } = usePromotionMutations();
  const isSubmitting = isCreating || isUpdating;

  const initializedRef = useRef(false);

  // ============ INIT: EDIT MODE ============
  useEffect(() => {
    if (isEditMode && initialData && !initializedRef.current) {
      setFormData({
        name: initialData.name || "",
        discountPercentage: initialData.discountPercentage || "",
        discountAmount: initialData.discountAmount || "",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
        isActive: initialData.isActive ?? true,
      });
      const productIds = initialData.products?.map((p) => p.id) || [];
      setSelectedProducts(productIds);
      setOriginalProducts(productIds);
      initializedRef.current = true;
    }
  }, [isEditMode, initialData]);

  useEffect(() => {
    if (!isEditMode) initializedRef.current = false;
  }, [isEditMode]);

  // ============ CHANGE HANDLERS ============
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleToggleActive = useCallback(() => {
    setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
  }, []);

  const handleProductToggle = useCallback((productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const handleSelectAllProducts = useCallback((productIds) => {
    setSelectedProducts(productIds);
  }, []);

  const handleClearProducts = useCallback(() => {
    setSelectedProducts([]);
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ ...DEFAULT_FORM });
    setSelectedProducts([]);
    setOriginalProducts([]);
    setErrors({});
    initializedRef.current = false;
  }, []);

  // ============ VALIDATE ============
  const validate = useCallback(() => {
    const result = promotionSchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  }, [formData]);

  // ============ SUBMIT ============
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    if (!validate()) {
      toast.warning(PROMOTION_MESSAGES.VALIDATION_ERROR);
      return;
    }

    try {
      const payload = toPromotionPayload(formData, selectedProducts);

      if (isEditMode) {
        await update({ id, data: payload });
      } else {
        await create(payload);
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
    selectedProducts,
    isEditMode,
    id,
    update,
    create,
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
    if (!isEditMode || !initialData) {
      return {
        hasChanges: false,
        nameChanged: false,
        discountChanged: false,
        datesChanged: false,
        statusChanged: false,
        productsChanged: false,
      };
    }

    const nameChanged = formData.name !== (initialData.name || "");
    const percentChanged =
      String(formData.discountPercentage || "") !==
      String(initialData.discountPercentage || "");
    const amountChanged =
      String(formData.discountAmount || "") !==
      String(initialData.discountAmount || "");
    const startChanged = formData.startDate !== (initialData.startDate || "");
    const endChanged = formData.endDate !== (initialData.endDate || "");
    const statusChanged = formData.isActive !== (initialData.isActive ?? true);
    const productsChanged =
      JSON.stringify([...selectedProducts].sort()) !==
      JSON.stringify([...originalProducts].sort());

    const discountChanged = percentChanged || amountChanged;
    const datesChanged = startChanged || endChanged;

    return {
      nameChanged,
      percentChanged,
      amountChanged,
      discountChanged,
      startChanged,
      endChanged,
      datesChanged,
      statusChanged,
      productsChanged,
      hasChanges:
        nameChanged ||
        discountChanged ||
        datesChanged ||
        statusChanged ||
        productsChanged,
    };
  }, [isEditMode, initialData, formData, selectedProducts, originalProducts]);

  // ============ COMPUTED ============
  const hasDiscount = Boolean(
    formData.discountPercentage || formData.discountAmount
  );
  const discountDisplay = useMemo(() => {
    if (formData.discountPercentage) return `-${formData.discountPercentage}%`;
    if (formData.discountAmount)
      return `-${new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(formData.discountAmount)}`;
    return "-0%";
  }, [formData.discountPercentage, formData.discountAmount]);

  const canSubmit = isEditMode ? changes.hasChanges : true;

  return {
    // Data
    formData,
    errors,
    changes,
    isEditMode,
    selectedProducts,

    // Computed
    hasDiscount,
    discountDisplay,
    canSubmit,

    // State
    isSubmitting,

    // Actions
    handleInputChange,
    handleToggleActive,
    handleProductToggle,
    handleSelectAllProducts,
    handleClearProducts,
    handleSubmit,
    handleClose,
    resetForm,
  };
}

export default usePromotionForm;