const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// تسجيل الطلبات
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// المسارات
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.json({
        message: 'مرحباً بك في API Node.js + PostgreSQL',
        endpoints: {
            users: '/api/users',
            posts: '/api/posts'
        }
    });
});

// معالجة الأخطاء 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'المسار غير موجود'
    });
});

// تشغيل الخادم
app.listen(PORT, () => {
    console.log(`🚀 الخادم يعمل على: http://localhost:${PORT}`);
    console.log(`📌 مستخدمين: http://localhost:${PORT}/api/users`);
    console.log(`📌 منشورات: http://localhost:${PORT}/api/posts`);
});