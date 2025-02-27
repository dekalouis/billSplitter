import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBillById } from "../features/bill/billSlice";
import { useParams } from "react-router-dom";

const BillDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentBill, loading } = useSelector((state) => state.bill);

  useEffect(() => {
    if (id) {
      dispatch(getBillById(id));
    }
  }, [dispatch, id]);

  if (loading) return <p>Loading bill details...</p>;
  if (!currentBill) return <p>No bill found.</p>;

  const items = currentBill.Items || currentBill.items || [];
  const participants =
    currentBill.Participants || currentBill.participants || [];

  const itemsWithParticipantNames = items.map((item) => {
    const names = (item.Participants || []).map((p) => p.name).join(", ");

    const pricePerUnit = item.quantity > 0 ? item.price / item.quantity : 0;

    const itemTotal = item.price;
    const sharePerParticipant =
      item.Participants && item.Participants.length > 0
        ? itemTotal / item.Participants.length
        : 0;
    return {
      ...item,
      participantNames: names,
      pricePerUnit,
      itemTotal,
      sharePerParticipant,
    };
  });

  const totalItemsCost = itemsWithParticipantNames.reduce(
    (sum, item) => sum + item.itemTotal,
    0
  );

  const extraCharges =
    Number(currentBill.vatAmount) + Number(currentBill.serviceChargeAmt);

  const totalParticipants = participants.length;

  const participantPaymentMap = {};
  participants.forEach((p) => {
    participantPaymentMap[p.id] = { name: p.name, subtotal: 0 };
  });

  items.forEach((item) => {
    const itemTotal = item.price / item.quantity;
    const numItemParticipants =
      (item.Participants && item.Participants.length) || 0;
    if (numItemParticipants > 0) {
      const share = itemTotal / numItemParticipants;
      item.Participants.forEach((p) => {
        if (participantPaymentMap[p.id]) {
          participantPaymentMap[p.id].subtotal += share;
        }
      });
    }
  });

  const extraPerParticipant =
    totalParticipants > 0 ? extraCharges / totalParticipants : 0;

  const participantDetails = Object.values(participantPaymentMap).map((p) => {
    const finalAmount = p.subtotal + extraPerParticipant;
    return {
      ...p,
      extra: extraPerParticipant,
      finalAmount,
    };
  });

  const billTotal = totalItemsCost + extraCharges;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Bill Details</h1>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          <h2>Items</h2>
          {itemsWithParticipantNames.length ? (
            itemsWithParticipantNames.map((item) => (
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
                  {item.pricePerUnit.toFixed(2)} each
                </p>
                <p>
                  <em>Item Total: Rp. {item.itemTotal}</em>
                </p>
                <p>
                  <strong>Participants:</strong> {item.participantNames}
                </p>
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
            <strong>Total Price:</strong> Rp. {billTotal}
          </p>
        </div>

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
      {/* Bottom: Participant Payment Breakdown */}
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
            <p>Subtotal from items: Rp. {p.subtotal.toFixed(2)}</p>
            <p>Extra charges (VAT/Service share): Rp. {p.extra.toFixed(2)}</p>
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
