const TRIVIA_URL = "https://opentdb.com/api.php?amount=1&type=multiple"; // public,
const seedNames = ["Asha", "Ben", "Chen", "Dina", "Eli", "Flo"];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const htmlDecode = (str) => {
const el = document.createElement('textarea');
el.innerHTML = str || "";
return el.value;
};
// Expose utilities globally so IC17 can access them
window.htmlDecode = htmlDecode;
window.randomInt = randomInt;
window.TRIVIA_URL = TRIVIA_URL;
/* Components (provided) */
function ProfileSettings({ username, highScore, onSaveUsername }) {
const [draft, setDraft] = React.useState(username || "");
return (
<div>
<div className="badge">High Score: {highScore}</div>
<div className="input-row" style={{ marginTop: "0.75rem" }}>
<input
type="text"
placeholder="Enter username"
value={draft}
onChange={(e) => setDraft(e.target.value)}
aria-label="Username"
/>
<button className="button" onClick={() =>
onSaveUsername(draft)}>Save</button>
</div>
{!username && <div className="status">Tip: Username will persist using Web
Storage in Step 8.</div>}
</div>
);
}
function QuestionPanel({
question,
loading,
error,
onFetchQuestion,
onSubmitAnswer,
locked,
lastResult
}) {
return (
<div>
<div className="input-row">
<button
onClick={onFetchQuestion}
className="button"
disabled={loading}
title="Fetch a new question"
>
{loading ? "Fetching..." : "Next Question"}
</button>
{lastResult && (
<span className={`badge ${lastResult.correct ? "success" : "error"}`}>
{lastResult.correct ? "Correct!" : "Incorrect"}
</span>
)}
</div>
{loading && <div className="status loading">Fetching question…</div>}
{error && (
<div className="status error">
{error}
<div><button className="button secondary" onClick={onFetchQuestion}
>Retry</button></div>
</div>
)}
{/* --- Inside QuestionPanel component in ic17-scaffold.js --- */}
{!loading && !error && question && (
/* Adding key={question.prompt} forces React to destroy and
re-create this div (and all radio buttons inside) every
time the question text changes. This clears the "blue dot."
*/
<div style={{ marginTop: "0.75rem" }} key={question.prompt}>
<div style={{ marginBottom: "0.5rem" }}>{htmlDecode(question.prompt)}
</div>
{question.choices.map((c) => (
<label key={c.value} className={`choice`}>
<input
type="radio"
name="choice"
value={c.value}
disabled={locked}
onChange={() => onSubmitAnswer(c.value)}
/>
{" "}{htmlDecode(c.text)}
</label>
))}
</div>
)}
{!question && !loading && !error && (
<div className="status">Click "Next Question" to begin.</div>
)}
</div>
);
}
function Leaderboard({ entries, updating }) {
return (
<div>
<div className={`status ${updating ? "loading" : ""}`}>
{updating ? "Updating leaderboard…" : "Leaderboard ready"}
</div>
<ul className="list" aria-live="polite">
{entries.map((e, idx) => (
<li key={e.name + idx}>
<span>{e.name}</span>
<span>{e.score}</span>
</li>
))}
</ul>
</div>
);
}
/* Mount with Portals (provided) */
const profileRoot = document.getElementById("profile-root");
const questionRoot = document.getElementById("question-root");
const leaderboardRoot = document.getElementById("leaderboard-root");
// Create a wrapper component that uses portals to render into separate roots
function AppWithPortals() {
// Core player state
const [username, setUsername] = React.useState("");
const [highScore, setHighScore] = React.useState(0);
const [score, setScore] = React.useState(0);
// Question/answer state
const [question, setQuestion] = React.useState(null);
const [loading, setLoading] = React.useState(false);
const [error, setError] = React.useState(null);
const [locked, setLocked] = React.useState(false);
const [lastResult, setLastResult] = React.useState(null);
// Leaderboard state
const [leaderboard, setLeaderboard] = React.useState(
seedNames.map((name) => ({ name, score: randomInt(5, 15) }))
);
const [lbUpdating, setLbUpdating] = React.useState(false);
const pollRef = React.useRef(null);
// Add this inside AppWithPortals, before the other useEffects
React.useEffect(() => {
if (window.IC17?.init) {
window.IC17.init({
setUsername,
setHighScore,
setScore,
setQuestion,
setLoading,
setError,
setLocked,
setLastResult,
setLeaderboard,
setLbUpdating,
pollRef,
});
}
}, []); // Empty dependency array ensures this only runs once on mount
// WIRING 1: Expose state to IC17 namespace✅
React.useEffect(() => {
if (window.IC17?.onStateSync) {
window.IC17.onStateSync({
username, setUsername,
highScore, setHighScore,
score, setScore,
question, setQuestion,
setLoading, setError, setLocked, setLastResult,
leaderboard, setLeaderboard, setLbUpdating,
pollRef
});
}
});
// WIRING 2: Hydrate from localStorage on mount (Step 8)✅
React.useEffect(() => {
window.IC17?.storageHydrate?.();
}, []);
// WIRING 3: Sync score to sessionStorage (Step 8)✅
React.useEffect(() => {
window.IC17?.storageSyncScore?.(score);
}, [score]);
// WIRING 4: Start/stop polling (Step 7)✅
React.useEffect(() => {
window.IC17?.startPolling?.();
return () => window.IC17?.stopPolling?.();
}, []);
// WIRING 5: Route saveUsername to IC17✅
const handleSaveUsername = (name) => {
window.IC17?.saveUsername?.(name);
};
// WIRING 6: Route fetchQuestion to IC17✅
const handleFetchQuestion = () => {
window.IC17?.fetchQuestion?.();
};
// WIRING 7: Route submitAnswer to IC17✅
const handleSubmitAnswer = (choiceValue) => {
window.IC17?.submitAnswer?.(choiceValue);
};
/* Inside ic17-scaffold.js -> AppWithPortals component */
// FIXED: Automatic Leaderboard Logic in AppWithPortals✅
React.useEffect(() => {
const leaderboardInterval = setInterval(() => {
setLbUpdating(true);
setTimeout(() => {
setLeaderboard((prev) => {
const userExists = prev.some(p => p.name === username);
let currentList = [...prev];
if (!userExists && username !== "") {
currentList.push({ name: username, score: score });
}
const updated = currentList.map((player) => {
if (player.name === username && username !== "") {
return { ...player, score: score };
}
const change = Math.random() > 0.5 ? 1 : 0;
return { ...player, score: player.score + (Math.random() < 0.2 ? change :
0) };
});
return updated.sort((a, b) => b.score - a.score);
});
setLbUpdating(false);
}, 1000);
}, 5000);
return () => clearInterval(leaderboardInterval);
}, [username, score]);
// Render into three separate roots using portals
return (
<>
{ReactDOM.createPortal(
<>
<ProfileSettings
username={username}
highScore={highScore}
onSaveUsername={handleSaveUsername}
/>
<div className="badge" style={{ marginTop: "0.5rem" }}>
Current Score: {score}
</div>
</>,
profileRoot
)}
{ReactDOM.createPortal(
<QuestionPanel
question={question}
loading={loading}
error={error}
onFetchQuestion={handleFetchQuestion}
onSubmitAnswer={handleSubmitAnswer}
locked={locked}
lastResult={lastResult}
/>,
questionRoot
)}
{ReactDOM.createPortal(
<Leaderboard entries={leaderboard} updating={lbUpdating} />,
leaderboardRoot
)}
</>
);
}
// Mount the app into a container (portals handle actual rendering into the three roots)
const appContainer = document.createElement('div');
document.body.appendChild(appContainer);
ReactDOM.createRoot(appContainer).render(<AppWithPortals />);


