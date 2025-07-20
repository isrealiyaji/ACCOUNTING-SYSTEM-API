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

    res.status(201).json({ id: result.insertId, message: "Account created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.transferFunds = async (req, res) => {
  const { fromAccountId, toAccountId, amount } = req.body;

  try {
    const [[fromAccount]] = await db.query(
      "SELECT * FROM accounts WHERE id = ?",
      [fromAccountId]
    );
    const [[toAccount]] = await db.query(
      "SELECT * FROM accounts WHERE id = ?",
      [toAccountId]
    );

    if (!fromAccount || !toAccount) {
      return res.status(404).json({ error: "Account not found" });
    }

    if (fromAccount.balance < amount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }
    await db.query(
      "INSERT INTO transactions (account_id, type, amount) VALUES (?, ?, ?)",
      [fromAccountId, "Transfer Out", amount]
    );
    await db.query(
      "INSERT INTO transactions (account_id, type, amount) VALUES (?, ?, ?)",
      [toAccountId, "Transfer In", amount]
    );

    await db.query("UPDATE accounts SET balance = balance - ? WHERE id = ?", [
      amount,
      fromAccountId,
    ]);
    await db.query("UPDATE accounts SET balance = balance + ? WHERE id = ?", [
      amount,
      toAccountId,
    ]);

    res.status(200).json({ message: "Transfer successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  const { accountId } = req.params;

  try {
    const [transactions] = await db.query(
      "SELECT * FROM transactions WHERE account_id = ? ORDER BY date DESC",
      [accountId]
    );

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
