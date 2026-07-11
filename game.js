"use strict";

const SAVE_KEY = "goldenmont-academy-save-v1";
const STAT_LABELS = {
  academics: "Academics",
  charisma: "Charisma",
  creativity: "Creativity",
  fitness: "Fitness",
  kindness: "Kindness"
};

const ACTIVITIES = {
  academics: { label: "Study", description: "Review lessons in the library." },
  charisma: { label: "Socialize", description: "Spend time with classmates." },
  creativity: { label: "Create", description: "Draw or work on a school project." },
  fitness: { label: "Train", description: "Practice at the gym or track." },
  kindness: { label: "Help Out", description: "Assist someone around campus." }
};

const DEFAULT_STATE = () => ({
  version: 1,
  player: { name: "Lilianna", hair: "brown", eyes: "brown", skin: "warm" },
  day: 0,
  stats: { academics: 10, charisma: 10, creativity: 10, fitness: 10, kindness: 10 },
  affection: { ethan: 0, julian: 0 },
  history: [],
  ending: null
});

let state = DEFAULT_STATE();
let sceneQueue = [];
let sceneCallback = null;
let currentNode = null;

const $ = (selector) => document.querySelector(selector);
const screens = [...document.querySelectorAll(".screen")];
const nextButton = $("#next-btn");
const choiceArea = $("#choice-area");
const dialogueText = $("#dialogue-text");
const speakerName = $("#speaker-name");
const bgCanvas = $("#background-canvas");
const portraitCanvas = $("#portrait-canvas");

function showScreen(id) {
  screens.forEach((screen) => screen.classList.toggle("active", screen.id === id));
}

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  window.setTimeout(() => el.classList.remove("show"), 1700);
}

function saveGame(silent = false) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  updateContinueButton();
  if (!silent) toast("Game saved.");
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) {
    toast("No save found.");
    return;
  }
  try {
    state = { ...DEFAULT_STATE(), ...JSON.parse(raw) };
    state.stats = { ...DEFAULT_STATE().stats, ...state.stats };
    state.affection = { ...DEFAULT_STATE().affection, ...state.affection };
    showScreen("game-screen");
    if (state.ending) {
      showEnding(state.ending);
    } else {
      beginDay();
    }
    toast("Save loaded.");
  } catch (error) {
    console.error(error);
    toast("The save could not be loaded.");
  }
}

function updateContinueButton() {
  $("#continue-btn").disabled = !localStorage.getItem(SAVE_KEY);
}

function addHistory(text) {
  state.history.unshift(text);
  state.history = state.history.slice(0, 6);
  renderHistory();
}

function changeStat(stat, amount) {
  state.stats[stat] = Math.max(0, Math.min(30, state.stats[stat] + amount));
}

function changeAffection(person, amount) {
  state.affection[person] = Math.max(0, state.affection[person] + amount);
}

function bondHint(score, person) {
  if (score >= 9) return person === "ethan" ? "He trusts you with what he cannot say." : "His polished smile becomes genuine around you.";
  if (score >= 6) return person === "ethan" ? "Your old rhythm is returning." : "He actively looks for you between classes.";
  if (score >= 3) return person === "ethan" ? "He seems comfortable by your side." : "His attention lingers more often.";
  return person === "ethan" ? "An old friend." : "A familiar face at school.";
}

function renderSidebar() {
  const statsList = $("#stats-list");
  statsList.innerHTML = Object.entries(STAT_LABELS).map(([key, label]) => {
    const value = state.stats[key];
    return `<div class="stat-row"><div class="stat-head"><span>${label}</span><strong>${value}</strong></div><div class="stat-track"><div class="stat-fill" style="width:${(value / 30) * 100}%"></div></div></div>`;
  }).join("");
  $("#ethan-hint").textContent = bondHint(state.affection.ethan, "ethan");
  $("#julian-hint").textContent = bondHint(state.affection.julian, "julian");
  renderHistory();
}

function renderHistory() {
  const list = $("#history-list");
  list.innerHTML = state.history.length
    ? state.history.map((item) => `<li>${escapeHtml(item)}</li>`).join("")
    : "<li>The term has just begun.</li>";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function scene(speaker, text, portrait = null, emotion = "neutral", bg = "classroom", choices = null) {
  return { speaker, text, portrait, emotion, bg, choices };
}

function playerName() { return state.player.name || "Lilianna"; }

const DAYS = [
  {
    label: "Week 1 · Monday · September 1",
    title: "First Day",
    intro: () => [
      scene("Narration", "Goldenmont Academy rises above the hill in pale stone and autumn gold. Your first day begins at its crowded front gate.", null, "neutral", "gate"),
      scene("Ethan", `You still stop in the middle of every doorway, ${playerName()}. Some things never change.`, "ethan", "happy", "gate"),
      scene(playerName(), "Ethan? I thought you moved across town.", "player", "surprised", "gate"),
      scene("Ethan", "I did. The school did not.", "ethan", "neutral", "gate", [
        { text: "Tell him you missed him.", effect: () => { changeAffection("ethan", 2); changeStat("kindness", 1); addHistory("You welcomed Ethan back honestly."); } },
        { text: "Tease him for the dramatic entrance.", effect: () => { changeAffection("ethan", 1); changeStat("charisma", 1); addHistory("You slipped easily into old banter with Ethan."); } }
      ])
    ],
    after: () => [scene("Ethan", "Meet me by the courtyard after class sometime. I owe you several years of explanations.", "ethan", "soft", "courtyard")]
  },
  {
    label: "Week 1 · Tuesday · September 2",
    title: "The Golden Boy",
    intro: () => [
      scene("Narration", "At lunch, a burst of applause travels through the courtyard. Julian Vale has apparently solved a student council problem before dessert.", null, "neutral", "courtyard"),
      scene("Julian", "You are the transfer everyone keeps describing differently.", "julian", "happy", "courtyard"),
      scene(playerName(), "And you must be the student everyone describes exactly the same way.", "player", "happy", "courtyard"),
      scene("Julian", "Popular, unbearable, or devastatingly efficient? Choose carefully.", "julian", "blush", "courtyard", [
        { text: "Efficient. For now.", effect: () => { changeAffection("julian", 2); changeStat("academics", 1); addHistory("You met Julian's challenge without flinching."); } },
        { text: "Unbearable, but entertaining.", effect: () => { changeAffection("julian", 1); changeStat("charisma", 1); addHistory("You made Julian laugh in front of everyone."); } }
      ])
    ],
    after: () => [scene("Julian", "I will see you again, then. Goldenmont is smaller than it pretends to be.", "julian", "happy", "hallway")]
  },
  {
    label: "Week 1 · Wednesday · September 3",
    title: "Library Window",
    intro: () => [scene("Narration", "Rain keeps half the school indoors. Ethan saves the seat beside him in the library without asking.", null, "neutral", "library")],
    after: (activity) => activity === "academics"
      ? [scene("Ethan", "You still underline the important parts twice. I remembered that.", "ethan", "soft", "library"), scene("Narration", "The observation is quiet, but it stays with you.", null, "neutral", "library")]
      : [scene("Ethan", "You look busy. I can walk you home when you are done.", "ethan", "soft", "library")]
  },
  {
    label: "Week 1 · Thursday · September 4",
    title: "A Public Favor",
    intro: () => [scene("Julian", "I need one person who will tell me when an idea is bad. Everyone else keeps nodding.", "julian", "serious", "classroom")],
    after: (activity) => [scene("Julian", activity === "creativity" ? "That poster is better than the council's entire proposal." : "You did not agree with me automatically. That is rarer than talent here.", "julian", "happy", "classroom")]
  },
  {
    label: "Week 1 · Friday · September 5",
    title: "Two Invitations",
    intro: () => [
      scene("Narration", "Friday ends with two invitations: Ethan offers a quiet walk home, while Julian asks for help preparing the welcome festival.", null, "neutral", "hallway", [
        { text: "Walk home with Ethan.", effect: () => { changeAffection("ethan", 2); addHistory("You chose a quiet walk home with Ethan."); } },
        { text: "Help Julian with the festival.", effect: () => { changeAffection("julian", 2); addHistory("You stayed late to help Julian."); } }
      ])
    ],
    after: () => [scene("Narration", "The week closes, but neither invitation feels casual anymore.", null, "neutral", "gate")]
  },
  {
    label: "Week 1 · Saturday · September 6",
    title: "Town Festival",
    intro: () => [scene("Narration", "Goldenmont's weekend market fills the old square with paper lanterns and music.", null, "neutral", "town")],
    after: (activity) => [
      scene(activity === "fitness" || activity === "kindness" ? "Ethan" : "Julian",
        activity === "fitness" || activity === "kindness"
          ? "I knew I would find you doing something useful instead of relaxing."
          : "I was told this was a day off. Somehow you still look determined.",
        activity === "fitness" || activity === "kindness" ? "ethan" : "julian", "happy", "town")
    ]
  },
  {
    label: "Week 1 · Sunday · September 7",
    title: "A Quiet Message",
    intro: () => [scene("Narration", "Sunday is quiet until two messages arrive within a minute of each other.", null, "neutral", "bedroom")],
    after: () => [scene("Narration", "Ethan asks whether the first week was all right. Julian sends a photograph of the finished festival banner. You answer both—but think longer about one.", null, "neutral", "bedroom")]
  },
  {
    label: "Week 2 · Monday · September 8",
    title: "Partner Project",
    intro: () => [scene("Teacher", "For the history presentation, choose your own partner. Choose someone who will challenge you.", null, "neutral", "classroom", [
      { text: "Partner with Ethan.", effect: () => { changeAffection("ethan", 2); changeStat("academics", 1); addHistory("You chose Ethan as your project partner."); } },
      { text: "Partner with Julian.", effect: () => { changeAffection("julian", 2); changeStat("academics", 1); addHistory("You chose Julian as your project partner."); } }
    ])],
    after: () => [scene("Narration", "The project gives you an excuse to spend more time together. Neither of you calls it that.", null, "neutral", "library")]
  },
  {
    label: "Week 2 · Tuesday · September 9",
    title: "The Rumor",
    intro: () => [scene("Narration", "A careless rumor spreads through class: apparently, your attention has become a competition.", null, "neutral", "hallway")],
    after: (activity) => [scene(playerName(), activity === "kindness" ? "I will not let someone else's gossip decide how I treat either of them." : "Goldenmont can talk. I have more important things to do.", "player", "serious", "hallway")]
  },
  {
    label: "Week 2 · Wednesday · September 10",
    title: "Unsaid Things",
    intro: () => [scene("Ethan", "When I moved, I kept meaning to write. Then enough time passed that every first sentence sounded stupid.", "ethan", "sad", "rooftop")],
    after: () => [scene(playerName(), "You could start with hello.", "player", "soft", "rooftop"), scene("Ethan", "Hello, then.", "ethan", "blush", "rooftop")]
  },
  {
    label: "Week 2 · Thursday · September 11",
    title: "Behind the Smile",
    intro: () => [scene("Julian", "Being admired is easy. Being known is inconvenient.", "julian", "sad", "artroom")],
    after: () => [scene(playerName(), "You asked me not to nod at everything. So I won't pretend that sounds fine.", "player", "serious", "artroom"), scene("Julian", "Good. Stay inconvenient.", "julian", "soft", "artroom")]
  },
  {
    label: "Week 2 · Friday · September 12",
    title: "Presentation Day",
    intro: () => [scene("Narration", "Your presentation earns warm applause. More important is the relieved smile from the person standing beside you.", null, "neutral", "classroom")],
    after: (activity) => [scene("Narration", `Your ${STAT_LABELS[activity].toLowerCase()} practice gives you the confidence to finish the week strongly.`, null, "neutral", "classroom")]
  },
  {
    label: "Week 2 · Saturday · September 13",
    title: "Golden Hour",
    intro: () => [scene("Narration", "The school opens its gardens for the final festival afternoon. Gold light settles over the courtyard.", null, "neutral", "courtyard")],
    after: () => [scene("Narration", "Someone is waiting beneath the old clock tower.", null, "neutral", "courtyard")]
  },
  {
    label: "Week 2 · Sunday · September 14",
    title: "What Comes Next",
    intro: () => [scene("Narration", "Two weeks ago, Goldenmont was only a school on a hill. Now its halls hold promises, questions, and one choice you may already have made.", null, "neutral", "gate")],
    after: () => []
  }
];

function beginDay() {
  if (state.day >= DAYS.length) {
    determineEnding();
    return;
  }
  const day = DAYS[state.day];
  $("#day-label").textContent = day.label;
  renderSidebar();
  runScenes(day.intro(), showActivities);
}

function runScenes(nodes, callback) {
  sceneQueue = [...nodes];
  sceneCallback = callback;
  nextScene();
}

function nextScene() {
  if (!sceneQueue.length) {
    const callback = sceneCallback;
    sceneCallback = null;
    currentNode = null;
    if (callback) callback();
    return;
  }
  currentNode = sceneQueue.shift();
  renderScene(currentNode);
}

function renderScene(node) {
  speakerName.textContent = node.speaker || "Narration";
  dialogueText.textContent = node.text;
  choiceArea.innerHTML = "";
  drawBackground(bgCanvas, node.bg || "classroom");
  drawPortrait(portraitCanvas, node.portrait, node.emotion || "neutral");

  if (node.choices?.length) {
    nextButton.hidden = true;
    node.choices.forEach((choice) => {
      const button = document.createElement("button");
      button.textContent = choice.text;
      button.addEventListener("click", () => {
        choice.effect?.();
        renderSidebar();
        nextScene();
      }, { once: true });
      choiceArea.appendChild(button);
    });
  } else {
    nextButton.hidden = false;
  }
}

function showActivities() {
  speakerName.textContent = "After School";
  dialogueText.textContent = "Choose one activity for today.";
  drawPortrait(portraitCanvas, "player", "neutral");
  choiceArea.innerHTML = "";
  nextButton.hidden = true;

  Object.entries(ACTIVITIES).forEach(([key, activity]) => {
    const button = document.createElement("button");
    button.innerHTML = `<strong>${activity.label}</strong> — ${activity.description}<span class="activity-gain">+2 ${STAT_LABELS[key]}</span>`;
    button.addEventListener("click", () => chooseActivity(key), { once: true });
    choiceArea.appendChild(button);
  });
}

function chooseActivity(activity) {
  changeStat(activity, 2);
  const dayNumber = state.day + 1;

  if (["fitness", "kindness"].includes(activity) && [2, 5, 9, 12].includes(state.day)) changeAffection("ethan", 1);
  if (["academics", "charisma", "creativity"].includes(activity) && [3, 5, 10, 12].includes(state.day)) changeAffection("julian", 1);

  addHistory(`Day ${dayNumber}: ${ACTIVITIES[activity].label} raised ${STAT_LABELS[activity]}.`);
  renderSidebar();

  const result = scene(playerName(), `You spend the day focusing on ${STAT_LABELS[activity].toLowerCase()}.`, "player", "happy", DAYS[state.day].title === "Town Festival" ? "town" : "classroom");
  const afterScenes = DAYS[state.day].after(activity);
  runScenes([result, ...afterScenes], finishDay);
}

function finishDay() {
  state.day += 1;
  saveGame(true);
  if (state.day >= DAYS.length) determineEnding();
  else beginDay();
}

function determineEnding() {
  let ending;
  const ethanScore = state.affection.ethan + state.stats.kindness / 5 + state.stats.fitness / 6;
  const julianScore = state.affection.julian + state.stats.charisma / 6 + state.stats.creativity / 6 + state.stats.academics / 8;

  if (ethanScore >= 11 && ethanScore >= julianScore) ending = "ethan";
  else if (julianScore >= 11) ending = "julian";
  else ending = "self";

  state.ending = ending;
  saveGame(true);
  showEnding(ending);
}

function showEnding(ending) {
  const endings = {
    ethan: {
      title: "The Way Home",
      text: `Ethan waits beneath the clock tower with two drinks and an apology years overdue. You do not erase the time apart, but you choose what comes after it. When he offers to walk you home, your hands find each other before either of you can overthink it.`,
      portrait: "ethan",
      emotion: "blush"
    },
    julian: {
      title: "Beyond the Applause",
      text: `Julian stands alone beneath the clock tower, without an audience or a rehearsed smile. He admits that you are the first person at Goldenmont who makes him want to be honest before impressive. You agree to begin with one ordinary afternoon together—and discover that ordinary can feel extraordinary.`,
      portrait: "julian",
      emotion: "blush"
    },
    self: {
      title: "Your Own Golden Path",
      text: `The clock tower is quiet, and that does not feel like a loss. In two weeks, you found your footing, strengthened your talents, and formed connections that still have room to grow. Goldenmont is no longer a place waiting to define you. It is a place where you will decide who you become.`,
      portrait: "player",
      emotion: "happy"
    }
  };
  const data = endings[ending];
  $("#ending-title").textContent = data.title;
  $("#ending-text").textContent = data.text;
  $("#final-stats").innerHTML = Object.entries(STAT_LABELS).map(([key, label]) => `<span>${label}: <strong>${state.stats[key]}</strong></span>`).join("");
  drawPortrait($("#ending-portrait"), data.portrait, data.emotion);
  showScreen("ending-screen");
}

function drawBackground(canvas, location) {
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, 128, 128);

  const palettes = {
    gate: ["#a9d0d5", "#d9d3bd", "#6f8657", "#5f2d3f"],
    classroom: ["#c8d9d5", "#efe4c8", "#8c644d", "#5f2d3f"],
    courtyard: ["#a9d0d5", "#d9d3bd", "#6c8c55", "#8a5262"],
    library: ["#78605f", "#d8c49c", "#5b3c32", "#b99054"],
    hallway: ["#c9d8d0", "#eee0c4", "#7f5b49", "#5f2d3f"],
    town: ["#d7a4a5", "#f1ce8a", "#6b4b55", "#b34f5e"],
    bedroom: ["#7c6a86", "#e2c6c1", "#725769", "#d6a04b"],
    rooftop: ["#92b9d1", "#d9d3bd", "#66747b", "#5f2d3f"],
    artroom: ["#c2d4ce", "#f0e2c9", "#805c49", "#cf7d56"]
  };
  const [sky, wall, dark, accent] = palettes[location] || palettes.classroom;
  ctx.fillStyle = sky; ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = wall; ctx.fillRect(0, 48, 128, 80);

  if (["gate", "courtyard", "rooftop", "town"].includes(location)) {
    ctx.fillStyle = dark; ctx.fillRect(0, 92, 128, 36);
    ctx.fillStyle = wall; ctx.fillRect(20, 40, 88, 52);
    ctx.fillStyle = accent; ctx.fillRect(24, 44, 80, 7);
    ctx.fillStyle = "#5b463d"; ctx.fillRect(56, 65, 16, 27);
    if (location === "gate") {
      ctx.fillStyle = "#33343b"; for (let x = 8; x < 120; x += 12) ctx.fillRect(x, 64, 4, 42);
      ctx.fillRect(4, 64, 120, 4);
    }
    if (location === "courtyard") {
      ctx.fillStyle = "#365b3f"; ctx.fillRect(5, 70, 20, 30); ctx.fillRect(102, 68, 20, 32);
      ctx.fillStyle = "#6c8c55"; ctx.fillRect(0, 65, 30, 16); ctx.fillRect(96, 63, 32, 18);
    }
    if (location === "town") {
      ctx.fillStyle = "#f3df9a"; for (let x = 8; x < 128; x += 20) ctx.fillRect(x, 20 + (x % 40), 8, 8);
      ctx.fillStyle = "#5f2d3f"; ctx.fillRect(0, 52, 128, 5);
    }
    if (location === "rooftop") {
      ctx.fillStyle = "#53636c"; ctx.fillRect(0, 72, 128, 6);
      ctx.fillStyle = "#35434c"; for (let x = 0; x < 128; x += 16) ctx.fillRect(x, 58, 3, 22);
    }
  } else {
    ctx.fillStyle = dark; ctx.fillRect(0, 104, 128, 24);
    ctx.fillStyle = "#7ea5aa"; ctx.fillRect(12, 15, 42, 50); ctx.fillRect(74, 15, 42, 50);
    ctx.fillStyle = "#dff0ed"; ctx.fillRect(16, 19, 34, 42); ctx.fillRect(78, 19, 34, 42);
    if (location === "library") {
      ctx.fillStyle = "#4a3029"; ctx.fillRect(0, 20, 28, 84); ctx.fillRect(100, 20, 28, 84);
      const bookColors = ["#8e3e4a", "#506c83", "#c28d3c", "#6e7d4b"];
      for (let y = 28; y < 96; y += 16) for (let x of [4, 104]) {
        bookColors.forEach((color, i) => { ctx.fillStyle = color; ctx.fillRect(x + i * 5, y, 4, 12); });
      }
    } else if (location === "artroom") {
      ctx.fillStyle = "#6d4d3d"; ctx.fillRect(50, 62, 28, 4); ctx.fillRect(61, 66, 5, 38);
      ctx.fillStyle = "#f5e8ce"; ctx.fillRect(46, 37, 36, 28);
      ctx.fillStyle = accent; ctx.fillRect(53, 43, 11, 9); ctx.fillRect(66, 50, 9, 8);
    } else if (location === "bedroom") {
      ctx.fillStyle = "#8b6b7c"; ctx.fillRect(8, 72, 66, 34);
      ctx.fillStyle = "#efe4db"; ctx.fillRect(12, 76, 58, 17);
      ctx.fillStyle = accent; ctx.fillRect(86, 45, 4, 59); ctx.fillRect(78, 48, 20, 4);
    } else {
      ctx.fillStyle = "#8c644d"; ctx.fillRect(18, 76, 34, 20); ctx.fillRect(76, 76, 34, 20);
      ctx.fillStyle = "#d7c19f"; ctx.fillRect(16, 72, 38, 6); ctx.fillRect(74, 72, 38, 6);
    }
  }

  ctx.fillStyle = "rgba(255,255,255,.14)";
  for (let y = 0; y < 128; y += 8) ctx.fillRect(0, y, 128, 1);
}

function drawPortrait(canvas, character, emotion = "neutral") {
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, 128, 128);
  if (!character) return;

  const playerPalette = {
    skin: { fair: "#f5cfb2", warm: "#d9a27e", deep: "#8d5c45" }[state.player.skin] || "#d9a27e",
    hair: { black: "#26242b", brown: "#654134", blonde: "#d9ad5b" }[state.player.hair] || "#654134",
    eye: { brown: "#53392f", green: "#3f694f", blue: "#3c6484" }[state.player.eyes] || "#53392f",
    uniform: "#6d3248",
    trim: "#f0d78f"
  };
  const palettes = {
    player: playerPalette,
    ethan: { skin: "#d8a17d", hair: "#3b302d", eye: "#446052", uniform: "#4e6656", trim: "#e7d9b9" },
    julian: { skin: "#ecc09e", hair: "#b87c38", eye: "#45647d", uniform: "#394e6c", trim: "#e3c46d" }
  };
  const p = palettes[character] || playerPalette;

  ctx.fillStyle = "rgba(25,17,22,.18)"; ctx.fillRect(25, 116, 78, 8);
  ctx.fillStyle = p.uniform; ctx.fillRect(31, 86, 66, 36); ctx.fillRect(21, 99, 86, 23);
  ctx.fillStyle = p.trim; ctx.fillRect(58, 87, 12, 31); ctx.fillRect(45, 88, 38, 5);
  ctx.fillStyle = "#f6eee1"; ctx.fillRect(52, 78, 24, 17);
  ctx.fillStyle = p.skin; ctx.fillRect(38, 29, 52, 57); ctx.fillRect(33, 43, 7, 25); ctx.fillRect(90, 43, 7, 25);
  ctx.fillStyle = p.hair; ctx.fillRect(34, 22, 60, 25); ctx.fillRect(28, 31, 12, 51); ctx.fillRect(90, 31, 12, 51);

  if (character === "player") {
    ctx.fillRect(32, 66, 11, 32); ctx.fillRect(87, 66, 11, 32);
    ctx.fillStyle = p.skin; ctx.fillRect(40, 35, 50, 47);
    ctx.fillStyle = p.hair; ctx.fillRect(40, 26, 50, 13); ctx.fillRect(37, 34, 12, 22); ctx.fillRect(82, 34, 12, 22);
  } else if (character === "ethan") {
    ctx.fillStyle = p.hair; ctx.fillRect(34, 19, 52, 12); ctx.fillRect(27, 27, 18, 17); ctx.fillRect(79, 24, 20, 20);
  } else {
    ctx.fillStyle = p.hair; ctx.fillRect(34, 19, 58, 14); ctx.fillRect(27, 28, 20, 16); ctx.fillRect(75, 25, 24, 13);
    ctx.fillRect(42, 16, 22, 9);
  }

  const eyeY = emotion === "happy" ? 56 : 55;
  ctx.fillStyle = p.eye;
  if (emotion === "happy") {
    ctx.fillRect(48, eyeY, 8, 3); ctx.fillRect(74, eyeY, 8, 3);
  } else if (emotion === "sad") {
    ctx.fillRect(48, eyeY + 2, 8, 4); ctx.fillRect(74, eyeY + 2, 8, 4);
    ctx.fillStyle = p.hair; ctx.fillRect(47, 50, 9, 2); ctx.fillRect(74, 50, 9, 2);
  } else if (emotion === "serious") {
    ctx.fillRect(48, eyeY, 8, 4); ctx.fillRect(74, eyeY, 8, 4);
    ctx.fillStyle = p.hair; ctx.fillRect(47, 49, 10, 3); ctx.fillRect(73, 49, 10, 3);
  } else {
    ctx.fillRect(48, eyeY, 8, 5); ctx.fillRect(74, eyeY, 8, 5);
  }

  ctx.fillStyle = "rgba(180,70,75,.35)";
  if (["blush", "soft"].includes(emotion)) { ctx.fillRect(42, 66, 10, 5); ctx.fillRect(78, 66, 10, 5); }
  ctx.fillStyle = "#9e4b51";
  if (["happy", "blush", "soft"].includes(emotion)) { ctx.fillRect(57, 70, 16, 3); ctx.fillRect(61, 73, 8, 3); }
  else if (emotion === "sad") { ctx.fillRect(59, 74, 12, 3); ctx.fillRect(62, 71, 6, 3); }
  else { ctx.fillRect(59, 72, 12, 3); }

  ctx.fillStyle = "rgba(255,255,255,.12)";
  for (let y = 0; y < 128; y += 8) ctx.fillRect(0, y, 128, 1);
}

$("#new-game-btn").addEventListener("click", () => {
  state = DEFAULT_STATE();
  updateCreatorPreview();
  showScreen("creator-screen");
});
$("#continue-btn").addEventListener("click", loadGame);
$("#creator-back-btn").addEventListener("click", () => showScreen("menu-screen"));
$("#creator-form").addEventListener("submit", (event) => {
  event.preventDefault();
  state = DEFAULT_STATE();
  state.player = {
    name: $("#player-name").value.trim() || "Lilianna",
    hair: $("#hair-color").value,
    eyes: $("#eye-color").value,
    skin: $("#skin-tone").value
  };
  state.history = [`${state.player.name} enrolled at Goldenmont Academy.`];
  showScreen("game-screen");
  saveGame(true);
  beginDay();
});

function updateCreatorPreview() {
  const previous = state.player;
  state.player = {
    name: $("#player-name").value.trim() || "Lilianna",
    hair: $("#hair-color").value,
    eyes: $("#eye-color").value,
    skin: $("#skin-tone").value
  };
  drawPortrait($("#creator-portrait"), "player", "happy");
  state.player = { ...state.player, name: previous.name || state.player.name };
}

["#hair-color", "#eye-color", "#skin-tone"].forEach((selector) => $(selector).addEventListener("change", updateCreatorPreview));
$("#player-name").addEventListener("input", updateCreatorPreview);
nextButton.addEventListener("click", nextScene);
$("#save-btn").addEventListener("click", () => saveGame(false));
$("#load-btn").addEventListener("click", loadGame);
$("#menu-btn").addEventListener("click", () => { saveGame(true); showScreen("menu-screen"); updateContinueButton(); });
$("#restart-btn").addEventListener("click", () => { state = DEFAULT_STATE(); showScreen("creator-screen"); updateCreatorPreview(); });

updateContinueButton();
updateCreatorPreview();
