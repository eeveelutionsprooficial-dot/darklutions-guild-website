const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const ANNOUNCEMENTS = [];
const ADMIN_PASSWORD = 'adminPassword'; // Change this in production
const SECRET_KEY = 'yourSecretKey'; // Change this in production

app.use(bodyParser.json());

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Public endpoint to get all announcements
app.get('/api/announcements', (req, res) => {
    res.json(ANNOUNCEMENTS);
});

// Admin endpoint to add an announcement
app.post('/api/announcements', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { announcement } = req.body;
    ANNOUNCEMENTS.push(announcement);
    res.status(201).send('Announcement added.');
});

// Admin endpoint for login
app.post('/api/login', async (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        const token = jwt.sign({ role: 'admin' }, SECRET_KEY);
        res.json({ token });
    } else {
        res.sendStatus(403);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
