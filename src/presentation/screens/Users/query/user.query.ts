import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { container } from "../../../../container";
import { UserRepository } from "../../../../domain/repository/user/user.repository";
import { TYPES } from "../../../../types";
import toast from "react-hot-toast";
import { IAddUserReqDto } from "../../../../domain/dto/request/user/addUser.req.dto";
import { IUpdateUserReqDto } from "../../../../domain/dto/request/user/updateUser.req.dto";

const userRepository = container.get<UserRepository>(TYPES.UserRepository);

export function useGetAllUsers() {
  return useQuery({
    queryKey: ["getAllUsers"],
    queryFn: () => userRepository.getAll(),
  });
}

export function useAddUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["addUser"],
    mutationFn: (user: IAddUserReqDto) => userRepository.add(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
      toast.success("Usuario creado", {
        position: "top-right",
        duration: 3000,
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.detail;
      if (errorMessage == "Email already exists") {
        toast.error("El usuario ya existe", {
          position: "top-right",
          duration: 3000,
        });
      }else{
        toast.error("Error al crear usuario", {
          position: "top-right",
          duration: 3000,
        });
      }
      
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateUser"],
    mutationFn: (user: IUpdateUserReqDto) => userRepository.update(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
      toast.success("Usuario actualizado", {
        position: "top-right",
      });
    },
    onError: () => {
      toast.error("Error al actualizar usuario", {
        position: "top-right",
        duration: 3000,
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: (id: string) => userRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
      toast.success("Usuario eliminado", {
        position: "top-right",
        duration: 3000,
      });
    },
    onError: () => {
      toast.error("Error al eliminar usuario", {
        position: "top-right",
        duration: 3000,
      });
    },
  });
}