const db = require("../config/db");

exports.createUser = async (req, res) => {
  try {
    const { name } = req.body;
    const [result] = await db.query("INSERT INTO users (name) VALUES (?)", [
      name,
    ]);
    res.status(201).json({ message: "User created", userId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
