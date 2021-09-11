const express    = require("express"),
      router     = express.Router(),
      controller = require("../controllers/order.controller");

router.get("/", controller.getOrders);

router.get("/:id", controller.getOneOrder);

router.post("/", controller.addNewOrder);

router.patch("/:id", controller.updateOrder);

router.delete("/:id", controller.deleteOrder);

router.get("/get/totalSales", controller.getTotalSales);

router.get("/get/count", controller.ordersCount);

router.get("/get/userOrders/:userId", controller.getOrderUser);

module.exports = router;
