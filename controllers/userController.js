const pool = require('../config/database');

// إنشاء مستخدم جديد (CREATE)
const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const query = `
            INSERT INTO users (username, email, password) 
            VALUES ($1, $2, $3) 
            RETURNING id, username, email, created_at
        `;

        const result = await pool.query(query, [username, email, password]);

        res.status(201).json({
            success: true,
            message: 'تم إنشاء المستخدم بنجاح',
            data: result.rows[0]
        });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({
                success: false,
                message: 'اسم المستخدم أو البريد مستخدم مسبقاً'
            });
        }
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم',
            error: error.message
        });
    }
};

// جلب جميع المستخدمين (READ ALL)
const getAllUsers = async (req, res) => {
    try {
        const query = 'SELECT id, username, email, created_at FROM users ORDER BY id DESC';
        const result = await pool.query(query);

        res.status(200).json({
            success: true,
            count: result.rowCount,
            data: result.rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم',
            error: error.message
        });
    }
};

// جلب مستخدم واحد بالمعرف (READ ONE)
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT id, username, email, created_at FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'المستخدم غير موجود'
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم',
            error: error.message
        });
    }
};

// تحديث مستخدم (UPDATE)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email } = req.body;

        const query = `
            UPDATE users 
            SET username = $1, email = $2 
            WHERE id = $3 
            RETURNING id, username, email, created_at
        `;

        const result = await pool.query(query, [username, email, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'المستخدم غير موجود'
            });
        }

        res.status(200).json({
            success: true,
            message: 'تم تحديث المستخدم بنجاح',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم',
            error: error.message
        });
    }
};

// حذف مستخدم (DELETE)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM users WHERE id = $1 RETURNING id, username';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'المستخدم غير موجود'
            });
        }

        res.status(200).json({
            success: true,
            message: 'تم حذف المستخدم بنجاح',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم',
            error: error.message
        });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};