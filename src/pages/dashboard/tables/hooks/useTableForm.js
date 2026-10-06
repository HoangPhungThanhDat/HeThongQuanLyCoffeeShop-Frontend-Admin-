
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { tableSchema, toTablePayload } from "../schemas/tableSchema";
import { TABLE_MESSAGES } from "../constants/messages";
import { toast } from "@/lib/toast";
import { useTableMutations } from "./useTableMutations";

const DEFAULT_FORM = {
  number: "",
  capacity: "",
  status: "FREE",
};

/**
 * Hook quản lý form table (dùng chung create & edit)
 */
export function useTableForm({ id = null, initialData = null, onSuccess, onClose } = {}) {
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({ ...DEFAULT_FORM });
  const [originalData, setOriginalData] = useState(null);
  const [errors, setErrors] = useState({});

  const { create, update, isCreating, isUpdating } = useTableMutations();
  const isSubmitting = isCreating || isUpdating;

  const initializedRef = useRef(false);

  // ============ INIT: EDIT MODE ============
  useEffect(() => {
    if (isEditMode && initialData && !initializedRef.current) {
      const data = {
        number: String(initialData.number || ""),
        capacity: String(initialData.capacity || ""),
        status: initialData.status || "FREE",
      };
      setFormData(data);
      setOriginalData(data);
      initializedRef.current = true;
    }
  }, [isEditMode, initialData]);

  // Reset khi đóng form create
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

  const resetForm = useCallback(() => {
    setFormData({ ...DEFAULT_FORM });
    setOriginalData(null);
    setErrors({});
    initializedRef.current = false;
  }, []);

  // ============ VALIDATE ============
  const validate = useCallback(() => {
    const result = tableSchema.safeParse(formData);
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
      toast.warning(TABLE_MESSAGES.VALIDATION_ERROR);
      return;
    }

    try {
      const payload = toTablePayload(formData);

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
      return { hasChanges: false, numberChanged: false, capacityChanged: false, statusChanged: false };
    }

    const numberChanged = formData.number !== originalData.number;
    const capacityChanged = formData.capacity !== originalData.capacity;
    const statusChanged = formData.status !== originalData.status;

    return {
      numberChanged,
      capacityChanged,
      statusChanged,
      hasChanges: numberChanged || capacityChanged || statusChanged,
    };
  }, [isEditMode, originalData, formData]);

  // ============ COMPUTED ============
  const hasValidCapacity =
    formData.capacity && parseInt(formData.capacity) > 0;
  const canSubmit = isEditMode ? changes.hasChanges : true;

  return {
    // Data
    formData,
    errors,
    changes,
    isEditMode,

    // Computed
    hasValidCapacity,
    canSubmit,

    // State
    isSubmitting,

    // Actions
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    handleClose,
    resetForm,
  };
}

export default useTableForm;