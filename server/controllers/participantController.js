const { Participant, Bill } = require("../models");

class ParticipantController {
  static async createParticipant(req, res, next) {
    try {
      const { name, BillId } = req.body;
      const participant = await Participant.create({ name, BillId });
      return res
        .status(201)
        .json({ message: "Participant created", participant });
    } catch (err) {
      next(err);
    }
  }
  static async getParticipantsByBill(req, res, next) {
    try {
      const { billId } = req.params;

      //authorization terpisah
      const userId = req.user.id;
      console.log(`ID billnya`, billId, `ID user`, userId);
      const bill = await Bill.findOne({
        where: { id: billId, createdBy: userId },
      });
      if (!bill) {
        next({
          name: "Forbidden",
          message: "You cannot access other user's bills",
        });
        return;
      }
      //authorization terpisah

      const participants = await Participant.findAll({
        where: { BillId: billId },
      });

      if (!participants) {
        next({ name: "NotFound", message: "Participant not found" });
        return;
      }

      return res.json(participants);
    } catch (err) {
      next(err);
    }
  }
  static async updateParticipant(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      //   const userId = req.user.id;

      //   const participant = await Participant.findOne({ where: { id } });
      //   if (!participant) {
      //     next({ name: "NotFound", message: "Participant not found" });
      //     return;
      //   }

      //   const bill = await Bill.findOne({
      //     where: { id: participant.BillId, createdBy: userId },
      //   });
      //   if (!bill) {
      //     next({
      //       name: "Forbidden",
      //       message: "You cannot update participants in other user's bills",
      //     });
      //     return;
      //   }
      const [updated] = await Participant.update({ name }, { where: { id } });
      if (!id) {
        next({ name: "NotFound", message: "Participant not found" });
        return;
      }
      if (!updated) {
        next({ name: "BadRequest", message: "Update failed" });
        return;
      }
      return res.json({ message: "Participant updated successfully" });
    } catch (err) {
      next(err);
    }
  }
  static async deleteParticipant(req, res, next) {
    try {
      const { id } = req.params;
      //   const userId = req.user.id;

      //   const participant = await Participant.findOne({ where: { id } });
      //   if (!participant) {
      //     next({ name: "NotFound", message: "Participant not found" });
      //     return;
      //   }

      //   const bill = await Bill.findOne({
      //     where: { id: participant.BillId, createdBy: userId },
      //   });
      //   if (!bill) {
      //     next({
      //       name: "Forbidden",
      //       message: "You cannot delete participants in other user's bills",
      //     });
      //     return;
      //   }

      const deleted = await Participant.destroy({ where: { id } });
      if (!deleted) {
        next({ name: "NotFound", message: "Participant not found" });
        return;
      }
      return res.json({ message: "Participant deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ParticipantController;
