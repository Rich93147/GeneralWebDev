// window.IC17 = (

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function fetchQuestion() {
    refs.setLoading?.(true);
    refs.setError?.(null);
    refs.setLocked?.(true);

    refs.setLastResult?.(null);

    try {
        const resp = await fetch(window.TRIVIA_URL);

        if (!resp.ok) {
            throw new Error(`HTTP error! status: ${resp.status}`);
        }

        const data = await resp.json();
        const item = data.results && data.results[0];

        const choices = shuffle([
            ...item.incorrect_answers, item.correct_answer
        ].map((txt, i) => ({ text: txt, value: `c${i}` })));

        refs.setQuestion?.({ prompt: item.question, correct: item.correct_answer, choices });

        refs.setLocked?.(false);
    } catch (err) {
        console.log(err);
    refs.setError?.("Failed to load trivia.");
    } finally {
        refs.setLoading?.(false);
    }
}


async function submitAnswer(choiceValue) {
    if (!refs.question) return;
    refs.setLocked?.(true);

    await delay(500);

    const selected = refs.question.choices.find((c) => c.value === choiceValue)?.text || "";
    

    const isCorrect = window.htmlDecode(selected) === window.htmlDecode(refs.question.correct);

    if (isCorrect) {
        refs.setScore?.(prevScore => {
            const newScore = prevScore + 1;
            refs.setHighScore?.(prevHigh => {
                if (newScore > prevHigh) {
                    localStorage.setItem("ic17_highscore", string(newScore));
                    
                    return newScore;
                }
            return prevHigh;
            });
        return newScore;
        });
    refs.setLastResult?.(" correct: isCorrect ");
    refs.setLocked?.(false);
    } else {
    refs.setLastResult?.(" incorrect: isCorrect ");
    refs.setLocked?.(false);
    }}

function storageHydrate() {
    const u = localStorage.getItem("ic17_username") || "";
    const hs = parseInt(localStorage.getItem("ic17_highscore") || "0", 10);
    if (u) refs.setUsername?.(u);
    if (!isNaN(hs)) refs.setHighScore?.(hs);
}

function saveUsername(name) {
    const trimmed = (name || "").trim();
    if (trimmed) {
        localStorage.setItem("ic17_username", trimmed);
        refs.setUsername?.(trimmed);
    }

    function init(appRefs) {
        refs = { ...refs, ...appRefs };
    }

    function onStateSync(snapshot) {
        Object.assign(refs, snapshot);
    }

    return {
        init,
        onStateSync,
        fetchQuestion,
        submitAnswer,
        storageHydrate,
        saveUsername,
    };
}