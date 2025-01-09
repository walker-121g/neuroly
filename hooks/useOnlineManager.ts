import { useState } from "react";

import { toast } from "sonner";
import { onlineManager } from "@tanstack/react-query";

export const useOnlineManager = () => {
  const [toastObject, setToastObject] = useState<string | number | null>(null);

  onlineManager.subscribe((status) => {
    if (!status) {
      setToastObject(
        toast.error("Your internet connection has been disrupted!", {
          duration: Infinity,
        }),
      );
    } else if (toastObject) {
      toast.dismiss(toastObject);
      setToastObject(null);
    }
  });
};
