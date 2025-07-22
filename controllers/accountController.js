const db = require("../config/db");

exports.createAccount = async (req, res) => {
  try {
    const { userId, accountName, accountNumber, accountType, balance } =
      req.body;
    const [result] = await db.query(
      `INSERT INTO accounts (user_id, account_name, account_number, account_type, balance)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, accountName, accountNumber, accountType, balance]
    );
    res
      .status(201)
      .json({ message: "Account created", accountId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.transferFunds = async (req, res) => {
  const { fromAccountNumber, toAccountNumber, amount } = req.body;

  try {
    const [[sender]] = await db.query(
      "SELECT * FROM accounts WHERE account_number = ?",
      [fromAccountNumber]
    );
    const [[receiver]] = await db.query(
      "SELECT * FROM accounts WHERE account_number = ?",
      [toAccountNumber]
    );

    if (!sender || !receiver)
      return res.status(404).json({ message: "One of the accounts not found" });
    if (sender.balance < amount)
      return res.status(400).json({ message: "Insufficient funds" });

    // Deduct from sender
    await db.query(
      "UPDATE accounts SET balance = balance - ? WHERE account_number = ?",
      [amount, fromAccountNumber]
    );
    await db.query(
      "INSERT INTO transactions (account_id, type, amount) VALUES (?, ?, ?)",
      [sender.id, "Transfer Out", amount]
    );

    // Add to receiver
    await db.query(
      "UPDATE accounts SET balance = balance + ? WHERE account_number = ?",
      [amount, toAccountNumber]
    );
    await db.query(
      "INSERT INTO transactions (account_id, type, amount) VALUES (?, ?, ?)",
      [receiver.id, "Transfer In", amount]
    );

    res.status(200).json({
      message: `Transferred ₦${amount} from ${fromAccountNumber} to ${toAccountNumber}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const [[account]] = await db.query(
      "SELECT * FROM accounts WHERE account_number = ?",
      [accountNumber]
    );
    if (!account) return res.status(404).json({ message: "Account not found" });

    const [transactions] = await db.query(
      "SELECT * FROM transactions WHERE account_id = ? ORDER BY date DESC",
      [account.id]
    );

    res.status(200).json({ transactions, balance: account.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
