import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UploadBillComponent from "./UploadComponent";

const Navbar = () => {
  const navigate = useNavigate();
  const [showUploader, setShowUploader] = useState(false);

  const isBillPage =
    location.pathname === "/bills" || location.pathname === "/bills/";

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/users/login");
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-sky-300 border-b border-sky-700">
      <div className="flex items-center">
        <Link to="/bills" className="mr-5 font-bold text-xl text-white">
          My Bills
        </Link>
        <button
          onClick={() => setShowUploader(true)}
          disabled={!isBillPage}
          className="mr-4 px-4 py-2 font-bold bg-sky-100 hover:bg-sky-200 text-sky-800 rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
"
        >
          Upload New Bill
        </button>
      </div>
      <div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 font-bold bg-gray-400 hover:bg-gray-600 text-white rounded cursor-pointer
"
        >
          Logout
        </button>
      </div>

      {showUploader && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <UploadBillComponent
            onClose={() => setShowUploader(false)}
            onSuccess={(uploadData) => {
              console.log("Upload successful:", uploadData);
            }}
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
