const mysql = require("mysql2");
require("dotenv").config;

const env = (key, defaultValue = null) => {
  console.log(process.env[key]);
  return process.env[key] || defaultValue;
};

const pool = mysql.createPool({
  host: env.DB_HOST || "localhost",
  user: env.DB_USER || "root",
  password: env.DB_PASSWORD || "",
  database: env.DB_NAME || "Bank_app",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("pool", pool);

module.exports = pool.promise();
