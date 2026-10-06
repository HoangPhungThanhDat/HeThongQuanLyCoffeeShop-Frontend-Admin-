
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PROMOTIONSAPI from "@/api/promotionApi";
import {
  PROMOTION_MESSAGES,
  PROMOTION_DELETE_CONFIRM,
} from "../constants/messages";
import { toast } from "@/lib/toast";
import { promotionKeys } from "./usePromotions";

export function usePromotionMutations() {
  const queryClient = useQueryClient();

  // ============ CREATE ============
  const createMutation = useMutation({
    mutationFn: (data) => PROMOTIONSAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promotionKeys.lists() });
      toast.success(PROMOTION_MESSAGES.CREATE_SUCCESS);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || PROMOTION_MESSAGES.CREATE_ERROR
      );
    },
  });

  // ============ UPDATE ============
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => PROMOTIONSAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: promotionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: promotionKeys.detail(variables.id),
      });
      toast.success(PROMOTION_MESSAGES.UPDATE_SUCCESS);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || PROMOTION_MESSAGES.UPDATE_ERROR
      );
    },
  });

  // ============ DELETE ============
  const deleteMutation = useMutation({
    mutationFn: (id) => PROMOTIONSAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promotionKeys.lists() });
      toast.success(PROMOTION_MESSAGES.DELETE_SUCCESS);
    },
    onError: () => {
      toast.error(PROMOTION_MESSAGES.DELETE_ERROR);
    },
  });

  // ============ DELETE WITH CONFIRM ============
  const confirmAndDelete = async (id) => {
    const confirm = await toast.confirm(PROMOTION_DELETE_CONFIRM);
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

export default usePromotionMutations;