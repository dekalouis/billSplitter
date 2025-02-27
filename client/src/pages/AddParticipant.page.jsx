import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createParticipant } from "../features/participant/participantSlice";
import { createAllocation } from "../features/allocation/allocationSlice";
import { getBillById } from "../features/bill/billSlice";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const AddParticipantsPage = () => {
  const { billId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locationState = useLocation().state || {};
  const createdItems = locationState.createdItems || [];

  const [participants, setParticipants] = useState([
    { name: "", selectedItems: [] },
  ]);

  useEffect(() => {
    if (billId) {
      dispatch(getBillById(billId));
    }
  }, [billId, dispatch]);

  const addParticipantRow = () => {
    setParticipants([...participants, { name: "", selectedItems: [] }]);
  };

  const removeParticipantRow = (index) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index));
    }
  };

  const handleNameChange = (index, value) => {
    const updated = [...participants];
    updated[index].name = value;
    setParticipants(updated);
  };

  const handleCheckboxChange = (participantIndex, itemId) => {
    const updated = [...participants];
    const selectedItems = updated[participantIndex].selectedItems;
    if (selectedItems.includes(itemId)) {
      updated[participantIndex].selectedItems = selectedItems.filter(
        (id) => id !== itemId
      );
    } else {
      updated[participantIndex].selectedItems.push(itemId);
    }
    setParticipants(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const resultSummary = []; //! BUAT NGUMPULIN DATANYA MAKE SURE DULU
    try {
      for (let participantData of participants) {
        const createdParticipant = await dispatch(
          createParticipant({
            name: participantData.name,
            BillId: parseInt(billId),
          })
        ).unwrap();
        console.log("Created participant:", createdParticipant);

        const allocationDetails = [];
        for (let itemId of participantData.selectedItems) {
          if (itemId !== undefined && itemId !== null) {
            const allocationResult = await dispatch(
              createAllocation({
                itemId,
                participantId: createdParticipant.participant.id,
              })
            ).unwrap();
            console.log(
              `Created allocation for participant ${createdParticipant.participant.id} for item ${itemId}:`,
              allocationResult
            );
            allocationDetails.push({
              itemId,
              allocation: allocationResult,
            });
          } else {
            console.warn("Skipping allocation due to undefined itemId", itemId);
          }
        }
        resultSummary.push({
          participant: createdParticipant.participant,
          allocations: allocationDetails,
        });
      }
      console.log("Final created records summary:", resultSummary);
      toast.success("Participants and allocations created successfully!", {
        position: "top-right",
      });

      navigate(`/bills/${billId}`, { replace: true });
    } catch (err) {
      console.log("Error creating participants or allocations:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Add Participants
        </h1>
        <form onSubmit={handleSubmit}>
          {participants.map((participant, index) => (
            <div
              key={index}
              className="border border-gray-300 p-3 mb-4 rounded"
            >
              <div className="mb-3">
                <label className="block mb-1 font-semibold">
                  Participant Name:
                </label>
                <input
                  type="text"
                  value={participant.name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1 font-semibold">
                  Assign Items:
                </label>
                <div>
                  {createdItems && createdItems.length > 0 ? (
                    createdItems.map((item) => (
                      <label key={item.id} className="mr-4">
                        <input
                          type="checkbox"
                          checked={participant.selectedItems.includes(item.id)}
                          onChange={() => handleCheckboxChange(index, item.id)}
                          className="mr-1"
                        />
                        {item.name}
                      </label>
                    ))
                  ) : (
                    <p>No items available for this bill.</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeParticipantRow(index)}
                className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addParticipantRow}
            className="mb-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
          >
            Add Participant
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-sky-400 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded"
          >
            Save Participants & Allocations
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddParticipantsPage;
