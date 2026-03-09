/**
 * WFH SURGEON — Canvas, Game State & Helpers
 */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = true;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

const CW = 1280;
const CH = 720;

const GAME = {
    state: 'MENU',
    storeReturnState: 'MENU',
    showQuitConfirm: false,
    pendingStart: false,
    cash: STARTING_CASH,
    rank: STARTING_RANK,
    highestRank: STARTING_RANK,
    upgrades: { ...DEFAULT_UPGRADES },
    flavorText: "",
    operationName: '',
    patientName: '',
    hearts: 3, maxHearts: 3,
    anesthesia: 100, anesthesiaMax: 100,
    phaseTimer: 0, phaseTimerMax: 5000,
    sequence: [], currentIndex: 0,
    phasesCompleted: 0, phasesNeeded: 10,
    perfectStreak: 0,
    redFlashTimer: 0, greenFlashTimer: 0, shakeTimer: 0, arrowPopTimer: 0,
    armReach: 0, armGlitchTimer: 0, bloodSpills: [],
    hazard: null, hazardTimer: 0, hazardNextSpawn: 0,
    catClicks: 0,
    catFlashTimer: 0,
    catStars: [],
    adPos: {x:0, y:0, w: 420, h: 220},
    adIndex: 0,
    batteryDrag: false,
    plugPos: {x: 0, y: 0}, socketPos: {x: 0, y: 0},
    dimLevel: 0, coffeeWipe: 0, coffeeWiping: false,
    routerClicks: 0, routerFlashTimer: 0, routerSmashAnim: 0,
    inputBuffer: [],
    lastResult: 'WIN', payout: 0,
    mouseX: CW/2, mouseY: CH/2,
    lastMouseX: 0, lastMouseY: 0,
    mouseIdleTimer: 0,
    helpPage: 0, helpPageCount: 4,
    notifications: [],
    paused: false,
    muteBtn: { x: CW - 50, y: 10, w: 36, h: 28 },
    pauseBtn: { x: CW - 95, y: 10, w: 36, h: 28 },
    pauseQuitConfirm: false,
    sequenceEmoji: '💉',
    comboCount: 0,
    comboTimer: 0,
    screenFlashTimer: 0,
    screenFlashColor: '',
    hazardSpawnFlash: 0,
    kbShakeTimer: 0,
    routerShakeTimer: 0,
    kbScrews: [false, false, false, false],
    hasScrewdriver: false,
    screwdriverPos: {x: 0, y: 0},
    virusIcons: [],
    virusesClicked: 0,
    adCloseCorner: 0,
    lastTimerWarnTime: 0,
    lastAnesWarnTime: 0,
    deskMousePhaseX: Math.random() * Math.PI * 2,
    deskMousePhaseY: Math.random() * Math.PI * 2,
    deskRotations: {
        router: -0.02,
        mug: 0.03,
        keyboard: 0.008,
        mouse: -0.015,
        tablet: 0.005
    }
};

function addNotification(text, icon = '', duration = 2000) {
    GAME.notifications.push({ text, icon, timer: duration, maxTimer: duration });
    AudioEngine.playNotification();
}

function getKBScrewPositions() {
    const kbW = 480, kbH = 120;
    const deskMidZone = CW - 265;
    const kbCenterX = (175 + deskMidZone) / 2;
    const kx = kbCenterX - kbW/2, ky = DESK_Y + 38;
    return [
        {x: kx + 18, y: ky + 18},
        {x: kx + kbW - 18, y: ky + 18},
        {x: kx + 18, y: ky + kbH - 18},
        {x: kx + kbW - 18, y: ky + kbH - 18}
    ];
}

function updateMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    GAME.mouseX = (e.clientX - rect.left) * (CW / rect.width);
    GAME.mouseY = (e.clientY - rect.top) * (CH / rect.height);
}
