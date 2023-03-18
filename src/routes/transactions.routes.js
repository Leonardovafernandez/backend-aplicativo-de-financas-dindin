const express = require('express');
const { getTransactions, getTransaction, registerTransaction, updateTransaction, deleteTransaction, getBankStatement } = require('../controllers/transactions');
const { authorizeUser } = require('../middlewares/global');
const { getUserTransaction, verifyTypeTransaction, getCategorie, getUserTransactions } = require('../middlewares/transactions');
const { validateDescriptionValueDateCategorieTypeInBody } = require('../middlewares/global');

const transactionsRoutes = express();

transactionsRoutes.use(authorizeUser);

transactionsRoutes.get('/transacao', getTransactions);
transactionsRoutes.get('/transacao/extrato', getBankStatement);
transactionsRoutes.get('/transacao/:id', getUserTransaction, getTransaction);
transactionsRoutes.post('/transacao', validateDescriptionValueDateCategorieTypeInBody, verifyTypeTransaction, registerTransaction);
transactionsRoutes.put('/transacao/:id', verifyTypeTransaction, getUserTransaction, validateDescriptionValueDateCategorieTypeInBody, updateTransaction);
transactionsRoutes.delete('/transacao/:id', getUserTransaction, deleteTransaction);


module.exports = transactionsRoutes;



