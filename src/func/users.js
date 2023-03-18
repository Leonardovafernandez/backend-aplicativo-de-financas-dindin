const pool = require('../server/server');

const verifyThereEmail = async (req, res) => {
    const { email } = req.body
    try {
        return await pool.query(`SELECT * FROM usuarios WHERE email = $1`, [email]);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

module.exports = {
    verifyThereEmail
}