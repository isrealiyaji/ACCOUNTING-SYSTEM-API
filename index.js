const express = require("express");
const userRoutes = require("./routes/userRoutes.js");
const accountRoutes = require("./routes/accountRoutes");

const app = express();
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", accountRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Bank app API running on http://localhost:${PORT}`);
});
