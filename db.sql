
-- DB : crud_nodejs / PostgreSQL
-- جدول المستخدمين
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول المنشورات (مرتبط بجدول users)
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إدراج مستخدمين تجريبيين
INSERT INTO users (username, email, password) VALUES 
('ahmed', 'ahmed@email.com', '123456'),
('sara', 'sara@email.com', '123456');

-- إدراج منشورات تجريبية
INSERT INTO posts (title, content, user_id) VALUES 
('أول منشور', 'محتوى المنشور الأول', 1),
('منشور ثاني', 'محتوى آخر هنا', 2);