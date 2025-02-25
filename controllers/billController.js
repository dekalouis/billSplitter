const { Bill } = require("../models");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

class BillController {
  static async createBill(req, res, next) {
    try {
      const userId = req.user.id;
      const { billImageUrl, vatRate, serviceChargeRate } = req.body;
      const parsedVatRate = parseFloat(vatRate);
      const parsedServiceChargeRate = parseFloat(serviceChargeRate);

      if (isNaN(parsedVatRate) || isNaN(parsedServiceChargeRate)) {
        next({
          name: "BadRequest",
          message: "VAT rate and service charge rate must be valid numbers",
        });
        return;
      }
      //   console.log(parsedVatRate, parsedServiceChargeRate);
      const newBill = await Bill.create({
        createdBy: userId,
        billImageUrl,
        vatRate: parsedVatRate,
        serviceChargeRate: parsedServiceChargeRate,
      });

      return res
        .status(201)
        .json({ message: "Bill created successfully", bill: newBill });
    } catch (err) {
      next(err);
    }
  }

  static async getBillsByUser(req, res, next) {
    try {
      //   return res.json("logging for getBillsByUser");
      const authenticatedUserId = req.user.id;
      const { userId } = req.params;

      if (authenticatedUserId !== parseInt(userId, 10)) {
        next({
          name: "Forbidden",
          message: "You cannot access other user's bills",
        });
        return;
      }

      const bills = await Bill.findAll({
        where: { createdBy: userId },
      });
      return res.status(200).json({ bills });
    } catch (err) {
      next(err);
    }
  }

  static async getBillById(req, res, next) {
    try {
      //   return res.json("logging for getBillById");
      const { id } = req.params;
      const bill = await Bill.findByPk(id);
      if (!bill) {
        next({ name: "NotFound", message: "Bill not found" });
        return;
      }

      return res.status(200).json({ bill });
    } catch (err) {
      next(err);
    }
  }

  static async updateBill(req, res, next) {
    try {
      //   return res.json("logging for updateBill");
      const { id } = req.params;
      const { billImageUrl, vatRate, serviceChargeRate } = req.body;
      const [updated] = await Bill.update(
        { billImageUrl, vatRate, serviceChargeRate },
        { where: { id } }
      );

      if (!updated) {
        next({ name: "NotFound", message: "Bill not found" });
        return;
      }

      return res.status(200).json({ message: "Bill updated successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async deleteBill(req, res, next) {
    try {
      //   return res.json("logging for deleteBill");
      const { id } = req.params;
      const deleted = await Bill.destroy({ where: { id } });

      if (!deleted) {
        next({ name: "NotFound", message: "Bill not found" });
        return;
      }

      return res.status(200).json({ message: "Bill deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = BillController;
