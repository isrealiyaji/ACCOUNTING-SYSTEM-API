const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const accountRoutes = require("./routes/accountRoutes");

const app = express();
app.use(bodyParser.json());

app.use("/api/users", userRoutes);
app.use("/api/accounts", accountRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
