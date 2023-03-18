const express = require('express');
const { registerUser, makeLogin, detailUser, uptadeUser } = require('../controllers/users');
const { authorizeUser } = require('../middlewares/global');
const { validateNameEmailPasswordInBody, validateEmailPasswordInBody } = require('../middlewares/global');

const usersRoutes = express();

usersRoutes.post('/usuario', validateNameEmailPasswordInBody, registerUser);
usersRoutes.post('/login', validateEmailPasswordInBody, makeLogin);

usersRoutes.use(authorizeUser);

usersRoutes.get('/usuario', detailUser);
usersRoutes.put('/usuario', validateNameEmailPasswordInBody, uptadeUser);

module.exports = usersRoutes;

