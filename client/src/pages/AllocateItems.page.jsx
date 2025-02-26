import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBillsByUser } from "../features/bill/billSlice"; // use full bill fetch
import { getParticipantsByBill } from "../features/participant/participantSlice";
import { createAllocation } from "../features/allocation/allocationSlice";
import { useNavigate, useParams } from "react-router-dom";

const AllocateItemsPage = () => {
  const { billId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //GET bills list pake item sm partisipan
  const { bills, loading: billLoading } = useSelector((state) => state.bill);
  const { loading: participantLoading } = useSelector(
    (state) => state.participant
  );
  const [allocations, setAllocations] = useState({});

  useEffect(() => {
    dispatch(getBillsByUser());
    dispatch(getParticipantsByBill(billId));
  }, [dispatch, billId]);

  const currentBill = bills.find((b) => b.id === Number(billId));

  const handleAllocationChange = (itemId, participantId, portion) => {
    setAllocations((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], [participantId]: portion },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // buat setiap alokasinuya kita dispatch thunk createAllocation
    for (const itemId in allocations) {
      for (const participantId in allocations[itemId]) {
        await dispatch(
          createAllocation({
            itemId,
            participantId,
            portion: allocations[itemId][participantId],
          })
        );
      }
    }
    // console.log("AllocationNYAAAAAA", allocations);
    navigate(`/bills/${billId}`);
  };

  const items = currentBill?.Items || [];
  const participantList = currentBill?.Participants || [];

  //   console.log(participantList, `INI DAFTAR ORANGNYA`);

  if (billLoading || participantLoading) {
    return <p>Loading bill details...</p>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Allocate Items</h1>
      {currentBill ? (
        <form onSubmit={handleSubmit}>
          {items.length ? (
            items.map((item) => (
              <div key={item.id} style={{ marginBottom: "1rem" }}>
                <h3>
                  {item.name} (x{item.quantity})
                </h3>
                {participantList.length ? (
                  participantList.map((participant) => (
                    <div key={participant.id}>
                      <label>{participant.name}: </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={allocations[item.id]?.[participant.id] || ""}
                        onChange={(e) =>
                          handleAllocationChange(
                            item.id,
                            participant.id,
                            e.target.value
                          )
                        }
                      />
                      %
                    </div>
                  ))
                ) : (
                  <p>No participants found.</p>
                )}
              </div>
            ))
          ) : (
            <p>No items found for this bill.</p>
          )}
          <button type="submit">Save & Continue</button>
        </form>
      ) : (
        <p>No bill found.</p>
      )}
    </div>
  );
};

export default AllocateItemsPage;
