const express = require("express");
const router = express.Router();
const AllocationController = require("../controllers/allocationController");

const authentication = require("../middlewares/authentication");

router.use(authentication);
// buat item allocation baru
router.post("/", AllocationController.createAllocation);

// get allocations by item
router.get("/item/:itemId", AllocationController.getAllocationsByItem);

// get allocations by participant
router.get(
  "/participant/:participantId",
  AllocationController.getAllocationsByParticipant
);

// update allocation
router.put("/:id", AllocationController.updateAllocation);

// del allocation
router.delete("/:id", AllocationController.deleteAllocation);

module.exports = router;
