import type { LoginInput, RegisterInput, User } from "@lexi/shared";
import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { fetchMe, loginUser, logoutUser, registerUser } from "../api/auth";
import { runEffectPromise } from "./runEffect";

export const meQueryKey = ["auth", "me"] as const;

export function useMe() {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: () => runEffectPromise(fetchMe()),
    retry: false,
  });
}

function setMe(queryClient: QueryClient, user: User | null) {
  queryClient.setQueryData(meQueryKey, user);
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RegisterInput) => runEffectPromise(registerUser(input)),
    onSuccess: (user) => setMe(queryClient, user),
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => runEffectPromise(loginUser(input)),
    onSuccess: (user) => setMe(queryClient, user),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => runEffectPromise(logoutUser()),
    onSuccess: () => setMe(queryClient, null),
  });
}
