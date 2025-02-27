import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import httpClient from "../helpers/http-client";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await dispatch(loginUser({ email, password })).unwrap();

      // console.log(`INI YA-----`, data);
      localStorage.setItem("access_token", data.access_token);

      // const userId = ;
      // console.log(userId);
      toast.success("Login successful!", {
        position: "top-right",
      });

      navigate(`/bills`);
    } catch (err) {
      console.error("Login failed:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message,
      });
    }
  };

  async function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token:", response);

    const { data } = await httpClient.post("/users/login/google", {
      googleToken: response.credential,
    });
    localStorage.setItem("access_token", data.access_token);
    toast.success("Login successful!", {
      position: "top-right",
    });

    navigate(`/bills`);
  }

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" } // customization attributes
    );
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Left side: gradient background */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-500 to-sky-400 items-center justify-center">
        <h2 className="text-white text-4xl font-bold">Welcome Back!</h2>
      </div>
      {/* Right side: login form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6">Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">Email:</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Password:</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="mt-4 text-center ">
            {"Don't"} have an account?{" "}
            <Link className="text-sky-800" to={"/users/register"}>
              Register
            </Link>
          </p>
        </div>
        <div className="mt-3" id="buttonDiv"></div>
      </div>
    </div>
  );
};

export default LoginPage;
