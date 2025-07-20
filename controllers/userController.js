const db = require("../config/db");

exports.createUser = async (req, res) => {
  try {
    const { name } = req.body;
    const [result] = await db.query("INSERT INTO users (name) VALUES (?)", [
      name,
    ]);
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
