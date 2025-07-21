const express = require("express");
const router = express.Router();
const {
  createAccount,
  transferFunds,
  getTransactions,
} = require("../controllers/accountController");

router.post("/create", createAccount);
router.post("/transfer", transferFunds);
router.get("/transactions/:accountNumber", getTransactions);

module.exports = router;
