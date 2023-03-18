const pool = require('../server/server');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifyThereEmail } = require('../func/users');
const passwordToken = require('../constant/passwordPostgres');

const registerUser = async (req, res) => {
    const { nome: name, email, senha: password } = req.body;

    const verifyEmail = await verifyThereEmail(req, res);

    if (verifyEmail.rowCount !== 0) {
        return res.status(400).json({ 'message': 'Invalid email!!' });
    }

    try {

        const encrypedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(`INSERT INTO usuarios (nome, email, senha)
         values ($1, $2, $3) RETURNING *`, [name, email, encrypedPassword]);

        const { senha: _, ...user } = newUser.rows[0];

        return res.status(201).json(user);

    } catch (error) {

        return res.status(500).json(error.message);
    }
}

const makeLogin = async (req, res) => {
    const { senha: password } = req.body;

    const user = await verifyThereEmail(req, res);

    if (user.rowCount === 0) {
        return res.status(400).json({ 'message': 'Email/password invalid!' });
    }

    try {

        const validUser = user.rows[0]
        const validPassword = await bcrypt.compare(password, validUser.senha)

        if (!validPassword) {
            return res.status(400).json({ 'message': 'Email/password invalid!' })
        }

        const token = jwt.sign({ id: validUser.id }, passwordToken, {
            expiresIn: '8h'
        });

        const { senha: _, ...logUser } = validUser;

        return res.status(200).json({ usuario: logUser, token })

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const detailUser = async (req, res) => {
    const { senha: _, ...user } = req.user;

    return res.status(200).json(user);

}

const uptadeUser = async (req, res) => {
    const { nome: name, email, senha: password } = req.body;
    const { email: currentEmail } = req.user;

    try {

        if (email !== currentEmail) {
            const user = await verifyThereEmail(req, res);

            if (user.rowCount !== 0) {
                return res.status(400).json({ 'message': 'Invalid email!' });
            }
        }

        const encrypedPassword = await bcrypt.hash(password, 10);

        const idUser = req.user.id;

        await pool.query(`UPDATE usuarios
        SET nome=$1, email=$2, senha= $3 where id = $4`
            , [name, email, encrypedPassword, idUser]);

        return res.status(200).json();

    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }

}



module.exports = {
    registerUser,
    makeLogin,
    detailUser,
    uptadeUser
};