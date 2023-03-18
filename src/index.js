const express = require("express");
const categoriesRoutes = require("./routes/categories.routes");
const transactionsRoutes = require("./routes/transactions.routes");
const usersRoutes = require('./routes/users.routes');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());
app.use(usersRoutes);
app.use(transactionsRoutes);
app.use(categoriesRoutes);

app.listen(3001);