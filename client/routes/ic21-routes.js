const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.get('/students', (req, res) => {
        db.all('SELECT * FROM students ORDER BY id', [], (err, rows) => {
            if (err) {
                return res.status(500).send(err.message);
            }

            res.json(rows);
        });
    });

    router.get('/students/:id', (req, res) => {
        const id = req.params.id;
        db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
            if (err) {
                return res.send(err.message);
            }

            if (!row) {
                return res.status(404).json({ message: 'Student not found' });
            }

            res.json(row);
        });
    });

    return router;
};
