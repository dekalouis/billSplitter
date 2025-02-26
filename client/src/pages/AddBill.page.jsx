// src/pages/AddBillPage.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createBill } from "../features/bill/billSlice";
import { createItem } from "../features/item/itemSlice";

const AddBillPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
  const [vatRate, setVatRate] = useState(uploadData?.data?.vatRate || "");
  const [serviceChargeRate, setServiceChargeRate] = useState(
    uploadData?.data?.serviceChargeRate || ""
  );
  const [vatAmount, setVatAmount] = useState(uploadData?.data?.vatAmount || "");
  const [serviceChargeAmt, setServiceChargeAmt] = useState(
    uploadData?.data?.serviceChargeAmt || ""
  );
  const [items, setItems] = useState(uploadData?.data?.items || []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //bikin billnya
      const billPayload = {
        billImageUrl,
        vatRate,
        serviceChargeRate,
      };
      const billResult = await dispatch(createBill(billPayload)).unwrap();
      const billId = billResult.id;
      //buat new item untuk masing-masing item di billId yang sama.
      for (const item of items) {
        await dispatch(createItem({ ...item, BillId: billId }));
      }

      //pas selesai
      navigate(`/bills/add-participants/${billId}`);
    } catch (err) {
      console.error("Error saving bill:", err);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] =
      field === "quantity" || field === "price" ? parseInt(value) : value;
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
          <label>VAT Rate:</label>
          <input
            type="number"
            value={vatRate}
            onChange={(e) => setVatRate(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Service Charge Rate:</label>
          <input
            type="number"
            value={serviceChargeRate}
            onChange={(e) => setServiceChargeRate(e.target.value)}
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
            </div>
          ))}
        </div>
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Save Bill
        </button>
      </form>
    </div>
  );
};

export default AddBillPage;
