import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadBillImage } from "../features/bill/billSlice";
import { useNavigate } from "react-router-dom";

const UploadBillComponent = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.bill);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const resultAction = await dispatch(uploadBillImage(formData));
    if (uploadBillImage.fulfilled.match(resultAction)) {
      if (onSuccess) {
        // onSuccess(resultAction.payload);
        navigate("/bills/add", { state: { uploadData: resultAction.payload } });
      }

      if (onClose) onClose();
    }
  };

  return (
    <div className="upload-bill-component">
      <h2>Upload Bill Image</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <br />
        <button type="submit" disabled={loading} style={{ marginTop: "1rem" }}>
          {loading ? "Uploading..." : "Upload"}
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{
            marginTop: "1rem",
            marginLeft: "1rem",
            backgroundColor: "#ccc",
            border: "none",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default UploadBillComponent;

import PropTypes from "prop-types";

UploadBillComponent.propTypes = {
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
};
