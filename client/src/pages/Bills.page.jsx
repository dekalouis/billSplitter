import { useDispatch, useSelector } from "react-redux";
import { getBillsByUser, deleteBill } from "../features/bill/billSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const BillsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bills, loading, error } = useSelector((state) => state.bill);

  useEffect(() => {
    dispatch(getBillsByUser());
  }, [dispatch]);

  const calculateTotal = (bill) => {
    const itemsTotal =
      bill.Items?.reduce((sum, item) => {
        return sum + item.price;
      }, 0) || 0;
    return itemsTotal + bill.vatAmount + bill.serviceChargeAmt;
  };

  const handleRowClick = (billId) => {
    navigate(`/bills/${billId}`);
  };

  const handleDelete = (e, billId) => {
    //BIAR ROW ONCLICK GA TRIGGER SENDIRI PAKAUI INI
    e.stopPropagation();
    dispatch(deleteBill(billId));
  };

  return (
    <div className="bills-page">
      <h1>Your Bills</h1>
      {loading && <p>Loading bills...</p>}
      {error && <p>Error: {error}</p>}
      {bills && bills.length > 0 ? (
        <table className="bills-table">
          <thead>
            <tr>
              <th>Bill Image</th>
              <th>Created Date</th>
              <th>Items Count</th>
              <th>Participants Count</th>
              <th>Total Amount</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr
                key={bill.id}
                onClick={() => handleRowClick(bill.id)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <img
                    src={bill.billImageUrl}
                    alt="Bill"
                    style={{ width: "100px", height: "auto" }}
                  />
                </td>
                <td>{new Date(bill.createdAt).toLocaleDateString()}</td>
                <td>{bill.Items ? bill.Items.length : 0}</td>
                <td>{bill.Participants ? bill.Participants.length : 0}</td>
                <td>{calculateTotal(bill)}</td>
                <td>
                  <button
                    onClick={(e) => handleDelete(e, bill.id)}
                    style={{
                      backgroundColor: "#e74c3c",
                      color: "#fff",
                      border: "none",
                      padding: "0.5rem 1rem",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No bills found.</p>
      )}
    </div>
  );
};

export default BillsPage;
