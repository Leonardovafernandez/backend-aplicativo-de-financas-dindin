const pool = require('../server/server');


const getTransactions = async (req, res) => {
    const { id: idUser } = req.user;
    const { filtro } = req.query;

    try {

        const userTransactions = await pool.query(`SELECT transacoes.*, categorias.descricao as categoria_nome
        FROM transacoes JOIN categorias 
        ON transacoes.categoria_id = categorias.id WHERE transacoes.usuario_id = $1`,
            [idUser]);

        let showUserTransactions = userTransactions.rows;

        if (filtro && filtro.length !== 0 && filtro[0] !== '') {
            showUserTransactions = [];
            userTransactions.rows.map((transaction) => {

                if (filtro.some(categorie => categorie === transaction.categoria_nome)) {
                    showUserTransactions.push(transaction)
                };
            })
        }

        return res.status(200).json(showUserTransactions);
    } catch (error) {
        return res.status(500).json(error.message);
    }

}

const getTransaction = async (req, res) => {
    const userTransaction = req.userTransaction
    try {

        const categoryName = await pool.query(`SELECT categorias.descricao as categoria_nome
        FROM transacoes JOIN categorias 
        ON transacoes.categoria_id = categorias.id WHERE transacoes.id = $1`,
            [userTransaction.id]);

        const answer = {
            ...userTransaction,
            ...categoryName.rows[0]
        }

        return res.status(200).json(answer);

    } catch (error) {
        return res.status(500).json(error.message);
    }

}

const registerTransaction = async (req, res) => {
    const { descricao: description, valor: value,
        data: date, categoria_id: id_categorie, tipo: type } = req.body;
    const { id: idUser } = req.user;

    try {

        const arrayValues = [description, value, date, id_categorie, type.toLowerCase(), idUser]

        const registeredTransaction = await pool.query(`INSERT INTO transacoes 
            (descricao, valor, data, categoria_id, tipo, usuario_id)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, arrayValues);

        const categoryName = await pool.query(`SELECT categorias.descricao as categoria_nome
        FROM transacoes JOIN categorias 
        ON transacoes.categoria_id = categorias.id WHERE transacoes.id = $1`,
            [registeredTransaction.rows[0].id]);

        const answer = {
            ...registeredTransaction.rows[0],
            ...categoryName.rows[0]
        }

        return res.status(200).json(answer);

    } catch (error) {
        return res.status(500).json(error.message);
    }

}

const updateTransaction = async (req, res) => {
    const { descricao: description, valor: value,
        data: date, categoria_id: id_categorie, tipo: type } = req.body;

    try {

        const { id } = req.userTransaction;

        const values = [description, value, date, id_categorie, type, id];

        await pool.query(`UPDATE transacoes 
            SET descricao = $1, valor = $2, data = $3, 
            categoria_id = $4, tipo = $5 WHERE id = $6`, values);

        return res.status(200).json();

    } catch (error) {
        return res.status(500).json(error.message);
    }

}

const deleteTransaction = async (req, res) => {
    const { id } = req.params;

    try {

        await pool.query(`DELETE FROM transacoes where id = $1`, [id]);

        return res.status(200).json();

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const getBankStatement = async (req, res) => {
    const { id: idUser } = req.user;

    try {
        let incomin = 0;
        let output = 0;

        const userTransactions = await pool.query(`SELECT * FROM transacoes
        WHERE usuario_id = $1`, [idUser]);

        userTransactions.rows.map((transaction) => {

            if (transaction.tipo === 'entrada') {
                incomin += transaction.valor;
            }

            if (transaction.tipo === 'saida') {
                output += transaction.valor;
            }
        })

        return res.status(200).json({ 'entrada': incomin, 'saida': output });

    } catch (error) {
        return res.status(500).json(error.message);
    }

}

module.exports = {
    getTransactions,
    getTransaction,
    registerTransaction,
    updateTransaction,
    deleteTransaction,
    getBankStatement
}