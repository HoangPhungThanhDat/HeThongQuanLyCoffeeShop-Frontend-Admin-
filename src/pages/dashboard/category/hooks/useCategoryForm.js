// src/pages/dashboard/category/hooks/useCategoryForm.js
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { categorySchema } from "../schemas/categorySchema";
import { CATEGORY_MESSAGES } from "../constants/messages";
import { toast } from "@/lib/toast";
import { useCategoryMutations } from "./useCategoryMutations";

/**
 * Hook quản lý form category (dùng chung create & edit)
 */
export function useCategoryForm({ id = null, initialData = null, onSuccess, onClose } = {}) {
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
  });
  const [errors, setErrors] = useState({});

  const { create, update, isCreating, isUpdating } = useCategoryMutations();
  const isSubmitting = isCreating || isUpdating;

  // Track đã init chưa (tránh reset form khi user đang gõ)
  const initializedRef = useRef(false);

  // ============ SYNC INITIAL DATA (chỉ 1 lần) ============
  useEffect(() => {
    if (isEditMode && initialData && !initializedRef.current) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
      });
      initializedRef.current = true;
    }
  }, [isEditMode, initialData]);

  // Reset khi đóng form
  useEffect(() => {
    if (!isEditMode) initializedRef.current = false;
  }, [isEditMode]);

  // ============ CHANGE HANDLER ============
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ name: "", description: "" });
    setErrors({});
    initializedRef.current = false;
  }, []);

  // ============ VALIDATE (dùng Zod) ============
  const validate = useCallback(() => {
    const result = categorySchema.safeParse(formData);
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
      toast.warning(CATEGORY_MESSAGES.VALIDATION_ERROR);
      return;
    }

    try {
      if (isEditMode) {
        await update({ id, data: formData });
      } else {
        await create(formData);
      }
      resetForm();
      onClose?.();
      onSuccess?.();
    } catch {
      // Mutation đã show toast lỗi
    }
  }, [isSubmitting, validate, isEditMode, id, formData, update, create, resetForm, onClose, onSuccess]);

  // ============ CLOSE ============
  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    if (!isEditMode) resetForm();
    onClose?.();
  }, [isSubmitting, isEditMode, resetForm, onClose]);

  // ============ CHANGE DETECTION ============
  const changes = useMemo(() => {
    if (!isEditMode || !initialData) {
      return { hasChanges: false, hasNameChanged: false, hasDescriptionChanged: false };
    }
    const hasNameChanged = formData.name !== (initialData.name || "");
    const hasDescriptionChanged = formData.description !== (initialData.description || "");
    return {
      hasNameChanged,
      hasDescriptionChanged,
      hasChanges: hasNameChanged || hasDescriptionChanged,
    };
  }, [isEditMode, initialData, formData]);

  // ============ COMPUTED ============
  const hasDescription = formData.description?.trim() !== "";
  const canSubmit = isEditMode ? changes.hasChanges : true;

  return {
    formData,
    errors,
    changes,
    isEditMode,
    hasDescription,
    canSubmit,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    handleClose,
    resetForm,
  };
}

export default useCategoryForm;