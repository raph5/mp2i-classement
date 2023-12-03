import { useContext } from "react";
import { UserContext, UserContextValue } from "../contexts/UserContext";

export type useAuthHook = UserContextValue

export function useAuth(): useAuthHook {
  return useContext(UserContext)
}