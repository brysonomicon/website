const express = require("express");
const router = express.Router();
const passwordResetController = require("../controllers/resetController");

console.log("resetRoutes.js loaded");

router.get("/requestReset", (req, res) => {
  console.log("Rendering requestPassReset page");
  res.render("requestPassReset");
});

router.get("/resetPassword", (req, res) => {
  const token = req.query.token;
  console.log(`Received request for /resetPassword with token: ${token}`);
  res.render("resetPassword", { token });
});

router.post("/requestReset", passwordResetController.requestPasswordReset);

router.post("/resetPassword", passwordResetController.resetPassword);

module.exports = router;


