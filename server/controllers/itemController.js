const { Item, Bill } = require("../models");

class ItemController {
  static async createItem(req, res, next) {
    try {
      const { name, quantity, price, BillId } = req.body;
      const item = await Item.create({ name, quantity, price, BillId });
      return res.status(201).json({ message: "Item created", item });
    } catch (err) {
      next(err);
    }
  }
  // static async getItemsByBill(req, res, next) {
  //   try {
  //     const { billId } = req.params;

  //     //authorization terpisah
  //     const userId = req.user.id;
  //     const bill = await Bill.findOne({
  //       where: { id: billId, createdBy: userId },
  //     });
  //     if (!bill) {
  //       next({
  //         name: "Forbidden",
  //         message: "You cannot access other user's bills",
  //       });
  //       return;
  //     }
  //     //authorization terpisah

  //     const items = await Item.findAll({ where: { BillId: billId } });

  //     if (!items) {
  //       next({ name: "NotFound", message: "Item not found" });
  //       return;
  //     }

  //     return res.json(items);
  //   } catch (err) {
  //     next(err);
  //   }
  // }
  // static async updateItem(req, res, next) {
  //   try {
  //     const { id } = req.params;
  //     const { name, quantity, price } = req.body;
  //     //   const userId = req.user.id;

  //     const item = await Item.findOne({ where: { id } });
  //     if (!item) {
  //       next({ name: "NotFound", message: "Item not found" });
  //       return;
  //     }

  //     //CHECK BILLNYA PUNYA SIAPA
  //     //   const bill = await Bill.findOne({
  //     //     where: { id: item.BillId, createdBy: userId },
  //     //   });
  //     //   if (!bill) {
  //     //     next({
  //     //       name: "Forbidden",
  //     //       message: "You cannot update items in other user's bills",
  //     //     });
  //     //     return;
  //     //   }

  //     const [updated] = await Item.update(
  //       { name, quantity, price },
  //       { where: { id } }
  //     );
  //     if (!id) {
  //       next({ name: "NotFound", message: "Item not found" });
  //       return;
  //     }
  //     if (!updated) {
  //       next({ name: "NotFound", message: "Item unchanged" });
  //       return;
  //     }
  //     return res.json({ message: "Item updated successfully" });
  //   } catch (err) {
  //     next(err);
  //   }
  // }
  static async deleteItem(req, res, next) {
    try {
      const { id } = req.params;
      //   const userId = req.user.id;

      const item = await Item.findOne({ where: { id } });
      if (!item) {
        next({ name: "NotFound", message: "Item not found" });
        return;
      }

      //   //CHECK BILLNYA PUNYA SIAPA
      //   const bill = await Bill.findOne({
      //     where: { id: item.BillId, createdBy: userId },
      //   });
      //   if (!bill) {
      //     next({
      //       name: "Forbidden",
      //       message: "You cannot delete items in other user's bills",
      //     });
      //     return;
      //   }

      //   console.log(`BillNYAA: ${JSON.stringify(bill)}, UserIdNYAA: ${userId}`);

      const deleted = await Item.destroy({ where: { id } });
      if (!deleted) {
        next({ name: "NotFound", message: "Item not found" });
        return;
      }
      return res.json({ message: "Item deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ItemController;
