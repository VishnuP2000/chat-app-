import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  console.log('protected route 1')
  const token = localStorage.getItem("accessToken");
  console.log('protected route 2',token)
  
  if (!token) {
    console.log('token is lost in protectedRout')
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}