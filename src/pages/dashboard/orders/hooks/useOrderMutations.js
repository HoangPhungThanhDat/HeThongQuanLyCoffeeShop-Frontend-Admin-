import { useMutation, useQueryClient } from "@tanstack/react-query";
import OrderAPI from "@/api/orderApi";
import {
  ORDER_MESSAGES,
  ORDER_DELETE_CONFIRM,
} from "../constants/messages";
import { toast } from "@/lib/toast";
import { orderKeys } from "./useOrders";

export function useOrderMutations() {
  const queryClient = useQueryClient();

  // Helper: invalidate mọi thứ liên quan tới orders
  // orderKeys.all = ["orders"] → dùng prefix matching → invalidate cả list + detail + stats
  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: orderKeys.all });
  };

  // ============ CREATE ============
  const createMutation = useMutation({
    mutationFn: (data) => OrderAPI.create(data),
    onSuccess: () => {
      invalidateAll();
      toast.success(ORDER_MESSAGES.CREATE_SUCCESS);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || ORDER_MESSAGES.CREATE_ERROR
      );
    },
  });

  // ============ UPDATE ============
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => OrderAPI.update(id, data),
    onSuccess: (_, variables) => {
      invalidateAll();
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.id),
      });
      toast.success(ORDER_MESSAGES.UPDATE_SUCCESS);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || ORDER_MESSAGES.UPDATE_ERROR
      );
    },
  });

  // ============ DELETE ============
  const deleteMutation = useMutation({
    mutationFn: (id) => OrderAPI.delete(id),
    onSuccess: () => {
      invalidateAll();
      toast.success(ORDER_MESSAGES.DELETE_SUCCESS);
    },
    onError: () => {
      toast.error(ORDER_MESSAGES.DELETE_ERROR);
    },
  });

  // ============ DELETE WITH CONFIRM ============
  const confirmAndDelete = async (id) => {
    const confirm = await toast.confirm(ORDER_DELETE_CONFIRM);
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

export default useOrderMutations;