const express = require("express");
const router = express.Router();
const ParticipantController = require("../controllers/participantController");

const authentication = require("../middlewares/authentication");

const { authorizeParticipant } = require("../middlewares/authorization");

router.use(authentication);
// create participant
router.post("/", ParticipantController.createParticipant);

// participants by bill
// router.get("/bill/:billId", ParticipantController.getParticipantsByBill);

// // update participant
// router.put(
//   "/:id",
//   authorizeParticipant,
//   ParticipantController.updateParticipant
// );

// delete participant
router.delete(
  "/:id",
  authorizeParticipant,
  ParticipantController.deleteParticipant
);

module.exports = router;
