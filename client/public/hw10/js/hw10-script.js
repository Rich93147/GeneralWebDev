// ============================================
// HW10 Monster Arena — Client-Side JavaScript
// COSC 2328 Web Development
// Professor McCurry
//
// YOUR NAME:
// YOUR SECTION:
//
// This file handles all DOM updates and fetch
// calls. The server only sends/receives JSON —
// this script is responsible for rendering HTML.
// ============================================


// ──────────────────────────────────────────────
// fetchMonsters()  (Part 4, Step 6)
// ──────────────────────────────────────────────
// This is a NAMED function — you will call it:
//   1. On page load (to populate the roster)
//   2. After a successful POST (recruit)
//   3. After a successful DELETE (retire)
//
// Steps:
//   - fetch GET /api/hw10/monsters
//   - Parse the JSON response
//   - Clear the roster container (innerHTML = '')
//   - Loop through the array and create a
//     .monster-card div for each monster
//   - Append each card to the roster
//   - Add a .catch() for network errors
// ──────────────────────────────────────────────

// TODO: Write fetchMonsters() and call it
function fetchMonsters() {
    fetch('/api/hw10/monsters')
        .then(response => response.json())
        .then(monsters => {
            const roster = document.getElementById('roster');
            roster.innerHTML = '';

            if (monsters.length === 0) {
                roster.innerHTML = '<p>No monsters recruited yet.</p>';
                return;
            }

            monsters.forEach(m => {
                const card = document.createElement('div');
                card.classList.add('monster-card');
                card.innerHTML = `
                    <h3>${m.name}</h3>
                    <p>Species: ${m.species} | ATK: ${m.attack} | DEF: ${m.defense} | HP: ${m.hp}</p>
                    <p class="monster-id">ID: ${m.id}</p>`;
                roster.appendChild(card);
            });
        })
        .catch(err => {
            document.getElementById('status').textContent = 'Error loading monsters.';
        });
}

fetchMonsters();



// ──────────────────────────────────────────────
// Recruit Form Handler  (Part 5, Step 7)
// ──────────────────────────────────────────────
// Attach a 'submit' event listener to the
// recruit form. Inside the handler:
//
//   1. event.preventDefault()  ← CRITICAL
//   2. new FormData(event.target)
//   3. Object.fromEntries(formData)
//   4. JSON.stringify(data)
//   5. fetch POST /api/hw10/monsters with JSON
//   6. Display the server's message in #status
//   7. Call fetchMonsters() to refresh the roster
//   8. event.target.reset() to clear the form
//   9. .catch() for network errors
// ──────────────────────────────────────────────

// TODO: Add recruit form submit listener
document.getElementById('recruit-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    const jsonData = JSON.stringify(data);

    fetch('/api/hw10/monsters', {
        method: 'POST',
        body: jsonData,
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(result => {
            document.getElementById('status').textContent = result.message || result.error;
            fetchMonsters();
            event.target.reset();
        })
        .catch(err => {
            document.getElementById('status').textContent = 'Network error.';
        });
});



// ──────────────────────────────────────────────
// Retire Button Handler  (Part 6, Step 8)
// ──────────────────────────────────────────────
// Attach a 'click' event listener to #retire-btn.
// Inside the handler:
//
//   1. Read the value from #retire-id
//   2. fetch DELETE /api/hw10/monsters/ + id
//   3. Check response.ok before re-fetching
//   4. Display success or error message in #status
//   5. Only call fetchMonsters() if response.ok
//   6. .catch() for network errors
// ──────────────────────────────────────────────

// TODO: Add retire button click listener
document.getElementById('retire-btn').addEventListener('click', () => {
    const id = document.getElementById('retire-id').value;

    if (!id) {
        document.getElementById('status').textContent = 'Please enter a Monster ID to retire.';
        return;
    }

    fetch('/api/hw10/monsters/' + id, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => {
            const ok = response.ok;
            return response.json().then(data => ({ ok, data }));
        })
        .then(({ ok, data }) => {
            document.getElementById('status').textContent = data.message || data.error;
            if (ok) fetchMonsters();
        })
        .catch(err => {
            document.getElementById('status').textContent = 'Network error.';
        });
});



// ──────────────────────────────────────────────
// Battle Button Handler  (Part 7, Step 9)
// ──────────────────────────────────────────────
// Attach a 'click' event listener to #battle-btn.
// This does NOT need a new server route — it
// reuses GET /api/hw10/monsters and does all
// comparison logic here in the browser.
//
//   1. fetch GET /api/hw10/monsters
//   2. If fewer than 2 monsters, show message
//   3. Pick two DISTINCT random monsters
//   4. Calculate scores (attack + defense + hp)
//   5. Determine winner (or draw)
//   6. Display both fighters and winner in
//      #battle-results using innerHTML
//   7. .catch() for network errors
// ──────────────────────────────────────────────

// TODO: Add battle button click listener
document.getElementById('battle-btn').addEventListener('click', () => {
    fetch('/api/hw10/monsters')
        .then(response => response.json())
        .then(monsters => {
            const results = document.getElementById('battle-results');

            if (monsters.length < 2) {
                results.innerHTML = '<p>Not enough monsters to battle!</p>';
                return;
            }

            let i = Math.floor(Math.random() * monsters.length);
            let j;
            do {
                j = Math.floor(Math.random() * monsters.length);
            } while (j === i);

            const a = monsters[i];
            const b = monsters[j];

            const scoreA = a.attack + a.defense + a.hp;
            const scoreB = b.attack + b.defense + b.hp;

            let winner = 'Draw!';
            if (scoreA > scoreB) winner = a.name + ' wins!';
            else if (scoreB > scoreA) winner = b.name + ' wins!';

            results.innerHTML = `
                <div class="fighter">
                    <h3>${a.name}</h3>
                    <p>${a.species} | ATK: ${a.attack} | DEF: ${a.defense} | HP: ${a.hp} | Score: ${scoreA}</p>
                </div>
                <div class="vs">VS</div>
                <div class="fighter">
                    <h3>${b.name}</h3>
                    <p>${b.species} | ATK: ${b.attack} | DEF: ${b.defense} | HP: ${b.hp} | Score: ${scoreB}</p>
                </div>
                <h3 class="winner">${winner}</h3>`;
        })
        .catch(err => {
            document.getElementById('status').textContent = 'Error loading battle.';
        });
});
