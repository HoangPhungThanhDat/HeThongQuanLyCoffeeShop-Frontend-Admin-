
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { billSchema, toBillPayload } from "../schemas/billSchema";
import { BILL_MESSAGES } from "../constants/messages";
import { getCurrentVNDateTime, toInputDateTime } from "../utils/formatters";
import { toast } from "@/lib/toast";
import { useBillMutations } from "./useBillMutations";

const DEFAULT_FORM = {
  orderId: "",
  totalAmount: "",
  paymentMethod: "CASH",
  paymentStatus: "PENDING",
  notes: "",
  issuedAt: "",
};

/**
 * Hook quản lý form bill (dùng chung create & edit)
 */
export function useBillForm({ id = null, initialData = null, onSuccess, onClose } = {}) {
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({ ...DEFAULT_FORM });
  const [errors, setErrors] = useState({});
  const [originalData, setOriginalData] = useState(null);

  const { create, update, isCreating, isUpdating } = useBillMutations();
  const isSubmitting = isCreating || isUpdating;

  const initializedRef = useRef(false);

  // ============ INIT: EDIT MODE ============
  useEffect(() => {
    if (isEditMode && initialData && !initializedRef.current) {
      const data = {
        orderId: initialData.orderId?.toString() || "",
        totalAmount: initialData.totalAmount?.toString() || "",
        paymentMethod: initialData.paymentMethod || "CASH",
        paymentStatus: initialData.paymentStatus || "PENDING",
        notes: initialData.notes || "",
        issuedAt: toInputDateTime(initialData.issuedAt),
      };
      setFormData(data);
      setOriginalData(data);
      initializedRef.current = true;
    }
  }, [isEditMode, initialData]);

  // ============ INIT: CREATE MODE - Auto set issuedAt ============
  useEffect(() => {
    if (!isEditMode && !formData.issuedAt) {
      setFormData((prev) => ({ ...prev, issuedAt: getCurrentVNDateTime() }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  // Reset khi đóng form create
  useEffect(() => {
    if (!isEditMode) initializedRef.current = false;
  }, [isEditMode]);

  // ============ CHANGE HANDLER ============
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
    setFormData({ ...DEFAULT_FORM, issuedAt: getCurrentVNDateTime() });
    setErrors({});
    setOriginalData(null);
    initializedRef.current = false;
  }, []);

  // ============ VALIDATE ============
  const validate = useCallback(() => {
    const result = billSchema.safeParse(formData);
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
      toast.warning(BILL_MESSAGES.VALIDATION_ERROR);
      return;
    }

    try {
      const payload = toBillPayload(formData);

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
  }, [isSubmitting, validate, formData, isEditMode, id, create, update, resetForm, onClose, onSuccess]);

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
        orderChanged: false,
        amountChanged: false,
        methodChanged: false,
        statusChanged: false,
        dateChanged: false,
        notesChanged: false,
      };
    }

    const orderChanged = formData.orderId !== originalData.orderId;
    const amountChanged = formData.totalAmount !== originalData.totalAmount;
    const methodChanged = formData.paymentMethod !== originalData.paymentMethod;
    const statusChanged = formData.paymentStatus !== originalData.paymentStatus;
    const dateChanged = formData.issuedAt !== originalData.issuedAt;
    const notesChanged = formData.notes !== originalData.notes;

    return {
      orderChanged,
      amountChanged,
      methodChanged,
      statusChanged,
      dateChanged,
      notesChanged,
      hasChanges:
        orderChanged ||
        amountChanged ||
        methodChanged ||
        statusChanged ||
        dateChanged ||
        notesChanged,
    };
  }, [isEditMode, originalData, formData]);

  // ============ COMPUTED ============
  const hasValidAmount =
    formData.totalAmount && parseFloat(formData.totalAmount) > 0;
  const canSubmit = isEditMode ? changes.hasChanges : true;

  return {
    // Data
    formData,
    errors,
    changes,
    isEditMode,

    // Computed
    hasValidAmount,
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

export default useBillForm;