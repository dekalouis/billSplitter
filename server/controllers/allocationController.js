const { Participant, Item, ItemAllocation } = require("../models");

class AllocationController {
  static async createAllocation(req, res, next) {
    console.log("Allocation payload received:", req.body);

    try {
      const { ParticipantId, ItemId } = req.body;
      //   console.log(` LOGNYAAA =====`, allocatedQuantity, ParticipantId, ItemId);
      //validasi
      const item = await Item.findOne({ where: { id: ItemId } });
      if (!item) {
        next({ name: "NotFound", message: "Item not found" });
        return;
      }
      const participant = await Participant.findOne({
        where: { id: ParticipantId },
      });
      if (!participant) {
        next({ name: "NotFound", message: "Participant not found" });
        return;
      }
      //validasi

      if (item.BillId !== participant.BillId) {
        throw {
          name: "BadRequest",
          message: "Item and Participant must belong to the same bill",
        };
      }

      const allocation = await ItemAllocation.create({
        isAllocated: true,
        ParticipantId,
        ItemId,
      });
      return res.status(201).json({
        message: "Allocation created",
        allocation: allocation.get({ plain: true }),
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAllocationsByItem(req, res, next) {
    try {
      const { itemId } = req.params;
      const allocations = await ItemAllocation.findAll({
        where: { ItemId: itemId },
        include: [{ model: Item }, { model: Participant }],
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
        include: [{ model: Item }, { model: Participant }],
      });
      return res.json(allocations);
    } catch (err) {
      next(err);
    }
  }

  // static async updateAllocation(req, res, next) {
  //   try {
  //     const { id } = req.params;
  //     const { allocatedQuantity } = req.body;
  //     const [updated] = await ItemAllocation.update(
  //       { allocatedQuantity },
  //       { where: { id } }
  //     );
  //     if (!updated) {
  //       next({ name: "NotFound", message: "Allocation not found" });
  //       return;
  //     }
  //     return res.json({ message: "Allocation updated successfully" });
  //   } catch (err) {
  //     next(err);
  //   }
  // }

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
