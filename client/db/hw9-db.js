const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const databasePath = path.join(process.env.TEMP || __dirname, 'hw9-monsters.db');
const rawDb = new DatabaseSync(databasePath);

rawDb.exec(`
    CREATE TABLE IF NOT EXISTS monsters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        species TEXT NOT NULL,
        attack INTEGER NOT NULL,
        defense INTEGER NOT NULL,
        hp INTEGER NOT NULL
    )
`);

const monsterCount = rawDb.prepare('SELECT COUNT(*) AS count FROM monsters').get().count;

if (monsterCount === 0) {
    const insertMonster = rawDb.prepare(`
        INSERT INTO monsters (name, species, attack, defense, hp)
        VALUES (?, ?, ?, ?, ?)
    `);

    const starterMonsters = [
        ['Embermaw', 'Dragon', 18, 11, 25],
        ['Mossback', 'Golem', 10, 18, 30],
        ['Voltshade', 'Wraith', 16, 9, 20]
    ];

    starterMonsters.forEach((monster) => insertMonster.run(...monster));
}

module.exports = {
    all(sql, params, callback) {
        try {
            const rows = rawDb.prepare(sql).all(...params);
            callback(null, rows);
        } catch (err) {
            callback(err);
        }
    },
    get(sql, params, callback) {
        try {
            const row = rawDb.prepare(sql).get(...params);
            callback(null, row);
        } catch (err) {
            callback(err);
        }
    },
    run(sql, params, callback) {
        try {
            const result = rawDb.prepare(sql).run(...params);
            callback.call(
                {
                    lastID: Number(result.lastInsertRowid || 0),
                    changes: Number(result.changes || 0)
                },
                null
            );
        } catch (err) {
            callback(err);
        }
    }
};