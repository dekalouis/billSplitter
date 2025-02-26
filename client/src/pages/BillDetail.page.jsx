import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBillById } from "../features/bill/billSlice";
import { useParams } from "react-router-dom";

const BillDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentBill, loading } = useSelector((state) => state.bill);
  //   const [bill, setBill] = useState(null);

  // Fetch all bills (which include full associations)
  useEffect(() => {
    dispatch(getBillById());
  }, [dispatch]);

  // Find the current bill using its id.
  useEffect(() => {
    if (id) {
      dispatch(getBillById(id));
    }
  }, [dispatch, id]);

  if (loading) return <p>Loading bill details...</p>;
  if (!currentBill) return <p>No bill found.</p>;

  // Use default empty arrays
  const items = currentBill.Items || currentBill.items || [];
  const participants =
    currentBill.Participants || currentBill.participants || [];

  // Compute the cost each participant owes from item allocations.
  // We assume that each item has an Allocations array with objects like:
  // { ParticipantId, allocatedQuantity } where allocatedQuantity is a percentage (0–100)
  const participantSubtotals = {};
  //   let totalItemCost = 0;
  items.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    // totalItemCost += itemTotal;
    if (item.Allocations && Array.isArray(item.Allocations)) {
      item.Allocations.forEach((alloc) => {
        const allocatedCost = (alloc.allocatedQuantity / 100) * itemTotal;
        if (participantSubtotals[alloc.ParticipantId]) {
          participantSubtotals[alloc.ParticipantId] += allocatedCost;
        } else {
          participantSubtotals[alloc.ParticipantId] = allocatedCost;
        }
      });
    }
  });

  // The extra charges (VAT + Service)
  const extraCharges =
    Number(currentBill.vatAmount) + Number(currentBill.serviceChargeAmt);

  // Sum of all participant subtotals (ideally should equal totalItemCost)
  const totalParticipantSubtotal = Object.values(participantSubtotals).reduce(
    (sum, amt) => sum + amt,
    0
  );

  // Compute final amounts for each participant.
  const participantDetails = participants.map((p) => {
    const subtotal = participantSubtotals[p.id] || 0;
    const shareRatio =
      totalParticipantSubtotal > 0 ? subtotal / totalParticipantSubtotal : 0;
    const extra = shareRatio * extraCharges;
    const finalAmount = subtotal + extra;
    return {
      ...p,
      subtotal,
      extra,
      finalAmount,
      extraPercentage: extraCharges > 0 ? (extra / extraCharges) * 100 : 0,
    };
  });

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Bill Details</h1>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left column: Bill text details */}
        <div style={{ flex: 1 }}>
          <h2>Items</h2>
          {items.length ? (
            items.map((item) => (
              <div
                key={item.id}
                style={{
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <p>
                  <strong>{item.name}</strong> (x{item.quantity}) @ Rp.
                  {item.price} each
                </p>
                <p>
                  <em>Item Total: Rp. {item.price * item.quantity}</em>
                </p>
                <div>
                  <h4>Allocations:</h4>
                  {item.Allocations && item.Allocations.length ? (
                    item.Allocations.map((alloc) => {
                      const participant = participants.find(
                        (p) => p.id === alloc.ParticipantId
                      );
                      return (
                        <p key={alloc.ParticipantId}>
                          {participant ? participant.name : "Unknown"}:{" "}
                          {alloc.allocatedQuantity}%
                        </p>
                      );
                    })
                  ) : (
                    <p>No allocations for this item.</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No items found.</p>
          )}
          <p>
            <strong>VAT:</strong> Rp. {currentBill.vatAmount}
          </p>
          <p>
            <strong>Service Charge:</strong> Rp. {currentBill.serviceChargeAmt}
          </p>
          <p>
            <strong>Total Price:</strong> Rp. {currentBill.totalPayment}
          </p>
        </div>
        {/* Right column: currentBill photo */}
        <div style={{ marginLeft: "2rem" }}>
          {currentBill.billImageUrl ? (
            <img
              src={currentBill.billImageUrl}
              alt="Bill"
              style={{ width: "300px", height: "300px", objectFit: "cover" }}
            />
          ) : (
            <p>No image available.</p>
          )}
        </div>
      </div>
      {/* Bottom: Participant payment breakdown */}
      <div style={{ marginTop: "2rem" }}>
        <h2>Participant Payment Details</h2>
        {participantDetails.map((p) => (
          <div
            key={p.id}
            style={{
              borderBottom: "1px solid #ccc",
              padding: "0.5rem 0",
              marginBottom: "1rem",
            }}
          >
            <p>
              <strong>{p.name}</strong>
            </p>
            <p>Subtotal: Rp. {p.subtotal.toFixed(2)}</p>
            <p>
              VAT/Service Share: Rp. {p.extra.toFixed(2)} (
              {p.extraPercentage.toFixed(2)}%)
            </p>
            <p>
              <strong>Total Due: Rp. {p.finalAmount.toFixed(2)}</strong>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillDetailPage;
