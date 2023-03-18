const pool = require('../server/server');

const getCategories = async (req, res) => {

    try {

        const categories = await pool.query(`SELECT * FROM categorias`);

        return res.status(200).json(categories.rows);

    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }

}

module.exports = {
    getCategories
}