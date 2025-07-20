const express = require("express");
const {
  createAccount,
  transferFunds,
  getTransactions,
} = require("../controllers/accountController");

const router = express.Router();

router.post("/accounts", createAccount);
router.post("/accounts/transfer", transferFunds);
router.get("/accounts/:accountId/transactions", getTransactions);

module.exports = router;
