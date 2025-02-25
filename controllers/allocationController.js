const { Participant, Item, ItemAllocation } = require("../models");

class AllocationController {
  static async createAllocation(req, res, next) {
    try {
      const { allocatedQuantity, ParticipantId, ItemId } = req.body;
      //   console.log(` LOGNYAAA =====`, allocatedQuantity, ParticipantId, ItemId);
      if (!allocatedQuantity || !ParticipantId || !ItemId) {
        next({
          name: "BadRequest",
          message: "Invalid allocation data",
        });
        return;
      }
      const allocation = await ItemAllocation.create({
        allocatedQuantity,
        ParticipantId,
        ItemId,
      });
      return res
        .status(201)
        .json({ message: "Allocation created", allocation });
    } catch (err) {
      next(err);
    }
  }

  static async getAllocationsByItem(req, res, next) {
    try {
      const { itemId } = req.params;
      const allocations = await ItemAllocation.findAll({
        where: { ItemId: itemId },
      });
      return res.json(allocations);
    } catch (err) {
      next(err);
    }
  }

  static async getAllocationsByParticipant(req, res, next) {
    try {
      const { participantId } = req.params;
      const allocations = await ItemAllocation.findAll({
        where: { ParticipantId: participantId },
      });
      return res.json(allocations);
    } catch (err) {
      next(err);
    }
  }

  static async updateAllocation(req, res, next) {
    try {
      const { id } = req.params;
      const { allocatedQuantity } = req.body;
      const [updated] = await ItemAllocation.update(
        { allocatedQuantity },
        { where: { id } }
      );
      if (!updated) {
        next({ name: "NotFound", message: "Allocation not found" });
        return;
      }
      return res.json({ message: "Allocation updated successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async deleteAllocation(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await ItemAllocation.destroy({ where: { id } });
      if (!deleted) {
        next({ name: "NotFound", message: "Allocation not found" });
        return;
      }
      return res.json({ message: "Allocation deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AllocationController;
