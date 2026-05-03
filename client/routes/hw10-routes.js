// ============================================
// HW10 Monster Arena — JSON API Routes
// COSC 2328 Web Development
// Professor McCurry
//
// YOUR NAME:
// YOUR SECTION:
//
// These routes return JSON (res.json), never HTML.
// The client-side JavaScript handles all rendering.
// ============================================

const express = require('express');
const router = express.Router();

module.exports = (db) => {

    // ──────────────────────────────────────────
    // GET /monsters — Return All Monsters
    // (Part 2, Step 4 — Route 1)
    // ──────────────────────────────────────────
    // Use db.all to SELECT * FROM monsters.
    // On success: res.json(rows)
    // On error:   res.status(500).json({ error: err.message })
    // ──────────────────────────────────────────

    // TODO: router.get('/monsters', ...)
    router.get('/monsters', (req, res) => {
        db.all('SELECT * FROM monsters', [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    });


    // ──────────────────────────────────────────
    // POST /monsters — Recruit a Monster
    // (Part 2, Step 4 — Route 2)
    // ──────────────────────────────────────────
    // Destructure name, species, attack, defense,
    // hp from req.body.
    // INSERT with db.run and ? placeholders.
    // On success: res.json({ message: 'Monster recruited!' })
    // On error:   res.status(400).json({ error: err.message })
    //
    // NOTE: No redirect! The client handles the
    // UI update by calling fetchMonsters().
    // ──────────────────────────────────────────

    // TODO: router.post('/monsters', ...)
    router.post('/monsters', (req, res) => {
        const { name, species, attack, defense, hp } = req.body;
        const sql = 'INSERT INTO monsters (name, species, attack, defense, hp) VALUES (?, ?, ?, ?, ?)';
        db.run(sql, [name, species, attack, defense, hp], function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: 'Monster recruited!' });
        });
    });


    // ──────────────────────────────────────────
    // DELETE /monsters/:id — Retire a Monster
    // (Part 2, Step 4 — Route 3)
    // ──────────────────────────────────────────
    // Read id from req.params.id (not req.body).
    // DELETE with db.run and ? placeholder.
    // Check this.changes — use function(), NOT
    // an arrow function.
    // If this.changes === 0:
    //     res.status(404).json({ error: 'Monster not found.' })
    // Otherwise:
    //     res.json({ message: 'Monster retired!' })
    // ──────────────────────────────────────────

    // TODO: router.delete('/monsters/:id', ...)
    router.delete('/monsters/:id', (req, res) => {
        const { id } = req.params;
        db.run('DELETE FROM monsters WHERE id = ?', [id], function (err) {
            if (err) return res.status(400).json({ error: err.message });
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Monster not found.' });
            }
            res.json({ message: 'Monster retired!' });
        });
    });


    return router;
};
