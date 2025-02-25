const express = require("express");
const router = express.Router();
const AllocationController = require("../controllers/allocationController");

const authentication = require("../middlewares/authentication");

const { authorizeAllocation } = require("../middlewares/authorization");

router.use(authentication);
// buat item allocation baru
router.post("/", AllocationController.createAllocation);

// get allocations by item
router.get(
  "/item/:itemId",

  AllocationController.getAllocationsByItem
);

// get allocations by participant
router.get(
  "/participant/:participantId",

  AllocationController.getAllocationsByParticipant
);

// update allocation
router.put("/:id", authorizeAllocation, AllocationController.updateAllocation);

// del allocation
router.delete(
  "/:id",
  authorizeAllocation,
  AllocationController.deleteAllocation
);

module.exports = router;
