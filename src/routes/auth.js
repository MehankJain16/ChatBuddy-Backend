const express = require("express");
const {
  getAllUsers,
  loginUser,
  registerUser,
  logoutUser,
} = require("../controllers/auth");
const router = express.Router();

router.get("/users/:mobile_number", getAllUsers);

router.post("/login", loginUser);

router.post("/register", registerUser);

router.post("/logout", logoutUser);

module.exports = router;
