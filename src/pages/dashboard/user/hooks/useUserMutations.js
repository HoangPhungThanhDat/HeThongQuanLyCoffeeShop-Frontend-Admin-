
import { useMutation, useQueryClient } from "@tanstack/react-query";
import UserAPI from "@/api/userApi";
import { USER_MESSAGES, USER_DELETE_CONFIRM } from "../constants/messages";
import { toast } from "@/lib/toast";
import { userKeys } from "./useUsers";

export function useUserMutations() {
  const queryClient = useQueryClient();

  // ============ CREATE ============
  const createMutation = useMutation({
    mutationFn: (formData) => UserAPI.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success(USER_MESSAGES.CREATE_SUCCESS);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || USER_MESSAGES.CREATE_ERROR
      );
    },
  });

  // ============ UPDATE ============
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => UserAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      toast.success(USER_MESSAGES.UPDATE_SUCCESS);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || USER_MESSAGES.UPDATE_ERROR
      );
    },
  });

  // ============ DELETE ============
  const deleteMutation = useMutation({
    mutationFn: (id) => UserAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success(USER_MESSAGES.DELETE_SUCCESS);
    },
    onError: () => {
      toast.error(USER_MESSAGES.DELETE_ERROR);
    },
  });

  // ============ DELETE WITH CONFIRM ============
  const confirmAndDelete = async (id) => {
    const confirm = await toast.confirm(USER_DELETE_CONFIRM);
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

export default useUserMutations;