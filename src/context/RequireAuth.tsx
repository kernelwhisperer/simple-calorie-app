import { Navigate, useLocation } from "react-router-dom";
import React from "react";
//
import { useUserContext } from "./UserContext";

type RequireAuthProps = {
  children: JSX.Element;
  /**
   * @default "user"
   */
  role?: string;
};

export function RequireAuth(props: RequireAuthProps) {
  const { children, role = "user" } = props;

  const [userState] = useUserContext();
  const location = useLocation();

  if (!userState.user || userState.profile?.role !== role) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/welcome" state={{ from: location }} replace />;
  }

  return children;
}
