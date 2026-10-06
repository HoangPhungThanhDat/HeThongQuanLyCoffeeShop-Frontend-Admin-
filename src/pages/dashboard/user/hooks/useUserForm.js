
import { useState, useEffect, useCallback, useRef } from "react";
import {
  createUserSchema,
  updateUserSchema,
  toUserFormData,
} from "../schemas/userSchema";
import { USER_MESSAGES } from "../constants/messages";
import { toast } from "@/lib/toast";
import { useUserMutations } from "./useUserMutations";

const DEFAULT_FORM = {
  username: "",
  password: "",
  fullName: "",
  role: "",
  email: "",
  phone: "",
  isActive: true,
};

/**
 * Hook quản lý form user (dùng chung create & edit)
 */
export function useUserForm({ id = null, initialData = null, onSuccess, onClose } = {}) {
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({ ...DEFAULT_FORM });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { create, update, isCreating, isUpdating } = useUserMutations();
  const isSubmitting = isCreating || isUpdating;

  const initializedRef = useRef(false);

  // ============ INIT: EDIT MODE ============
  useEffect(() => {
    if (isEditMode && initialData && !initializedRef.current) {
      setFormData({
        username: initialData.username || "",
        password: "",
        fullName: initialData.fullName || "",
        role: initialData.role || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        isActive: initialData.isActive ?? true,
      });
      setImagePreview(initialData.imageUrl || null);
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

  const handleSwitchChange = useCallback((name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  }, []);

  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.warning(USER_MESSAGES.IMAGE_INVALID_TYPE);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.warning(USER_MESSAGES.IMAGE_TOO_LARGE);
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    },
    []
  );

  const removeImage = useCallback(() => {
    setImagePreview(null);
    setImageFile(null);
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ ...DEFAULT_FORM });
    setImageFile(null);
    setImagePreview(null);
    setShowPassword(false);
    setErrors({});
    initializedRef.current = false;
  }, []);

  // ============ VALIDATE ============
  const validate = useCallback(() => {
    const schema = isEditMode ? updateUserSchema : createUserSchema;
    const result = schema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  }, [formData, isEditMode]);

  // ============ SUBMIT ============
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    if (!validate()) {
      toast.warning(USER_MESSAGES.VALIDATION_ERROR);
      return;
    }

    try {
      const submitData = toUserFormData(formData, imageFile, isEditMode);

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

  return {
    // Data
    formData,
    errors,
    imageFile,
    imagePreview,
    showPassword,
    isEditMode,

    // State
    isSubmitting,

    // Actions
    handleInputChange,
    handleSelectChange,
    handleSwitchChange,
    handleImageChange,
    removeImage,
    setShowPassword,
    handleSubmit,
    handleClose,
    resetForm,
  };
}

export default useUserForm;