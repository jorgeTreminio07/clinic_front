import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { container } from "../../../container";
import { AuthRepository } from "../../../domain/repository/auth/auth.repository";
import { TYPES } from "../../../types";
import { useAuthStore } from "../../storage/auth.storage";
import { IAuthLoginReqDto } from "../../../domain/dto/request/auth/auth.req.dto";

const authRepository = container.get<AuthRepository>(TYPES.AuthRepository);

export function useGetMe() {
  return useQuery({
    queryKey: ["authMe"],
    queryFn: () => authRepository.me(),
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
}

export const useLogin = () => {
  const setUserData = useAuthStore((state) => state.setUserData);
  return useMutation({
    mutationKey: ["authLogin"],
    mutationFn: (params: IAuthLoginReqDto) => authRepository.login(params),

    onSettled(data) {
      if (data) {
        setUserData(data);
      }
    },
    onError: () => {
      toast.error("Verifique sus credenciales", {
        position: "top-right",
      });
    },
  });
};
