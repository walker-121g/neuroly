import { useMemo } from "react";

import { Loader2 } from "lucide-react";

import { useLogoutMutation } from "@/lib/queries/mutations/auth.mutations";

export default function LogoutPage() {
  const { logout } = useLogoutMutation();

  useMemo(() => {
    logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <Loader2 className="size-6 animate-spin" />
    </div>
  );
}
