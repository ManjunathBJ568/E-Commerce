const pool = require("../config/db");

const createUser = async (name, email, password) => {
    const [result] = await pool.query(
        `INSERT INTO users (name, email, password)
         VALUES (?, ?, ?)`,
        [name, email, password]
    );

    return result;
};

const findUserByEmail = async (email) => {
    const [rows] = await pool.query(
        `SELECT * FROM users WHERE email = ?`,
        [email]
    );

    return rows[0];
};

module.exports = {
    createUser,
    findUserByEmail
};