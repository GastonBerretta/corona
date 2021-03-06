const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");


router.get("/", cartController.index);
router.delete('/product', cartController.deleteProduct);
router.post("/toBuy",cartController.toBuy)

module.exports = router;