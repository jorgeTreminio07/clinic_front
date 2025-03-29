import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { container } from "../../../../container";
import { BackupRespository } from "../../../../domain/repository/backup/backup.repository";
import { TYPES } from "../../../../types";
import toast from "react-hot-toast";

const backupRepository = container.get<BackupRespository>(
  TYPES.BackupRepository
);

export function useGetAllBackups() {
  return useQuery({
    queryKey: ["getAllBackups"],
    queryFn: () => backupRepository.getAll(),
  });
}

export function useGenerateBackup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["generateBackup"],
    mutationFn: () => backupRepository.generate(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllBackups"] });
      toast.success("Backup generado", {
        position: "top-right",
        duration: 3000,
      });
    },
    onError: () => {
      toast.error("Error al generar backup", {
        position: "top-right",
        duration: 3000,
      });
    },
  });
}

export function useDeleteBackup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteBackup"],
    mutationFn: (id: string) => backupRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllBackups"] });
      toast.success("Backup eliminado", {
        position: "top-right",
        duration: 3000,
      });
    },
    onError: () => {
      toast.error("Error al eliminar backup", {
        position: "top-right",
        duration: 3000,
      });
    },
  });
}


export function useRestoreBackup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["restoreBackup"],
    mutationFn: (id: string) => backupRepository.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllBackups"] });
      toast.success("Backup restaurado", {
        position: "top-right",
        duration: 3000,
      });
    },
    onError: () => {
      toast.error("Error al restaurar backup", {
        position: "top-right",
        duration: 3000,
      });
    },
  });
}