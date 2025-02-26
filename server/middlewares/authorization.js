const { Bill, Item, Participant, ItemAllocation } = require("../models");

module.exports = {
  // 1. kepemilikan BILL
  async authorizeBill(req, res, next) {
    try {
      const billId = req.params.id;
      const userId = req.user.id;

      const bill = await Bill.findByPk(billId);
      if (!bill) {
        return next({ name: "NotFound", message: "Bill not found" });
      }

      // cek usernya pemilik bill atau bukan
      if (bill.createdBy !== userId) {
        return next({
          name: "Forbidden",
          message: "You don't have permission to access this Bill",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  },

  // 2. kepemilikan ITEM
  async authorizeItem(req, res, next) {
    try {
      const itemId = req.params.id;
      const userId = req.user.id;

      const item = await Item.findByPk(itemId);
      if (!item) {
        return next({ name: "NotFound", message: "Item not found" });
      }

      // cek kepemilikan via bill
      const bill = await Bill.findByPk(item.BillId);
      if (!bill) {
        return next({ name: "NotFound", message: "Bill not found" });
      }

      if (bill.createdBy !== userId) {
        return next({
          name: "Forbidden",
          message: "You don't have permission to modify this Item",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  },

  // 3. cek kepemilikan PARTICIPANT
  async authorizeParticipant(req, res, next) {
    try {
      const participantId = req.params.id;
      const userId = req.user.id;

      const participant = await Participant.findByPk(participantId);
      if (!participant) {
        return next({ name: "NotFound", message: "Participant not found" });
      }

      // cek kepemilikan via bill
      const bill = await Bill.findByPk(participant.BillId);
      if (!bill) {
        return next({ name: "NotFound", message: "Bill not found" });
      }

      if (bill.createdBy !== userId) {
        return next({
          name: "Forbidden",
          message: "You don't have permission to modify this Participant",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  },

  // 4. cek kepemilikan ALLOCATION
  async authorizeAllocation(req, res, next) {
    try {
      const allocationId = req.params.id;
      const userId = req.user.id;

      const allocation = await ItemAllocation.findByPk(allocationId);
      if (!allocation) {
        return next({ name: "NotFound", message: "Allocation not found" });
      }

      //harus cek allocation punya siapa dari item/partisipan
      // 1: check dr item
      const item = await Item.findByPk(allocation.ItemId);
      if (!item) {
        return next({ name: "NotFound", message: "Item not found" });
      }
      const bill = await Bill.findByPk(item.BillId);
      if (!bill) {
        return next({ name: "NotFound", message: "Bill not found" });
      }

      // cek usernya yang punya bukan
      if (bill.createdBy !== userId) {
        return next({
          name: "Forbidden",
          message: "You don't have permission to modify this Allocation",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  },
};
