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
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem",
        backgroundColor: "#f2f2f2",
        borderBottom: "1px solid #ccc",
      }}
    >
      <div>
        <Link
          to="/bills"
          style={{ marginRight: "1rem", textDecoration: "none", color: "#333" }}
        >
          My Bills
        </Link>
        {/* <Link
          to="/bills/add"
          style={{ marginRight: "1rem", textDecoration: "none", color: "#333" }}
        >
          Add Bill
        </Link> */}
        <button
          onClick={() => setShowUploader(true)}
          disabled={!isBillPage}
          style={{
            marginRight: "1rem",
            cursor: isBillPage ? "pointer" : "not-allowed",
            opacity: isBillPage ? 1 : 0.5,
          }}
        >
          Upload New Bill
        </button>
        {showUploader && (
          <div className="modal">
            <UploadBillComponent
              onClose={() => setShowUploader(false)}
              onSuccess={(uploadData) => {
                // Optionally use the uploadData, e.g. pre-fill new bill info
                console.log("Upload successful:", uploadData);
              }}
            />
          </div>
        )}
      </div>
      <div>
        <button
          onClick={handleLogout}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#e74c3c",
            border: "none",
            borderRadius: "4px",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
