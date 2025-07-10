/*
const TaskStatus = {
  PENDING: "pending",
  IN_PROGRESS: "inprogress",
  COMPLETED: "completed",
};

class Task {
  constructor(title, description = "") {
    if (!title) {
      throw new Error("Title is required");
    }
    this.title = title;
    this.description = description;
    this.status = TaskStatus.PENDING;
  }

  setTaskStatus(newStatus) {
    const checkStatus = [
      TaskStatus.PENDING,
      TaskStatus.IN_PROGRESS,
      TaskStatus.COMPLETED,
    ];

    if (checkStatus.includes(newStatus)) {
      this.status = newStatus;
    } else {
      console.log(
        `The status is invalid: "${newStatus}". Use either pending, in progress or completed.`
      );
    }
  }

  getStatus() {
    return this.status;
  }
}

class TodoList {
  constructor() {
    this.tasks = [];
  }

  addTask(title, description = "") {
    if (!title) {
      console.log("Error: Title is required.");
      return;
    }
    const newTask = new Task(title, description);
    this.tasks.push(newTask);
    console.log(`Task added:"${title}" [Status: pending]`);
  }

  setTaskStatus(index, newStatus) {
    if (index >= 0 && index < this.tasks.length) {
      const task = this.tasks[index];
      task.setTaskStatus(newStatus);
      console.log(`Task "${task.title}" updated to [${task.getStatus()}]`);
    } else {
      console.log("Task is not valid.");
    }
  }

  showTasks() {
    if (this.tasks == 0) {
      console.log("Task not available.");
      return;
    }

    console.log("To-Do List:");
    this.tasks.forEach((task, index) => {
      console.log(
        `${index + 1}. ${task.title} - ${
          task.description
        } [${task.getStatus()}]`
      );
    });
  }
}

const todo = new TodoList();

todo.addTask("Buy bla bla bla", "Description");
todo.addTask("Learn nodejs", "Learn Nodejs with");

todo.showTasks();

todo.setTaskStatus(0, TaskStatus.IN_PROGRESS);
todo.setTaskStatus(1, TaskStatus.COMPLETED);

todo.showTasks;
*/
class Transaction {
  constructor(type, amount) {
    this.date = new Date();
    this.type = type;
    this.amount = amount;
  }
  print(acccountType) {
    return `${this.toLocaleString()} | ${acccountType} | $${this.amount}`;
  }
}
class BankAccount {
  constructor(accountName, accountNumber, accountType, initialDeposit) {
    if (
      typeof accountNumber != "number" ||
      accountNumber.toString().length !== 10 ||
      !Number.isInteger(accountNumber)
    ) {
      throw new Error(
        `Invalid account number "${accountNumber}". it must be 10 digits.`
      );
    }

    this.accountName = accountName;
    this.accountNumber = accountNumber;
    this.accountType = accountType;
    this.balance = initialDeposit;
    this.transactions = [];

    this.minimumDeposit = 10;
    this.minimumWithdrawal = 20;
    // this.minimumDeposit.
    // this.minimumwithdrawal.

    this.addTransaction("Account Opened", initialDeposit);
  }

  addTransaction(type, amount) {
    const transaction = new Transaction(type, amount);
    this.transactions.push(transaction);
  }

  deposit(amount) {
    if (amount <= this.minimumDeposit) {
      console.log(
        `Deposit failed: Deposit should be greater than {this.minimumDeposit}`
      );
    }
    this.balance += amount;
    this.addTransaction("Deposit", amount);
    console.log(`$${amount} deposited. New balance: $${this.balance}`);
  }

  withdraw(amount) {
    if (amount <= this.minimumWithdrawal) {
      console.log(
        `withdrawal failed: Withdrawal amount must be greater{this.minimumWithdrawal}`
      );
    }
    if (amount > this.balance) {
      console.log("Not enough balance.");
    }
    this.balance -= amount;
    this.addTransaction("withdrawal", amount);
    console.log(`$${amount} withdrawn. New balance: $${this.balance}`);
  }

  printTransactions() {
    console.log(`Transactions for ${this.accountNumber} | ${this.accountName}`);
    this.transactions.forEach((transaction) => {
      console.log(
        `${transaction.date.toLocaleString()} | ${this.accountType} | $${
          transaction.amount
        }`
      );
    });
    console.log(`Currernt Balance: $${this.balance}`);
  }
}

class User {
  constructor(name) {
    this.name = name;
    this.account = [];
  }

  addAccount(accountName, accountNumber, accountType, initialDeposit) {
    const account = new BankAccount(
      accountName,
      accountNumber,
      accountType,
      initialDeposit
    );
    this.account.push(account);
    console.log(
      `Added a ${accountType} account with account number ${accountNumber} for ${this.name}`
    );
  }
  getAccount(accountNumber) {
    return this.account.find(
      (account) => account.accountNumber === accountNumber
    );
  }
}

const user1 = new User("Jaji");

user1.addAccount("Jaji", 2283176438, "savings", 324500);
user1.addAccount("Jaji", 8165634041, "current", 432500);

const savings = user1.getAccount(2283176438);
savings.deposit(700000);
savings.withdraw(20000);
savings.printTransactions();

const current = user1.getAccount(8165634041);
current.withdraw(30000);
current.printTransactions();

//  How to make sure the account number doesn't take in < or > 11 digit
// add transaction history table or list
// add transaction cla
// The deposit should not be less than 20
