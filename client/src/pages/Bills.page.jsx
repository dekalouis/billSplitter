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
    <div className="flex-1 p-8 relative bg-sky-50 min-h-screen">
      <div className="bg-sky-100 p-6 rounded-lg shadow-lg flex justify-between items-center">
        <h2 className="text-3xl font-bold text-sky-700">Your Bills</h2>
        {/* Optionally, add an "Add Bill" button here */}
      </div>

      {loading && <p className="text-center mt-4">Loading bills...</p>}
      {error && <p className="text-center mt-4 text-red-500">Error: {error}</p>}

      {bills && bills.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6 overflow-x-auto">
          <table className="w-full border-collapse border border-sky-300">
            <thead>
              <tr className="bg-sky-200 text-sky-700">
                <th className="border border-sky-300 px-4 py-2">Bill Image</th>
                <th className="border border-sky-300 px-4 py-2">
                  Created Date
                </th>
                <th className="border border-sky-300 px-4 py-2">Items Count</th>
                <th className="border border-sky-300 px-4 py-2">
                  Participants Count
                </th>
                <th className="border border-sky-300 px-4 py-2">
                  Total Amount
                </th>
                <th className="border border-sky-300 px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr
                  key={bill.id}
                  onClick={() => handleRowClick(bill.id)}
                  className="hover:bg-sky-100 cursor-pointer"
                >
                  <td className="border border-sky-300 px-4 py-2 text-center">
                    <img
                      src={bill.billImageUrl}
                      alt="Bill"
                      className="w-24 h-auto rounded-md"
                    />
                  </td>
                  <td className="border border-sky-300 px-4 py-2">
                    {new Date(bill.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border border-sky-300 px-4 py-2 text-center">
                    {bill.Items ? bill.Items.length : 0}
                  </td>
                  <td className="border border-sky-300 px-4 py-2 text-center">
                    {bill.Participants ? bill.Participants.length : 0}
                  </td>
                  <td className="border border-sky-300 px-4 py-2 text-center">
                    Rp. {calculateTotal(bill).toLocaleString()}
                  </td>
                  <td className="border border-sky-300 px-4 py-2 text-center">
                    <button
                      onClick={(e) => handleDelete(e, bill.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p className="text-center mt-4">No bills found.</p>
      )}
    </div>
  );
};

export default BillsPage;
