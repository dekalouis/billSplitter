const express = require("express");
const router = express.Router();
const ItemController = require("../controllers/itemController");

const authentication = require("../middlewares/authentication");

const { authorizeItem } = require("../middlewares/authorization");

router.use(authentication);
//buat item baru
router.post("/", ItemController.createItem);

//get item dari billnya
// router.get("/bill/:billId", ItemController.getItemsByBill);

//update item
// router.put("/:id", authorizeItem, ItemController.updateItem);

//delete bill
router.delete("/:id", authorizeItem, ItemController.deleteItem);

module.exports = router;
