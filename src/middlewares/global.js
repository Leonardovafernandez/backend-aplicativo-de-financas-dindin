const jwt = require('jsonwebtoken');
const pool = require('../server/server');
const passwordToken = require('../constant/passwordPostgres');

const authorizeUser = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ 'message': 'not authorized' });
    }

    const token = authorization.split(' ')[1];

    try {

        const { id } = jwt.verify(token, passwordToken);

        const { rows, rowCount } = await pool.query(`SELECT * FROM usuarios 
        WHERE id = $1`, [id])

        if (rowCount < 1) {
            return res.status(401).json({ 'message': 'not authorized' });
        }

        req.user = rows[0];

        next();

    } catch (error) {
        return res.status(401).json({ 'message': 'not authorized' });
    }

}

const validateNameEmailPasswordInBody = async (req, res, next) => {
    const { nome: name, email, senha: password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ 'message': 'Fill all the inputs!' });
    }

    next();
};

const validateEmailPasswordInBody = async (req, res, next) => {
    const { email, senha: password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 'message': 'Fill all the inputs!' });
    }

    next();
};

const validateDescriptionValueDateCategorieTypeInBody = async (req, res, next) => {
    const { descricao: description, valor: value,
        data: date, categoria_id: id_categorie, tipo: type } = req.body;

    if (!description || !value || !date || !id_categorie || !type) {
        return res.status(400).json({ 'message': 'Fill all the inputs!' });
    }

    next();
}

module.exports = {
    authorizeUser,
    validateNameEmailPasswordInBody,
    validateEmailPasswordInBody,
    validateDescriptionValueDateCategorieTypeInBody
}