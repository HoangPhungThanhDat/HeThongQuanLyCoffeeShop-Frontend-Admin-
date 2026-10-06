import { useMutation, useQueryClient } from "@tanstack/react-query";
import ProductAPI from "@/api/productApi";
import {
  PRODUCT_MESSAGES,
  PRODUCT_DELETE_CONFIRM,
} from "../constants/messages";
import { toast } from "@/lib/toast";
import { productKeys } from "./useProducts";

export function useProductMutations() {
  const queryClient = useQueryClient();

  // Helper: invalidate mọi thứ liên quan tới products
  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: productKeys.all });
    // productKeys.all = ["products"] → invalidate hết list + detail + stats + newest
  };

  // ============ CREATE ============
  const createMutation = useMutation({
    mutationFn: (formData) => ProductAPI.create(formData),
    onSuccess: () => {
      invalidateAll();
      toast.success(PRODUCT_MESSAGES.CREATE_SUCCESS);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || PRODUCT_MESSAGES.CREATE_ERROR
      );
    },
  });

  // ============ UPDATE ============
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => ProductAPI.update(id, data),
    onSuccess: (_, variables) => {
      invalidateAll();
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
      });
      toast.success(PRODUCT_MESSAGES.UPDATE_SUCCESS);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || PRODUCT_MESSAGES.UPDATE_ERROR
      );
    },
  });

  // ============ DELETE ============
  const deleteMutation = useMutation({
    mutationFn: (id) => ProductAPI.delete(id),
    onSuccess: () => {
      invalidateAll();
      toast.success(PRODUCT_MESSAGES.DELETE_SUCCESS);
    },
    onError: () => {
      toast.error(PRODUCT_MESSAGES.DELETE_ERROR);
    },
  });

  // ============ DELETE WITH CONFIRM ============
  const confirmAndDelete = async (id) => {
    const confirm = await toast.confirm(PRODUCT_DELETE_CONFIRM);
    if (confirm.isConfirmed) {
      return deleteMutation.mutateAsync(id);
    }
    return false;
  };

  return {
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    delete: deleteMutation.mutateAsync,
    confirmAndDelete,
    isDeleting: deleteMutation.isPending,
  };
}

export default useProductMutations;