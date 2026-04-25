const apiBase = '/api/hw9';

const roster = document.getElementById('roster');
const lookupButton = document.getElementById('lookup-btn');
const lookupInput = document.getElementById('monster-id-input');
const recruitForm = document.getElementById('recruit-form');
const retireForm = document.getElementById('retire-form');
const battleForm = document.getElementById('battle-form');
const detailCard = document.getElementById('monster-detail');
const notFoundMessage = document.getElementById('monster-not-found');
const battleResults = document.getElementById('battle-results');
const statusMessage = document.getElementById('status-message');
const retireInput = document.getElementById('retire-id-input');

function showStatus(message, tone) {
    if (!tone) {
        tone = 'success';
    }

    statusMessage.textContent = message;
    statusMessage.className = `status ${tone}`;
    statusMessage.hidden = false;
}

function hideStatus() {
    statusMessage.hidden = true;
}

function renderRoster(monsters) {
    roster.innerHTML = '';

    if (monsters.length === 0) {
        roster.innerHTML = '<p class="empty-state">No monsters recruited yet.</p>';
        return;
    }

    monsters.forEach(monster => {
        const card = document.createElement('article');
        card.className = 'monster-card';
        card.innerHTML = `
            <h3>${monster.name}</h3>
            <p><strong>Species:</strong> ${monster.species}</p>
            <p><strong>Attack:</strong> ${monster.attack}</p>
            <p><strong>Defense:</strong> ${monster.defense}</p>
            <p><strong>HP:</strong> ${monster.hp}</p>
            <p class="monster-id">ID: ${monster.id}</p>
        `;
        roster.appendChild(card);
    });
}

function renderMonsterDetail(monster) {
    document.getElementById('detail-id').textContent = monster.id;
    document.getElementById('detail-name').textContent = monster.name;
    document.getElementById('detail-species').textContent = monster.species;
    document.getElementById('detail-attack').textContent = monster.attack;
    document.getElementById('detail-defense').textContent = monster.defense;
    document.getElementById('detail-hp').textContent = monster.hp;
    notFoundMessage.classList.add('hidden');
    detailCard.classList.remove('hidden');
}

function hideMonsterDetail() {
    detailCard.classList.add('hidden');
    notFoundMessage.classList.add('hidden');
}

function renderBattleResults(battle) {
    let winnerText = 'Draw';

    if (battle.winner !== 'Draw') {
        winnerText = `${battle.winner} wins`;
    }

    battleResults.innerHTML = `
        <div class="fighter">
            <h3>${battle.fighterA.name}</h3>
            <p>${battle.fighterA.species}</p>
            <p>ATK: ${battle.fighterA.attack} | DEF: ${battle.fighterA.defense} | HP: ${battle.fighterA.hp}</p>
            <p>Score: ${battle.scoreA}</p>
        </div>
        <div class="vs">VS</div>
        <div class="fighter">
            <h3>${battle.fighterB.name}</h3>
            <p>${battle.fighterB.species}</p>
            <p>ATK: ${battle.fighterB.attack} | DEF: ${battle.fighterB.defense} | HP: ${battle.fighterB.hp}</p>
            <p>Score: ${battle.scoreB}</p>
        </div>
        <h3 class="winner">${winnerText}</h3>
    `;
}

function loadMonsters() {
    fetch(`${apiBase}/monsters`)
        .then(response => response.json())
        .then(monsters => {
            renderRoster(monsters);
        })
        .catch(error => {
            showStatus(error.message, 'error');
        });
}

function lookupMonster() {
    const id = lookupInput.value.trim();

    if (!id) {
        showStatus('Enter a monster ID to look it up.', 'error');
        hideMonsterDetail();
        return;
    }

    hideStatus();

    fetch(`${apiBase}/monsters/${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Monster not found') {
                detailCard.classList.add('hidden');
                notFoundMessage.textContent = data.message;
                notFoundMessage.classList.remove('hidden');
                showStatus(data.message, 'error');
            } else {
                renderMonsterDetail(data);
            }
        })
        .catch(error => {
            detailCard.classList.add('hidden');
            notFoundMessage.textContent = error.message;
            notFoundMessage.classList.remove('hidden');
            showStatus(error.message, 'error');
        });
}

lookupButton.addEventListener('click', lookupMonster);
lookupInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        event.preventDefault();
        lookupMonster();
    }
});

recruitForm.addEventListener('submit', event => {
    event.preventDefault();

    const payload = {
        name: recruitForm.elements.name.value,
        species: recruitForm.elements.species.value,
        attack: recruitForm.elements.attack.value,
        defense: recruitForm.elements.defense.value,
        hp: recruitForm.elements.hp.value
    };

    hideStatus();

    fetch(`${apiBase}/monsters`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message !== 'Monster recruited successfully.') {
                showStatus(data.message || 'Unable to recruit monster.', 'error');
                return;
            }

            recruitForm.reset();
            loadMonsters();
            showStatus('Monster recruited successfully.');
        })
        .catch(error => {
            showStatus(error.message, 'error');
        });
});

retireForm.addEventListener('submit', event => {
    event.preventDefault();

    const id = retireInput.value.trim();

    if (!id) {
        showStatus('Enter a monster ID to retire.', 'error');
        return;
    }

    hideStatus();

    fetch(`${apiBase}/retire`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message !== 'Monster retired successfully.') {
                showStatus(data.message || 'Unable to retire monster.', 'error');
                return;
            }

            retireForm.reset();
            hideMonsterDetail();
            battleResults.innerHTML = '';
            loadMonsters();
            showStatus('Monster retired successfully.');
        })
        .catch(error => {
            showStatus(error.message, 'error');
        });
});

battleForm.addEventListener('submit', event => {
    event.preventDefault();

    hideStatus();

    fetch(`${apiBase}/battle`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                battleResults.innerHTML = '';
                showStatus(data.message, 'error');
                return;
            }

            renderBattleResults(data);
            showStatus('Battle complete.');
        })
        .catch(error => {
            battleResults.innerHTML = '';
            showStatus(error.message, 'error');
        });
});

loadMonsters();
