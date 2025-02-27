import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createBill, deleteBill } from "../features/bill/billSlice";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { createItem } from "../features/item/itemSlice";

const AddBillPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [createdBillId, setCreatedBillId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ngambil parse data dari upload pakai location state
  const { uploadData } = location.state || {};

  useEffect(() => {
    if (!uploadData) {
      navigate("/bills/upload");
    }
  }, [uploadData, navigate]);

  // prepopulate form dari uploadData
  const [billImageUrl, setBillImageUrl] = useState(uploadData?.imageUrl || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [vatAmount, setVatAmount] = useState(uploadData?.data?.vatAmount || "");
  const [serviceChargeAmt, setServiceChargeAmt] = useState(
    uploadData?.data?.serviceChargeAmt || ""
  );
  const [items, setItems] = useState(uploadData?.data?.items || []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      //bikin billnya
      const billPayload = {
        billImageUrl,
        vatAmount,
        serviceChargeAmt,
      };
      const billResult = await dispatch(createBill(billPayload)).unwrap();
      const billId = billResult.id;
      setCreatedBillId(billId);

      //buat new item untuk masing-masing item di billId yang sama.
      // for (const item of items) {
      //   await dispatch(createItem({ ...item, BillId: billId }));
      // }

      // //pas selesai
      // navigate(`/bills/add-participants/${billId}`);

      const createdItems = [];
      for (const item of items) {
        const createdItem = await dispatch(
          createItem({ ...item, BillId: billId })
        ).unwrap();
        createdItems.push(createdItem);
      }
      toast.success("Bill created successfully!", {
        position: "top-right",
      });

      navigate(`/bills/add-participants/${billId}`, {
        state: { createdItems },
      });
    } catch (err) {
      console.error("Error saving bill:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message,
      });
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (createdBillId) {
        dispatch(deleteBill(createdBillId));
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [createdBillId, dispatch]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] =
      field === "quantity" || field === "price" ? parseInt(value) : value;
    setItems(updatedItems);
  };

  const addNewItem = () => {
    setItems([...items, { name: "", quantity: 0, price: 0 }]);
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Add Bill</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Bill Image URL:</label>
            <input
              type="text"
              value={billImageUrl}
              onChange={(e) => setBillImageUrl(e.target.value)}
              readOnly
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">VAT Amount:</label>
            <input
              type="number"
              value={vatAmount}
              onChange={(e) => setVatAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">
              Service Charge Amount:
            </label>
            <input
              type="number"
              value={serviceChargeAmt}
              onChange={(e) => setServiceChargeAmt(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Items</h2>
            {items.map((item, index) => (
              <div
                key={index}
                className="border border-gray-300 p-3 mb-3 rounded"
              >
                <div className="mb-2">
                  <label className="block mb-1">Name:</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      handleItemChange(index, "name", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1">Quantity:</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1">Price:</label>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(index, "price", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Remove Item
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addNewItem}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
            >
              Add Item
            </button>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-sky-400 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded"
          >
            Save Bill
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBillPage;
