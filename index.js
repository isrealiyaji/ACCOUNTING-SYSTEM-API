const db = require("./config/db");

class User {
  constructor(name) {
    this.name = name;
    this.id = null;
  }

  async save() {
    const [result] = await db.query("INSERT INTO users (name) VALUES (?)", [
      this.name,
    ]);
    this.id = result.insertId;
  }
}
// class Transaction {
//   constructor(type, amount) {
//     this.date = new Date();
//     this.type = type;
//     this.amount = amount;
//   }
//   print(acccountType) {
//     return `${this.toLocaleString()} | ${acccountType} | $${this.amount}`;
//   }
// }
class BankAccount {
  constructor(accountName, accountNumber, accountType, balance, userId) {
    this.accountName = accountName;
    this.accountNumber = accountNumber;
    this.accountType = accountType;
    this.balance = balance;
    this.userId = userId;
    this.id = null;
  }

  async save() {
    const [result] = await db.query(
      `INSERT INTO accounts (user_id, account_name, account_number, account_type, balance)
       VALUES (?, ?, ?, ?, ?)`,
      [
        this.userId,
        this.accountName,
        this.accountNumber,
        this.accountType,
        this.balance,
      ]
    );
    this.id = result.insertId;
  }

  async addTransaction(type, amount) {
    if (!this.id) throw new Error("Account does not exist yet.");

    await db.query(
      "INSERT INTO transactions (account_id, type, amount) VALUES (?, ?, ?)",
      [this.id, type, amount]
    );

    if (type === "Deposit") {
      this.balance += amount;
    } else if (type === "Withdrawal") {
      this.balance -= amount;
    }

    await db.query("UPDATE accounts SET balance = ? WHERE id = ?", [
      this.balance,
      this.id,
    ]);
  }

  async printTransactions() {
    const [rows] = await db.query(
      "SELECT * FROM transactions WHERE account_id = ?",
      [this.id]
    );

    console.log(`Transactions for Account ${this.accountNumber}:`);
    rows.forEach((transaction) => {
      console.log(
        `${transaction.date} | ${transaction.type} | $${transaction.amount}`
      );
    });
    console.log(`Balance: $${this.balance}`);
  }
}

(async () => {
  try {
    const user = new User("Jaji");
    await user.save();

    const account = new BankAccount(
      "Jaji",
      7035946086,
      "savings",
      1000,
      user.id
    );
    await account.save();

    await account.addTransaction("Deposit", 500);
    await account.addTransaction("withdrawal", 200);

    await account.printTransactions();
  } catch (error) {
    console.error("Error occurred", error.message);
  }
})();
