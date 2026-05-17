const pool = require('../config/database');

// إنشاء منشور جديد (CREATE)
const createPost = async (req, res) => {
    try {
        const { title, content, user_id } = req.body;

        // التحقق من وجود المستخدم
        const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [user_id]);
        if (userCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'المستخدم غير موجود'
            });
        }

        const query = `
            INSERT INTO posts (title, content, user_id) 
            VALUES ($1, $2, $3) 
            RETURNING *
        `;

        const result = await pool.query(query, [title, content, user_id]);

        res.status(201).json({
            success: true,
            message: 'تم إنشاء المنشور بنجاح',
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

// جلب جميع المنشورات مع بيانات المستخدم (READ ALL with JOIN)
const getAllPosts = async (req, res) => {
    try {
        const query = `
            SELECT 
                p.id,
                p.title,
                p.content,
                p.created_at,
                p.updated_at,
                u.id as user_id,
                u.username,
                u.email
            FROM posts p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
        `;

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

// جلب منشور واحد بالمعرف (READ ONE)
const getPostById = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT 
                p.*,
                u.username,
                u.email
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.id = $1
        `;

        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'المنشور غير موجود'
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

// جلب منشورات مستخدم معين
const getPostsByUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        const query = 'SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC';
        const result = await pool.query(query, [user_id]);

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

// تحديث منشور (UPDATE)
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const query = `
            UPDATE posts 
            SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP
            WHERE id = $3 
            RETURNING *
        `;

        const result = await pool.query(query, [title, content, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'المنشور غير موجود'
            });
        }

        res.status(200).json({
            success: true,
            message: 'تم تحديث المنشور بنجاح',
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

// حذف منشور (DELETE)
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM posts WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'المنشور غير موجود'
            });
        }

        res.status(200).json({
            success: true,
            message: 'تم حذف المنشور بنجاح',
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
    createPost,
    getAllPosts,
    getPostById,
    getPostsByUser,
    updatePost,
    deletePost
};