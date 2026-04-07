import { useCallback, useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { accessTokenAtom } from "@/state/authAtom";
import { logoutApi, refreshAuthApi } from "@/api/auth";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function useAuthRefresh() {
  const setAccessToken = useSetAtom(accessTokenAtom);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
      try {
        const response = await refreshAuthApi();

        if (response.status === 200) {
          setAccessToken(response.data.accessToken);
        }
      } catch (error) {
        if (error) console.log("Silent refresh failed");
      } finally {
        setIsLoading(false);
      }
    }, [setAccessToken]);

  useEffect(() => {
   
    refresh();
  }, [refresh]);

  return {isLoading, refresh};
}

export function useAuthLogout() {
  const setAccessToken = useSetAtom(accessTokenAtom);
  const navigate = useNavigate();

  const logout = async () => {
      try {
        await logoutApi();
        navigate("/")
      } catch (error) {
        if (error) console.log("Logout on server failed");
      } finally {
        setAccessToken(null);
        toast.success("Succesfully signed out.", {duration: 1000});
      }
    };

  return logout;
}