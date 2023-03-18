const pool = require('../server/server');

const getUserTransaction = async (req, res, next) => {
    const { id } = req.params;
    const { id: idUser } = req.user;

    try {

        const userTransaction = await pool.query(`SELECT * FROM transacoes
        WHERE id = $1`, [id]);

        if (userTransaction.rowCount < 1) {
            return res.status(400).json({ 'message': 'transaction not found' });
        }

        const { rows } = userTransaction;

        if (rows[0].usuario_id !== idUser) {

            return res.status(400).json({ 'message': 'not authorized!' });
        }

        req.userTransaction = rows[0];

        next();

    } catch (error) {
        return res.status(500).json(error.message);
    }

}

const verifyTypeTransaction = async (req, res, next) => {
    const { tipo: type } = req.body;

    if (type.toLowerCase() !== 'entrada' && type.toLowerCase() !== 'saida') {
        return res.status(400).json({ 'message': 'There are just two types: entrada e saida' });
    }
    next();
}

module.exports = {
    getUserTransaction,
    verifyTypeTransaction
}