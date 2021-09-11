const express         = require("express"),
      router          = express.Router(),
      controller      = require("../controllers/product.controller"),
      authMiddlewares = require("../middlewares/uploadFiles");


router.get("/", controller.getAllProducts);

router.get("/:id", controller.getProductById);

router.post("/", authMiddlewares.upload.fields([{name : 'thumbnail' , maxCount : 1} , {name: "image", maxCount: 3}]) , controller.addNewProduct);

router.patch("/:id", authMiddlewares.upload.fields([{name : 'thumbnail' , maxCount : 1} , {name: "image", maxCount: 3}]) , controller.updateProduct);

router.delete("/:id", controller.deleteProduct);

router.get("/get/count", controller.getProductsCount);

router.get("/get/featured/:count", controller.getFeaturedProductCount);

module.exports = router;
 