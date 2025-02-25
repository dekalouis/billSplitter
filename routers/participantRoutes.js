const express = require("express");
const router = express.Router();
const ParticipantController = require("../controllers/participantController");

const authentication = require("../middlewares/authentication");

router.use(authentication);
// create participant
router.post("/", ParticipantController.createParticipant);

// participants by bill
router.get("/bill/:billId", ParticipantController.getParticipantsByBill);

// update participant
router.put("/:id", ParticipantController.updateParticipant);

// delete participant
router.delete("/:id", ParticipantController.deleteParticipant);

module.exports = router;
