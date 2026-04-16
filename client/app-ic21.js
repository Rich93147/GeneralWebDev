const express = require('express');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const app = express();

app.use(express.static('public'));
app.use(express.json());

const databasePath = path.join(process.env.TEMP, 'ic21-voyage.db');
const rawDb = new DatabaseSync(databasePath);
console.log(`Connected to the SQLite database at ${databasePath}.`);

rawDb.exec(`
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        classification TEXT NOT NULL,
        major TEXT NOT NULL
    )
`);

const studentCount = rawDb.prepare('SELECT COUNT(*) AS count FROM students').get().count;

if (studentCount === 0) {
    const insertStudent = rawDb.prepare(`
        INSERT INTO students (first_name, last_name, classification, major)
        VALUES (?, ?, ?, ?)
    `);

    const starterStudents = [
        ['Avery', 'Nguyen', 'Senior', 'Computer Science'],
        ['Jordan', 'Patel', 'Junior', 'Cybersecurity'],
        ['Mia', 'Gonzalez', 'Sophomore', 'Information Systems']
    ];

    starterStudents.forEach((student) => insertStudent.run(...student));
    console.log('Seeded voyage.db with starter student records.');
}

const db = {
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
    }
};

const ic21Router = require('./routes/ic21-routes')(db);
app.use('/api/ic21', ic21Router);

app.get('/', (req, res) => {
    res.send('Greetings, Earth!');
    console.log('Root route accessed');
});

app.listen(3001, () => {
    console.log('App listening at http://localhost:3001');
});
