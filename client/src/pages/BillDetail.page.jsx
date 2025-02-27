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
    <div className="flex-1 p-8 relative bg-sky-50">
      {/* Header */}
      <div className="bg-sky-100 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-sky-700">Bill Details</h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row justify-between mt-6 gap-6">
        {/* Items List */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-sky-700 mb-4">Items</h2>
          {itemsWithParticipantNames.length ? (
            itemsWithParticipantNames.map((item) => (
              <div key={item.id} className="border-b border-sky-300 pb-4 mb-4">
                <p className="font-bold">
                  {item.name} (x{item.quantity}) @ Rp.
                  {item.pricePerUnit.toLocaleString()} each
                </p>
                <p className="italic">
                  Item Total: Rp. {item.itemTotal.toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Participants:</span>{" "}
                  {item.participantNames}
                </p>
              </div>
            ))
          ) : (
            <p>No items found.</p>
          )}
          <p className="mt-2">
            <span className="font-semibold">VAT:</span> Rp.{" "}
            {currentBill.vatAmount}
          </p>
          <p className="mt-2">
            <span className="font-semibold">Service Charge:</span> Rp.{" "}
            {currentBill.serviceChargeAmt}
          </p>
          <p className="mt-2 text-lg font-bold">Total Price: Rp. {billTotal}</p>
        </div>

        {/* Bill Image */}
        <div className="w-full lg:w-[300px] flex-shrink-0">
          {currentBill.billImageUrl ? (
            <div className="w-[300px] h-[300px] rounded-lg shadow-lg overflow-hidden">
              <img
                src={currentBill.billImageUrl}
                alt="Bill"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <p>No image available.</p>
          )}
        </div>
      </div>

      {/* Participant Payment Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
        <h2 className="text-2xl font-semibold text-sky-700 mb-4">
          Participant Payment Details
        </h2>
        {participantDetails.map((p, index) => (
          <div key={index} className="border-b border-sky-300 py-2 mb-4">
            <p className="font-bold">{p.name}</p>
            <p>Subtotal from items: Rp. {p.subtotal.toLocaleString()}</p>
            <p>
              Extra charges (VAT/Service share): Rp. {p.extra.toLocaleString()}
            </p>
            <p className="font-semibold">
              Total Due: Rp. {p.finalAmount.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillDetailPage;
