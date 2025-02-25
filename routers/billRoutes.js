const express = require("express");
const router = express.Router();

const BillController = require("../controllers/billController");
const authentication = require("../middlewares/authentication");

router.use(authentication);
//buat bill baru
router.post("/add-bill", BillController.createBill);

//check semua bill
router.get("/user/:userId", BillController.getBillsByUser);

//check bill dari id
router.get("/:id", BillController.getBillById);

//update bill
router.put("/:id", BillController.updateBill);

//delete bill
router.delete("/:id", BillController.deleteBill);

module.exports = router;
