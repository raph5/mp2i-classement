import type React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

export interface PublicMiddlewareProps {
  children?: React.ReactNode
}

const PublicMiddleware: React.FC<PublicMiddlewareProps> = ({ children }) => {
  
  const { user } = useAuth()

  if(user) {
    if(!user.displayName) {
      return <Navigate to="/signup-form" />
    }
    return <Navigate to="/app" />
  }
  else {
    return children
  }

}

export default PublicMiddleware