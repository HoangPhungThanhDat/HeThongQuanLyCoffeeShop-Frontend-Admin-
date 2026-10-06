
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TableAPI from "@/api/tableApi";
import { TABLE_MESSAGES, TABLE_DELETE_CONFIRM } from "../constants/messages";
import { toast } from "@/lib/toast";
import { tableKeys } from "./useTables";

export function useTableMutations() {
  const queryClient = useQueryClient();

  // ============ CREATE ============
  const createMutation = useMutation({
    mutationFn: (data) => TableAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tableKeys.lists() });
      toast.success(TABLE_MESSAGES.CREATE_SUCCESS);
    },
    onError: () => {
      toast.error(TABLE_MESSAGES.CREATE_ERROR);
    },
  });

  // ============ UPDATE ============
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => TableAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: tableKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tableKeys.detail(variables.id) });
      toast.success(TABLE_MESSAGES.UPDATE_SUCCESS);
    },
    onError: () => {
      toast.error(TABLE_MESSAGES.UPDATE_ERROR);
    },
  });

  // ============ DELETE ============
  const deleteMutation = useMutation({
    mutationFn: (id) => TableAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tableKeys.lists() });
      toast.success(TABLE_MESSAGES.DELETE_SUCCESS);
    },
    onError: () => {
      toast.error(TABLE_MESSAGES.DELETE_ERROR);
    },
  });

  // ============ DELETE WITH CONFIRM ============
  const confirmAndDelete = async (id) => {
    const confirm = await toast.confirm(TABLE_DELETE_CONFIRM);
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

export default useTableMutations;