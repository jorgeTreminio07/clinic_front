import { useQuery } from "@tanstack/react-query";
import { container } from "../../../container";
import { RolRepository } from "../../../domain/repository/rol/rol.repository";
import { TYPES } from "../../../types";

const rolRepository = container.get<RolRepository>(TYPES.RolRepository);

export function useGetAllRoles() {
  return useQuery({
    queryKey: ["getAllRoles"],
    queryFn: () => rolRepository.getAll(),
  });
}
