const express = require("express");
const router = express.Router();

const billController = require("../controllers/billController");
const authentication = require("../middlewares/authentication");

router.use(authentication);
//buat bill baru
router.post("/add-bill", billController.createBill);

// //check semua bill
// router.get('user/:id', billController.getBillsByUser);

// //check bill dari id
// router.get('/:id', billController.getBillById);

// //update bill
// router.put('/:id', billController.updateBill);

// //delete bill
// router.delete('/:id', billController.deleteBill);

module.exports = router;
