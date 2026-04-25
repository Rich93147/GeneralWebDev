const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.get('/monsters', (req, res) => {
        db.all('SELECT * FROM monsters ORDER BY id', [], (err, rows) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            res.json(rows);
        });
    });

    router.get('/monsters/:id', (req, res) => {
        db.get('SELECT * FROM monsters WHERE id = ?', [req.params.id], (err, row) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            if (!row) {
                return res.status(404).json({ message: 'Monster not found' });
            }

            res.json(row);
        });
    });

    router.post('/monsters', (req, res) => {
        const name = String(req.body.name || '').trim();
        const species = String(req.body.species || '').trim();
        const attack = parseInt(req.body.attack, 10);
        const defense = parseInt(req.body.defense, 10);
        const hp = parseInt(req.body.hp, 10);

        if (!name || !species) {
            return res.status(400).json({ message: 'Name and species are required.' });
        }

        if (Number.isNaN(attack) || Number.isNaN(defense) || Number.isNaN(hp) || attack < 0 || defense < 0 || hp < 0) {
            return res.status(400).json({ message: 'Attack, defense, and HP must be whole numbers greater than or equal to 0.' });
        }

        db.run(
            'INSERT INTO monsters (name, species, attack, defense, hp) VALUES (?, ?, ?, ?, ?)',
            [name, species, attack, defense, hp],
            function insertMonster(insertErr) {
                if (insertErr) {
                    return res.status(500).json({ message: insertErr.message });
                }

                res.status(201).json({
                    message: 'Monster recruited successfully.',
                    monster: {
                        id: this.lastID,
                        name: name,
                        species: species,
                        attack: attack,
                        defense: defense,
                        hp: hp
                    }
                });
            }
        );
    });

    router.post('/retire', (req, res) => {
        const id = req.body.id;

        db.run('DELETE FROM monsters WHERE id = ?', [id], function deleteMonster(err) {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({ message: 'Monster not found' });
            }

            res.json({ message: 'Monster retired successfully.' });
        });
    });

    router.post('/battle', (req, res) => {
        db.all('SELECT * FROM monsters ORDER BY id', [], (err, rows) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            if (rows.length < 2) {
                return res.status(400).json({ message: 'At least two monsters are required to battle.' });
            }

            const fighterAIndex = Math.floor(Math.random() * rows.length);
            let fighterBIndex = Math.floor(Math.random() * rows.length);

            while (fighterBIndex === fighterAIndex) {
                fighterBIndex = Math.floor(Math.random() * rows.length);
            }

            const fighterA = rows[fighterAIndex];
            const fighterB = rows[fighterBIndex];
            const scoreA = fighterA.attack + fighterA.defense + fighterA.hp;
            const scoreB = fighterB.attack + fighterB.defense + fighterB.hp;

            let winner = 'Draw';
            if (scoreA > scoreB) {
                winner = fighterA.name;
            } else if (scoreB > scoreA) {
                winner = fighterB.name;
            }

            res.json({
                fighterA,
                fighterB,
                scoreA,
                scoreB,
                winner
            });
        });
    });

    return router;
};
