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
}

module.exports = BillController;
