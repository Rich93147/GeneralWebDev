const { useMemo, useState } = React;

console.log("React available:", Boolean(window.React));
console.log("ReactDOM available:", Boolean(window.ReactDOM));

const UPGRADE_SEED = [
	{ id: "cursor", name: "Better Cursor", cost: 10, powerBonus: 1, purchased: false },
	{ id: "mouse", name: "Turbo Mouse", cost: 25, powerBonus: 2, purchased: false },
	{ id: "bot", name: "Auto Tap Bot", cost: 50, powerBonus: 4, purchased: false }
];

const ACHIEVEMENT_SEED = [
	{ id: "coin-50", title: "Coin Collector", rule: "Reach 50 coins", unlocked: false },
	{ id: "click-20", title: "Click Cadet", rule: "Reach 20 total clicks", unlocked: false },
	{ id: "shop-1", title: "First Investment", rule: "Purchase 1 upgrade", unlocked: false }
];

function Header({ playerNameInput, playerName, onNameChange, onNameSubmit }) {
	return (
		<header className="panel">
			<h1>React Clicker Quest</h1>
			<p>Welcome, <strong>{playerName}</strong>!</p>
			<form className="name-form" onSubmit={onNameSubmit}>
				<label htmlFor="playerName">Player Name</label>
				<input
					id="playerName"
					type="text"
					value={playerNameInput}
					onChange={onNameChange}
					placeholder="Enter your player name"
				/>
				<button type="submit">Update Name</button>
			</form>
		</header>
	);
}

function StatsPanel({ coins, clickPower, totalClicks }) {
	return (
		<section className="panel" aria-label="Player Stats">
			<h2>Stats</h2>
			<div className="stats-grid">
				<article className="stat-card">
					<div className="stat-label">Coins</div>
					<div className="stat-value">{coins}</div>
				</article>
				<article className="stat-card">
					<div className="stat-label">Click Power</div>
					<div className="stat-value">{clickPower}</div>
				</article>
				<article className="stat-card">
					<div className="stat-label">Total Clicks</div>
					<div className="stat-value">{totalClicks}</div>
				</article>
			</div>
		</section>
	);
}

function GameClicker({ clickPower, onCoinClick }) {
	return (
		<section className="panel click-area" aria-label="Click Area">
			<h2>Click Area</h2>
			<button className="click-button" type="button" onClick={onCoinClick}>
				Mine Coins (+{clickPower})
			</button>
		</section>
	);
}

function Shop({ upgrades, coins, onPurchase }) {
	return (
		<section className="panel" aria-label="Shop">
			<h2>Shop</h2>
			<div className="shop-grid">
				{upgrades.map((upgrade) => {
					const cannotAfford = coins < upgrade.cost;
					const disabled = cannotAfford || upgrade.purchased;

					return (
						<article key={upgrade.id} className="shop-card">
							<h3>{upgrade.name}</h3>
							<p className="shop-meta">Cost: {upgrade.cost} coins</p>
							<p className="shop-meta">Power +{upgrade.powerBonus}</p>
							<button
								type="button"
								disabled={disabled}
								className={disabled ? "disabled" : ""}
								onClick={() => onPurchase(upgrade.id)}
							>
								{upgrade.purchased ? "Purchased" : "Purchase"}
							</button>
						</article>
					);
				})}
			</div>
		</section>
	);
}

function Achievements({ achievements }) {
	return (
		<section className="panel" aria-label="Achievements">
			<h2>Achievements</h2>
			<ul className="achievements-list">
				{achievements.map((achievement) => (
					<li
						key={achievement.id}
						className={`achievement-item ${achievement.unlocked ? "unlocked" : "locked"}`}
					>
						<strong>{achievement.title}</strong> - {achievement.rule} - {achievement.unlocked ? "Unlocked" : "Locked"}
					</li>
				))}
			</ul>
		</section>
	);
}

function App() {
	const [playerNameInput, setPlayerNameInput] = useState("");
	const [playerName, setPlayerName] = useState("Player");
	const [coins, setCoins] = useState(0);
	const [clickPower, setClickPower] = useState(1);
	const [totalClicks, setTotalClicks] = useState(0);
	const [upgrades, setUpgrades] = useState(UPGRADE_SEED);
	const [achievements, setAchievements] = useState(ACHIEVEMENT_SEED);

	const purchasedCount = useMemo(
		() => upgrades.filter((upgrade) => upgrade.purchased).length,
		[upgrades]
	);

	const updateAchievements = (nextCoins, nextTotalClicks, nextPurchasedCount) => {
		setAchievements((current) =>
			current.map((achievement) => {
				if (achievement.id === "coin-50") {
					return { ...achievement, unlocked: nextCoins >= 50 };
				}
				if (achievement.id === "click-20") {
					return { ...achievement, unlocked: nextTotalClicks >= 20 };
				}
				if (achievement.id === "shop-1") {
					return { ...achievement, unlocked: nextPurchasedCount >= 1 };
				}
				return achievement;
			})
		);
	};

	const handleNameChange = (event) => {
		setPlayerNameInput(event.target.value);
	};

	const handleNameSubmit = (event) => {
		event.preventDefault();
		const trimmed = playerNameInput.trim();
		if (!trimmed) {
			return;
		}
		setPlayerName(trimmed);
	};

	const handleCoinClick = () => {
		const nextCoins = coins + clickPower;
		const nextTotalClicks = totalClicks + 1;
		setCoins(nextCoins);
		setTotalClicks(nextTotalClicks);
		updateAchievements(nextCoins, nextTotalClicks, purchasedCount);
	};

	const handlePurchase = (upgradeId) => {
		const targetUpgrade = upgrades.find((upgrade) => upgrade.id === upgradeId);
		if (!targetUpgrade || targetUpgrade.purchased || coins < targetUpgrade.cost) {
			return;
		}

		const nextCoins = coins - targetUpgrade.cost;
		const nextClickPower = clickPower + targetUpgrade.powerBonus;
		const nextUpgrades = upgrades.map((upgrade) =>
			upgrade.id === upgradeId ? { ...upgrade, purchased: true } : upgrade
		);
		const nextPurchasedCount = nextUpgrades.filter((upgrade) => upgrade.purchased).length;

		setCoins(nextCoins);
		setClickPower(nextClickPower);
		setUpgrades(nextUpgrades);
		updateAchievements(nextCoins, totalClicks, nextPurchasedCount);
	};

	const firstAvailableUpgrade = upgrades.find((upgrade) => !upgrade.purchased);
	const showTip = Boolean(firstAvailableUpgrade && coins < firstAvailableUpgrade.cost);

	return (
		<main>
			<Header
				playerNameInput={playerNameInput}
				playerName={playerName}
				onNameChange={handleNameChange}
				onNameSubmit={handleNameSubmit}
			/>

			<StatsPanel coins={coins} clickPower={clickPower} totalClicks={totalClicks} />

			<GameClicker clickPower={clickPower} onCoinClick={handleCoinClick} />

			<Shop upgrades={upgrades} coins={coins} onPurchase={handlePurchase} />

			{showTip && (
				<p className="tip">
					Tip: Earn {firstAvailableUpgrade.cost} coins to buy {firstAvailableUpgrade.name}.
				</p>
			)}

			<Achievements achievements={achievements} />

			<footer className="footer-note">React Clicker Quest v1</footer>
		</main>
	);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
