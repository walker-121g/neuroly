import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useContext } from "@/hooks/useContext";
import { useAuth } from "@/hooks/useAuth";
import { request } from "@/lib/http";

import { QueryKeys } from "..";
import { LogoutSchema } from "@/lib/schemas/auth.schema";

export const useLogoutMutation = () => {
  const router = useRouter();

  const { refreshToken } = useAuth();
  const { user } = useContext();

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationKey: QueryKeys.mutations.logout,
    mutationFn: async () => {
      const input: LogoutSchema = {
        refreshToken: refreshToken!,
        id: user!.id,
      };

      await request<{ success: boolean }>({
        path: "/api/auth/logout",
        method: "POST",
        body: input,
      });
    },
    onSuccess: () => {
      useAuth.getState().setToken(null);
      useAuth.getState().setRefreshToken(null);
      useContext.getState().setUser(null);
      router.replace("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    logout: mutate,
    logoutPending: isPending,
    logoutSuccess: isSuccess,
    logoutError: isError,
  };
};
