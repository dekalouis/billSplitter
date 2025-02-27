import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/NavBar";

function PrivateLayout() {
  const access_token = localStorage.getItem("access_token");

  if (!access_token) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default PrivateLayout;
