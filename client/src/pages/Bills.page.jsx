import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBillsByUser } from "../features/bill/billSlice";
import { useNavigate } from "react-router-dom";

const BillsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bills, loading, error } = useSelector((state) => state.bill);
  // console.log("Bills from Redux:", bills);

  useEffect(() => {
    dispatch(getBillsByUser());
  }, [dispatch]);

  const calculateTotal = (bill) => {
    if (!bill.Items || !Array.isArray(bill.Items)) return 0;
    const itemTotal = bill.Items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    // console.log(itemTotal, `HARGA SEBELOM PAJAK`);
    // console.log(bill.vatAmount, `HARGA  PAJAK`);
    // console.log(bill.serviceChargeAmt, `HARGA  Servis`);
    return itemTotal + bill.vatAmount + bill.serviceChargeAmt;
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Your Bills</h1>
      {loading && <p>Loading bills...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {bills && bills.length > 0 ? (
        <table
          border="1"
          cellPadding="10"
          cellSpacing="0"
          style={{ width: "100%", marginBottom: "1rem", textAlign: "left" }}
        >
          <thead>
            <tr>
              <th>Image</th>
              <th>Date</th>
              <th>Items</th>
              <th>Participants</th>
              <th style={{ textAlign: "right" }}>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td>
                  {bill.billImageUrl ? (
                    <img
                      src={bill.billImageUrl}
                      alt="Bill"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{new Date(bill.createdAt).toLocaleDateString()}</td>
                <td>{bill.Items ? bill.Items.length : 0}</td>
                <td>{bill.Participants ? bill.Participants.length : 0}</td>
                <td style={{ textAlign: "right" }}>
                  Rp. {calculateTotal(bill).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No bills found.</p>
      )}

      <button
        onClick={() => navigate("/bills/upload")}
        style={{ padding: "0.5rem 1rem" }}
      >
        Upload Bill
      </button>
    </div>
  );
};

export default BillsPage;
