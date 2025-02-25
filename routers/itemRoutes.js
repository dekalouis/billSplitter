const express = require("express");
const router = express.Router();
const ItemController = require("../controllers/itemController");

const authentication = require("../middlewares/authentication");

router.use(authentication);
//buat item baru
router.post("/", ItemController.createItem);

//get item dari billnya
router.get("/bill/:billId", ItemController.getItemsByBill);

//update item
router.put("/:id", ItemController.updateItem);

//delete bill
router.delete("/:id", ItemController.deleteItem);

module.exports = router;
