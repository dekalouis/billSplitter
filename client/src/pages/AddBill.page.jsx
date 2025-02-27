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
    <div style={{ padding: "1rem" }}>
      <h1>Add Bill</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Bill Image URL:</label>
          <input
            type="text"
            value={billImageUrl}
            onChange={(e) => setBillImageUrl(e.target.value)}
            readOnly
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>VAT Amount:</label>
          <input
            type="number"
            value={vatAmount}
            onChange={(e) => setVatAmount(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Service Charge Amount:</label>
          <input
            type="number"
            value={serviceChargeAmt}
            onChange={(e) => setServiceChargeAmt(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <h2>Items</h2>
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(index, "name", e.target.value)
                  }
                  style={{ width: "100%", padding: "0.5rem" }}
                />
              </div>
              <div>
                <label>Quantity:</label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                  style={{ width: "100%", padding: "0.5rem" }}
                />
              </div>
              <div>
                <label>Price:</label>
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) =>
                    handleItemChange(index, "price", e.target.value)
                  }
                  style={{ width: "100%", padding: "0.5rem" }}
                />
              </div>
              <button
                type="button"
                onClick={() => removeItem(index)}
                style={{
                  marginTop: "0.5rem",
                  backgroundColor: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                }}
              >
                Remove Item
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addNewItem}
            style={{
              backgroundColor: "#3498db",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1rem",
              cursor: "pointer",
            }}
          >
            Add Item
          </button>
        </div>
        <button
          type="submit"
          style={{ padding: "0.5rem 1rem" }}
          disabled={isSubmitting}
        >
          Save Bill
        </button>
      </form>
    </div>
  );
};

export default AddBillPage;
