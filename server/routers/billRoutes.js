const express = require("express");
const router = express.Router();

const BillController = require("../controllers/billController");
const authentication = require("../middlewares/authentication");

const { authorizeBill } = require("../middlewares/authorization");
const upload = require("../middlewares/upload");

router.use(authentication);
//buat bill baru
router.post("/add-bill", BillController.createBill);

//check semua bill
router.get("/user/:userId", BillController.getBillsByUser);

//check bill dari id
router.get("/:id", authorizeBill, BillController.getBillById);

//update bill
router.put("/:id", authorizeBill, BillController.updateBill);

//delete bill
router.delete("/:id", authorizeBill, BillController.deleteBill);

router.post(
  "/upload-image",
  upload.single("image"),
  BillController.uploadBillImage
);

module.exports = router;
