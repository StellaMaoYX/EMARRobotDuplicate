/* ═══════════════════════════════════════════════════════════════════════════
 * FLEXI Activity System
 * Implements: drag-and-drop sequencing, vocabulary audio, robot feedback,
 * teacher controls, visual scaffolding, and static content ingestion.
 * ═══════════════════════════════════════════════════════════════════════════ */

// ── Sample Activities ──────────────────────────────────────────────────────
// Each activity has items in correct order; they are shuffled on load.
// Set image: to a URL string to show a picture alongside the word/sentence.
const ACTIVITIES = [
  {
    id: 0,
    title: 'Life Cycle of a Butterfly',
    instruction: 'Put these steps in the correct order!',
    topic: 'Life Cycles',
    successPhrase: 'You got the butterfly life cycle in the right order!',
    items: [
      { text: 'A butterfly lays eggs on a leaf.',         image: null },
      { text: 'The eggs hatch into tiny caterpillars.',   image: null },
      { text: 'The caterpillar forms a chrysalis.',       image: null },
      { text: 'A butterfly emerges from the chrysalis!',  image: null },
    ],
  },
  {
    id: 1,
    title: 'The Hungry Cat',
    instruction: 'Unscramble the sentence! Drag the words into the right order.',
    topic: 'Sentences',
    successPhrase: 'The cat sat on the mat!',
    items: [
      { text: 'The',  image: null },
      { text: 'cat',  image: null },
      { text: 'sat',  image: null },
      { text: 'on',   image: null },
      { text: 'the',  image: null },
      { text: 'mat',  image: null },
    ],
  },
  {
    id: 2,
    title: 'Desert Habitat',
    instruction: 'Order these habitat facts from smallest to biggest idea.',
    topic: 'Habitats',
    successPhrase: 'Fantastic! You know so much about desert habitats!',
    items: [
      { text: 'A cactus grows in the hot, dry desert.',            image: null },
      { text: 'Lizards and snakes live near the cactus.',          image: null },
      { text: 'Deserts get very little rain each year.',           image: null },
      { text: 'Deserts can be found on every continent on Earth.', image: null },
    ],
  },
  {
    id: 3,
    title: 'Ecosystem Chain',
    instruction: 'Put these living things in order from producer to top predator.',
    topic: 'Ecosystems',
    successPhrase: 'Amazing! You just built a food chain!',
    items: [
      { text: 'Grass gets energy from the sun.',           image: null },
      { text: 'A grasshopper eats the grass.',             image: null },
      { text: 'A frog catches and eats the grasshopper.',  image: null },
      { text: 'A hawk swoops down and eats the frog.',     image: null },
    ],
  },
];

// ── Global State ───────────────────────────────────────────────────────────
let currentActivity  = null;
let currentItems     = [];      // items in display order; each: {...original, origIdx}
let selectedIndex    = null;    // tap-to-move selection
let languageLevel    = 'sentence';
let robotConnected   = false;
let robot            = null;
let resources        = [];
let dragSrcIndex     = null;
let feedbackIsCorrect = false;

const STUCK_PHRASE = "Uh-oh, I'm stuck. Let's try that again!";

// ── Initialization ─────────────────────────────────────────────────────────
function initFlexi() {
  // Optional robot connection via ?robot=N
  const robotParam = new URLSearchParams(window.location.search).get('robot');
  if (robotParam !== null) {
    try {
      robot = new Robot(Number(robotParam));
      Robot.initialize();
      robotConnected = true;
      setRobotStatus(true);
    } catch (e) {
      console.warn('Robot connection failed — running standalone:', e);
      setRobotStatus(false);
    }
  }

  // Populate activity selector
  const sel = document.getElementById('activitySelect');
  ACTIVITIES.forEach((act, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = act.title;
    sel.appendChild(opt);
  });

  loadActivity(0);
}

function setRobotStatus(connected) {
  robotConnected = connected;
  const dot    = document.getElementById('statusDot');
  const text   = document.getElementById('statusText');
  const badge  = document.getElementById('robotBadge');
  if (connected) {
    dot.className   = 'status-dot dot-on';
    text.textContent = 'Robot connected';
    badge.textContent = '🤖 Connected';
  } else {
    dot.className   = 'status-dot dot-off';
    text.textContent = 'Robot not connected (standalone)';
    badge.textContent = '⚠ No robot';
  }
}

// ── Activity Management ────────────────────────────────────────────────────
function loadActivity(index) {
  currentActivity = ACTIVITIES[index];
  selectedIndex   = null;

  // Shuffle items for display
  currentItems = currentActivity.items.map((item, i) => ({ ...item, origIdx: i }));
  shuffle(currentItems);

  document.getElementById('activityTitle').textContent       = currentActivity.title;
  document.getElementById('activityInstruction').textContent = currentActivity.instruction;
  document.getElementById('activitySelect').value            = index;

  renderScaffold();
  renderItems();
  hideFeedback();
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ── Visual Scaffolding ─────────────────────────────────────────────────────
// Blank lines whose width matches each item's character count — gives students
// a spatial clue about which slot each word/sentence belongs in.
function renderScaffold() {
  const container = document.getElementById('scaffoldSlots');
  container.innerHTML = currentActivity.items.map((item, i) => {
    const displayLen = getLevelText(item).length;
    const px = Math.max(28, Math.min(220, displayLen * 10));
    return `
      <div class="scaffold-slot">
        <div class="scaffold-num">${i + 1}</div>
        <div class="scaffold-line" style="width:${px}px;"></div>
      </div>`;
  }).join('');
}

// ── Language Level ─────────────────────────────────────────────────────────
function getLevelText(item) {
  const words = item.text.split(' ');
  if (languageLevel === 'word')   return words.slice(0, 2).join(' ');
  if (languageLevel === 'phrase') return words.slice(0, Math.ceil(words.length / 2)).join(' ');
  return item.text;
}

function setLanguageLevel(level) {
  languageLevel = level;
  document.querySelectorAll('.level-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.level === level)
  );
  renderScaffold();
  renderItems();
}

// ── Item Rendering ─────────────────────────────────────────────────────────
function renderItems() {
  const section = document.getElementById('itemsSection');
  section.innerHTML = '';

  currentItems.forEach((item, i) => {
    const displayText = getLevelText(item);
    const safeText    = displayText.replace(/'/g, '&#39;').replace(/"/g, '&quot;');

    const div = document.createElement('div');
    div.className   = 'word-item';
    div.dataset.idx = i;
    if (i === selectedIndex) div.classList.add('selected');

    div.innerHTML = `
      <span class="drag-handle" title="Drag to reorder">&#8285;</span>
      <span class="item-num">${i + 1}.</span>
      ${item.image ? `<img class="item-img" src="${item.image}" alt="${safeText}">` : ''}
      <button class="item-text-btn" onclick="speakText('${safeText}')" title="Tap to hear">${displayText}</button>
      <button class="speak-btn" onclick="speakText('${safeText}')" title="Listen">&#128266;</button>
      <div class="arrow-btns">
        <button class="arrow-btn" title="Move up"
          onclick="moveItem(${i},${i - 1})"
          ${i === 0 ? 'disabled' : ''}>&#9650;</button>
        <button class="arrow-btn" title="Move down"
          onclick="moveItem(${i},${i + 1})"
          ${i === currentItems.length - 1 ? 'disabled' : ''}>&#9660;</button>
      </div>`;

    // HTML5 Drag & Drop (desktop / Android Chrome)
    div.setAttribute('draggable', 'true');
    div.addEventListener('dragstart',  onDragStart);
    div.addEventListener('dragover',   onDragOver);
    div.addEventListener('dragleave',  onDragLeave);
    div.addEventListener('drop',       onDrop);
    div.addEventListener('dragend',    onDragEnd);

    // Tap-to-select interaction (iPad / touch fallback)
    div.addEventListener('click', (e) => {
      if (e.target.closest('.item-text-btn, .speak-btn, .arrow-btn')) return;
      onItemTap(i);
    });

    section.appendChild(div);
  });
}

// ── Tap-to-Move (iOS / touch) ──────────────────────────────────────────────
function onItemTap(i) {
  if (selectedIndex === null) {
    selectedIndex = i;
  } else if (selectedIndex === i) {
    selectedIndex = null;
  } else {
    swapItems(selectedIndex, i);
    selectedIndex = null;
  }
  renderItems();
}

function swapItems(i, j) {
  [currentItems[i], currentItems[j]] = [currentItems[j], currentItems[i]];
}

// ── Arrow-Button Move ──────────────────────────────────────────────────────
function moveItem(from, to) {
  if (to < 0 || to >= currentItems.length) return;
  const [item] = currentItems.splice(from, 1);
  currentItems.splice(to, 0, item);
  selectedIndex = null;
  renderItems();
}

// ── HTML5 Drag & Drop ──────────────────────────────────────────────────────
function onDragStart(e) {
  dragSrcIndex = Number(e.currentTarget.dataset.idx);
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', String(dragSrcIndex));
}

function onDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('drag-over');
}

function onDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function onDrop(e) {
  e.preventDefault();
  const targetIdx = Number(e.currentTarget.dataset.idx);
  e.currentTarget.classList.remove('drag-over');
  if (dragSrcIndex !== null && dragSrcIndex !== targetIdx) {
    const [item] = currentItems.splice(dragSrcIndex, 1);
    currentItems.splice(targetIdx, 0, item);
    selectedIndex = null;
    renderItems();
  }
}

function onDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  dragSrcIndex = null;
  document.querySelectorAll('.word-item').forEach(el => el.classList.remove('drag-over'));
}

// ── Answer Checking ────────────────────────────────────────────────────────
function checkAnswer() {
  if (!currentActivity) return;
  const correct = currentItems.every((item, i) => item.origIdx === i);

  if (correct) {
    showCorrect();
  } else {
    showStuck();
  }
}

function showCorrect() {
  feedbackIsCorrect = true;

  // Highlight items green
  document.querySelectorAll('.word-item').forEach(el => {
    el.classList.remove('state-incorrect');
    el.classList.add('state-correct');
  });

  // Feedback overlay
  showFeedback(
    'overlay-correct',
    '🎉',
    'Amazing! You got it right!',
    currentActivity.successPhrase,
    'Continue →',
    'btn-continue'
  );

  // Robot: speak success phrase
  sendRobotSpeak(currentActivity.successPhrase);

  // Robot: celebratory neck nod (if motor state is available)
  if (robotConnected && robot && Robot.currentMotorState) {
    try {
      robot.moveNeck(0, 15, 0, 0);
      setTimeout(() => { if (Robot.currentMotorState) robot.moveNeck(0, -15, 0, 0); }, 600);
    } catch (e) { /* graceful — robot may not have neck motors configured */ }
  }

  // Browser TTS fallback (always fires so standalone mode also gives audio)
  speakText(currentActivity.successPhrase);
}

function showStuck() {
  feedbackIsCorrect = false;

  // Subtle shake animation on items
  document.querySelectorAll('.word-item').forEach(el => {
    el.classList.remove('state-correct');
    el.classList.add('state-incorrect');
    setTimeout(() => el.classList.remove('state-incorrect'), 400);
  });

  // Feedback overlay — encouraging, not judgemental
  showFeedback(
    'overlay-stuck',
    '🤔',
    "Hmm, I'm stuck…",
    "Let's try that again!",
    '💪 Try Again',
    'btn-tryagain'
  );

  // Robot: speak stuck phrase (robot physically freezes — no motor commands)
  sendRobotSpeak(STUCK_PHRASE);
  speakText(STUCK_PHRASE);
}

function sendRobotSpeak(text) {
  if (robotConnected) {
    try { Robot._requestRobotAction('speak', { text }); } catch (e) { /* standalone */ }
  }
}

// ── Feedback Overlay ───────────────────────────────────────────────────────
function showFeedback(overlayClass, emoji, title, sub, btnLabel, btnClass) {
  const overlay = document.getElementById('feedbackOverlay');
  overlay.className = `feedback-overlay show ${overlayClass}`;
  document.getElementById('fbEmoji').textContent  = emoji;
  document.getElementById('fbTitle').textContent  = title;
  document.getElementById('fbSub').textContent    = sub;
  const btn = document.getElementById('fbBtn');
  btn.textContent = btnLabel;
  btn.className   = `feedback-action-btn ${btnClass}`;
}

function hideFeedback() {
  document.getElementById('feedbackOverlay').className = 'feedback-overlay';
}

function onFeedbackBtn() {
  hideFeedback();
  if (!feedbackIsCorrect) {
    // "Try Again" — reshuffle and re-render without changing the activity
    teacherTryAgain();
  }
}

// ── Vocabulary Audio (Web Speech API — works offline / behind firewalls) ───
function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utt  = new SpeechSynthesisUtterance(text);
  utt.lang   = 'en-US';
  utt.rate   = 0.88;   // slightly slower for clarity
  utt.pitch  = 1.0;
  window.speechSynthesis.speak(utt);
}

// ── Teacher Controls ───────────────────────────────────────────────────────
function togglePanel() {
  document.getElementById('teacherPanel').classList.toggle('open');
}

function teacherReset() {
  loadActivity(currentActivity.id);
}

function teacherRepeat() {
  if (currentActivity) speakText(currentActivity.instruction);
}

function teacherSkip() {
  const next = (currentActivity.id + 1) % ACTIVITIES.length;
  loadActivity(next);
  document.getElementById('activitySelect').value = next;
}

function teacherTryAgain() {
  currentItems = currentActivity.items.map((item, i) => ({ ...item, origIdx: i }));
  shuffle(currentItems);
  selectedIndex = null;
  hideFeedback();
  renderItems();
  speakText("Let's try that again!");
}

// ── Static Content Ingestion ───────────────────────────────────────────────
function handleUpload(e) {
  Array.from(e.target.files).forEach(file => {
    resources.push({ name: file.name, url: URL.createObjectURL(file), type: file.type });
    renderResources();
  });
  e.target.value = '';   // allow re-upload of same file
}

function addLink() {
  const input = document.getElementById('linkInput');
  const url   = input.value.trim();
  if (!url) return;
  resources.push({ name: url, url, type: 'link' });
  input.value = '';
  renderResources();
}

function removeResource(i) {
  resources.splice(i, 1);
  renderResources();
}

function renderResources() {
  const list = document.getElementById('resourceList');
  list.innerHTML = resources.map((r, i) => `
    <li class="resource-item">
      <a href="${r.url}" target="_blank" rel="noopener">${r.name}</a>
      <button class="resource-remove" onclick="removeResource(${i})" title="Remove">&#10005;</button>
    </li>`).join('');
}

// ── Bootstrap ─────────────────────────────────────────────────────────────
// Try to initialise with Firebase (robot mode); fall back to standalone.
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Config !== 'undefined' && typeof Database !== 'undefined') {
    try {
      const cfg = new Config();
      new Database(cfg.config, initFlexi);
    } catch (e) {
      console.warn('Firebase init failed — running standalone:', e);
      initFlexi();
    }
  } else {
    initFlexi();
  }
});
