const express    = require("express"),
      router     = express.Router(),
      controller = require("../controllers/category.controller");

router.get("/", controller.getCategories);

router.get("/:id", controller.getCategory);

router.post("/", controller.addNewCategory);

router.patch("/:id", controller.updateCategory);

router.delete("/:id", controller.deleteCategory);

module.exports = router;
