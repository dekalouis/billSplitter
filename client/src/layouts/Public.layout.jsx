import { Navigate, Outlet } from "react-router-dom";

const PublicLayout = () => {
  const access_token = localStorage.getItem("access_token");
  return access_token ? <Navigate to="/bills" /> : <Outlet />;
};

export default PublicLayout;
