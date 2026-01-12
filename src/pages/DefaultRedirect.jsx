import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DefaultRedirect = () => {
  const user = useSelector((state) => state?.auth?.user);

  if (user) {
    return <Navigate to="/dashboard/overview" replace />;
  }

  return <Navigate to="/" replace />;
};

export default DefaultRedirect;
