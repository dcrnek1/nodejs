import { useAuthRefresh } from "@/hooks/useAuth";

export default function AuthProvider({ children }) {
   const {isLoading} = useAuthRefresh()

  if (!isLoading) return children;
}