// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { uploadBillImage } from "../features/bill/billSlice";
// import { useNavigate } from "react-router-dom";

// const UploadBillComponent = ({ onClose, onSuccess }) => {
//   const [file, setFile] = useState(null);
//   const dispatch = useDispatch();
//   const { loading, error } = useSelector((state) => state.bill);
//   const navigate = useNavigate();

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("image", file);

//     const resultAction = await dispatch(uploadBillImage(formData));
//     if (uploadBillImage.fulfilled.match(resultAction)) {
//       if (onSuccess) {
//         // onSuccess(resultAction.payload);
//         navigate("/bills/add", { state: { uploadData: resultAction.payload } });
//       }

//       if (onClose) onClose();
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
//       <h2 className="text-xl font-bold mb-4 text-center">Upload Bill Image</h2>
//       <form onSubmit={handleUpload}>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleFileChange}
//           className="mb-4 block w-full"
//         />
//         <div className="flex justify-center">
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
//           >
//             {loading ? "Uploading..." : "Upload"}
//           </button>
//           <button
//             type="button"
//             onClick={onClose}
//             className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mt-4 ml-4"
//           >
//             Close
//           </button>
//         </div>
//       </form>
//       {error && <p className="text-red-500 mt-2">{error}</p>}
//     </div>
//   );
// };

// export default UploadBillComponent;

// import PropTypes from "prop-types";

// UploadBillComponent.propTypes = {
//   onClose: PropTypes.func,
//   onSuccess: PropTypes.func,
// };
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadBillImage } from "../features/bill/billSlice";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const UploadBillComponent = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.bill);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const resultAction = await dispatch(uploadBillImage(formData));
    if (uploadBillImage.fulfilled.match(resultAction)) {
      if (onSuccess) {
        navigate("/bills/add", { state: { uploadData: resultAction.payload } });
      }
      if (onClose) onClose();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
      <h2 className="text-xl font-bold mb-4 text-center">Upload Bill Image</h2>
      <div className="flex flex-col items-center">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-40 h-40 object-cover rounded-md mb-4 border-2 border-gray-300 shadow-md"
          />
        ) : (
          <div className="border-2 border-dashed border-gray-300 w-40 h-40 flex items-center justify-center text-gray-500 bg-gray-100 rounded-md mb-4">
            <span>Select the image!</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="billUpload"
          disabled={loading}
        />
        <label
          htmlFor="billUpload"
          className={`mt-3 mb-1 px-6 py-3 rounded-md text-white font-semibold shadow-md cursor-pointer transition-all ${
            loading
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Select File
        </label>
        {file && (
          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md mt-4 w-full font-semibold shadow-md transition-all"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        )}
        <button
          className={`mt-4 px-6 py-3 rounded-md w-full font-semibold shadow-md transition-all ${
            loading
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-gray-500 hover:bg-gray-700 text-white"
          }`}
          onClick={onClose}
          disabled={loading}
        >
          Close
        </button>
      </div>
      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
    </div>
  );
};

UploadBillComponent.propTypes = {
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
};

export default UploadBillComponent;
