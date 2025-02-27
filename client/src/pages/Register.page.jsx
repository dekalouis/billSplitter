import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // dispatch dulu registerUser async thunk
      await dispatch(registerUser({ email, password })).unwrap();
      toast.success("Registration successful!", {
        position: "top-right",
      });

      navigate("/users/login");
    } catch (err) {
      console.error("Registration failed:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side: gradient background */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-500 to-sky-400 items-center justify-center">
        <h2 className="text-white text-4xl font-bold">Join Us!</h2>
      </div>
      {/* Right side: registration form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6">Register</h1>
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
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
