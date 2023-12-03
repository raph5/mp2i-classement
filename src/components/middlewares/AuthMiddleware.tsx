import type React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

export interface AuthMiddlewareProps {
  children?: React.ReactNode
}

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
  
  const { user } = useAuth()

  const location = useLocation()

  if(user) {
    if(!user.displayName && location.pathname != "/signup-form") {
      return <Navigate to="/signup-form" />
    }
    return children
  }
  else {
    return <Navigate to="/" />
  }

}

export default AuthMiddleware