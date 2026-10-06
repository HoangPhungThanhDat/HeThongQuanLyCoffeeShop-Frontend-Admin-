// src/pages/dashboard/category/hooks/useCategoryMutations.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CategoryAPI from "@/api/categoryApi";
import { CATEGORY_MESSAGES, CATEGORY_DELETE_CONFIRM } from "../constants/messages";
import { toast } from "@/lib/toast";
import { categoryKeys } from "./useCategories";

/**
 * Hook cung cấp các mutation: create, update, delete
 */
export function useCategoryMutations() {
  const queryClient = useQueryClient();

  // ============ CREATE ============
  const createMutation = useMutation({
    mutationFn: (data) => CategoryAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success(CATEGORY_MESSAGES.CREATE_SUCCESS);
    },
    onError: () => {
      toast.error(CATEGORY_MESSAGES.CREATE_ERROR);
    },
  });

  // ============ UPDATE ============
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => CategoryAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.id),
      });
      toast.success(CATEGORY_MESSAGES.UPDATE_SUCCESS);
    },
    onError: () => {
      toast.error(CATEGORY_MESSAGES.UPDATE_ERROR);
    },
  });

  // ============ DELETE ============
  const deleteMutation = useMutation({
    mutationFn: (id) => CategoryAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success(CATEGORY_MESSAGES.DELETE_SUCCESS);
    },
    onError: () => {
      toast.error(CATEGORY_MESSAGES.DELETE_ERROR);
    },
  });

  // ============ DELETE WITH CONFIRM ============
  const confirmAndDelete = async (id) => {
    const confirm = await toast.confirm(CATEGORY_DELETE_CONFIRM);
    if (confirm.isConfirmed) {
      return deleteMutation.mutateAsync(id);
    }
    return false;
  };

  return {
    // Create
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    // Update
    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    // Delete
    delete: deleteMutation.mutateAsync,
    confirmAndDelete,
    isDeleting: deleteMutation.isPending,
  };
}

export default useCategoryMutations;