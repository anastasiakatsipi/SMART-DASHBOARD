import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "@/auth/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, currentRole } = useContext(AuthContext);

  // console.log("roles raw:", roles);
  // console.log("currentRole raw:", currentRole);
  // console.log("currentRole EXACT:", JSON.stringify(currentRole));
  // console.log("includes?:", roles.includes(currentRole));
  // console.log(
  //   "normalized includes?:",
  //   roles.map((r) => r.trim().toLowerCase()).includes(currentRole?.trim?.().toLowerCase())
  // );


  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (roles && !roles.includes(currentRole)) {
    return <Navigate to="/dashboard/403" replace />;

  }


  return children;
}
