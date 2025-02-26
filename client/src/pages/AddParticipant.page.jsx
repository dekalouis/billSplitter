import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createParticipant,
  getParticipantsByBill,
} from "../features/participant/participantSlice";
import { useNavigate, useParams } from "react-router-dom";

const AddParticipantsPage = () => {
  const { billId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.participant);
  const [newParticipants, setNewParticipants] = useState([]);

  const handleAddParticipant = () => {
    setNewParticipants([...newParticipants, { name: "", billId }]);
  };

  const handleChange = (index, value) => {
    const updated = [...newParticipants];
    updated[index].name = value;
    setNewParticipants(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      for (const participant of newParticipants) {
        const payload = { BillId: Number(billId), name: participant.name };

        console.log("payloadNYAAA", payload);

        await dispatch(createParticipant(payload)).unwrap();
      }
      await dispatch(getParticipantsByBill(billId)).unwrap();

      navigate(`/bills/allocate-items/${billId}`);
    } catch (err) {
      console.error("Error adding participants:", err);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Add Participants</h1>
      <form onSubmit={handleSubmit}>
        {newParticipants.map((participant, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Participant Name"
              value={participant.name}
              onChange={(e) => handleChange(index, e.target.value)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={handleAddParticipant}>
          + Add Participant
        </button>
        <button type="submit" style={{ marginLeft: "1rem" }} disabled={loading}>
          {loading ? "Saving..." : "Next"}
        </button>
      </form>
    </div>
  );
};

export default AddParticipantsPage;
