const express    = require("express"),
      router     = express.Router(),
      controller = require("../controllers/user.controller");

router.get("/", controller.getUsers);

router.get("/profile/:userId", controller.userProfile);

router.post("/register", controller.signup);

router.post("/login", controller.login);

router.delete("/:id", controller.deleteUser);

router.get("/get/count", controller.getUserCount);

module.exports = router;
