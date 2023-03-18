const express = require('express');
const { getCategories } = require('../controllers/categories');
const { authorizeUser } = require('../middlewares/global');

const categoriesRoutes = express();

categoriesRoutes.use(authorizeUser);

categoriesRoutes.get('/categoria', getCategories);


module.exports = categoriesRoutes;

