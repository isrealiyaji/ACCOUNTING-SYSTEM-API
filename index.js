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

  async transferTo(targetAccount, amount) {
    if (!(targetAccount instanceof BankAccount)) {
      throw new Error("Invalid target account.");
    }

    if (amount <= 0) {
      throw new Error("Transfer amount must be greater than zero.");
    }

    if (amount > this.balance) {
      throw new Error("Insufficient funds for transfer.");
    }

    await this.addTransaction("Transfer Out", amount);

    await targetAccount.addTransaction("Transfer In", amount);

    console.log(
      `Transferred $${amount} from ${this.accountNumber} to ${targetAccount.accountNumber}`
    );
  }

  async printTransactions() {
    const [rows] = await db.query(
      "SELECT * FROM transactions WHERE account_id = ? ORDER BY date DESC",
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

    const account1 = new BankAccount(
      "Jajy",
      7035946041,
      "savings",
      1000,
      user.id
    );
    const account2 = new BankAccount(
      "Jah",
      8065274355,
      "current",
      1000000,
      user.id
    );

    await account1.save();
    await account2.save();

    await account1.transferTo(account2, 500);

    await account1.printTransactions();
    await account2.printTransactions();
  } catch (error) {
    console.error("Error occurred", error.message);
  }
})();
