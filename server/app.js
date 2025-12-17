const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables
const db = require('./db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
// Serve static files from root
app.use(express.static(path.join(__dirname, '../'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// Routes

// Register
app.post('/api/register', async (req, res) => {
    const { username, password, name } = req.body;

    if (!username || !password || !name) {
        return res.status(400).json({ success: false, message: '請填寫所有欄位' });
    }

    try {
        // Check if user exists
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length > 0) {
            return res.json({ success: false, message: '用戶名已存在' });
        }

        // Default role is customer unless specified (and potentially authorized, but keeping simple for now)
        // In a real app, only admins should be able to set role='admin'
        const role = req.body.role || 'customer';

        // Insert new user
        await db.execute('INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)', [username, password, name, role]);
        res.json({ success: true, message: '註冊成功' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '服務器錯誤' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: '請填寫所有欄位' });
    }

    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
        
        if (rows.length > 0) {
            const user = rows[0];
            // Don't send password back
            delete user.password;
            res.json({ success: true, message: '登入成功', user: user });
        } else {
            res.json({ success: false, message: '用戶名或密碼錯誤' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '服務器錯誤' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

