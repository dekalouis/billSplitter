// src/pages/UploadBillPage.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadBillImage } from "../features/bill/billSlice";
import { useNavigate } from "react-router-dom";

const UploadBillPage = () => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.bill);

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
      navigate("/bills/add", { state: { uploadData: resultAction.payload } });
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Upload Bill Image</h1>
      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <br />
        <button type="submit" disabled={loading} style={{ marginTop: "1rem" }}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default UploadBillPage;
