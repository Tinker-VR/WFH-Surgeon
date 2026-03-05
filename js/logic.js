/**
 * WFH SURGEON — Game Logic
 */

function processArrow(code) {
    GAME.kbShakeTimer = 180;
    if (code === GAME.sequence[GAME.currentIndex]) {
        GAME.currentIndex++;
        GAME.arrowPopTimer = 100;
        GAME.armReach = Math.min(300, GAME.armReach + 80);
        AudioEngine.playCorrectKey();
        // energy_anes healing removed — drain reduction handled in main loop
        if (GAME.currentIndex >= GAME.sequence.length) { GAME.armReach = 300; chunkComplete(); }
    } else {
        if (!DEBUG_GOD_MODE) GAME.hearts--;
        GAME.redFlashTimer = 150; GAME.shakeTimer = 300; GAME.perfectStreak = 0;
        AudioEngine.playWrongKey(); GAME.armGlitchTimer = 800;
        for (let b = 0; b < 20; b++) GAME.bloodSpills.push({ x: (Math.random()*300)-150, y: (Math.random()*60)-30, r: Math.random()*18+6 });
        if (!DEBUG_GOD_MODE && GAME.hearts <= 0) triggerResolution('MALPRACTICE');
    }
}

function resetHospitalAnimations() {
    GAME.redFlashTimer=0; GAME.greenFlashTimer=0; GAME.shakeTimer=0; GAME.arrowPopTimer=0;
    GAME.bloodSpills=[]; GAME.armGlitchTimer=0; GAME.armReach=0; GAME.kbShakeTimer=0;
    GAME.catFlashTimer=0; GAME.catStars=[];
}

function startOperation() {
    GAME.hazard=null; GAME.dimLevel=0; GAME.catClicks=0; GAME.coffeeWipe=0;
    GAME.routerClicks=0; GAME.inputBuffer=[]; GAME.batteryDrag=false;
    GAME.kbScrews=[false,false,false,false]; GAME.hasScrewdriver=false;
    GAME.virusIcons=[]; GAME.virusesClicked=0; GAME.routerShakeTimer=0;
    GAME.catFlashTimer=0; GAME.catStars=[]; GAME.mouseIdleTimer=0;
    GAME.lastTimerWarnTime=0; GAME.lastAnesWarnTime=0;
    resetHospitalAnimations();
    GAME.maxHearts = GAME.upgrades.lawyer ? 4 : 3;
    if (GAME.hearts > GAME.maxHearts) GAME.hearts = GAME.maxHearts;
    GAME.anesthesiaMax = (50 - GAME.rank*1.1)*1000;
    // energy_anes: drain rate reduction handled in main loop (no max boost)
    GAME.anesthesia = GAME.anesthesiaMax;
    GAME.phaseTimerMax = 9500 - GAME.rank*250;
    if (GAME.upgrades.energy_time) GAME.phaseTimerMax *= 1.4;
    GAME.phasesNeeded = 3 + Math.floor(GAME.rank*0.5);
    GAME.phasesCompleted = 0; GAME.perfectStreak = 0;
    GAME.flavorText = `${PROCEDURES[Math.floor(Math.random()*PROCEDURES.length)]} | ${PATIENTS[Math.floor(Math.random()*PATIENTS.length)]}`;
    GAME.hazardTimer = 0;
    const hfMin = 8000 - GAME.rank*350, hfMax = 12000 - GAME.rank*450;
    GAME.hazardNextSpawn = hfMin + Math.random()*(hfMax - hfMin);
    GAME.routerFlashTimer = 0;
    generateSequence(5 + Math.floor(GAME.rank * 0.45));
    GAME.state = 'PLAYING';
    AudioEngine.setBGMMode('gameplay');
}

function generateSequence(len) {
    GAME.sequence = [];
    for (let i = 0; i < len; i++) GAME.sequence.push(ARROWS[Math.floor(Math.random()*4)]);
    GAME.currentIndex = 0; GAME.phaseTimer = GAME.phaseTimerMax;
}

function chunkComplete() {
    GAME.phasesCompleted++; GAME.perfectStreak++; GAME.greenFlashTimer = 200;
    AudioEngine.playPhaseComplete();
    addNotification(`Sequence ${GAME.phasesCompleted}/${GAME.phasesNeeded}`, '✅', 1500);
    if (GAME.perfectStreak >= 3 && GAME.hearts < GAME.maxHearts) {
        GAME.hearts++; GAME.perfectStreak = 0;
        addNotification('+1 Heart! (3x Perfect)', '❤️', 2000);
    }
    if (GAME.phasesCompleted >= GAME.phasesNeeded) triggerResolution('WIN');
    else generateSequence(5 + Math.floor(GAME.rank*0.45));
}

function spawnHazard() {
    if (DEBUG_FORCE_HAZARD) {
        GAME.hazard = DEBUG_FORCE_HAZARD;
    } else {
        let pool = [];
        if (!GAME.upgrades.adBlock) pool.push('ad');
        if (!GAME.upgrades.powerBank) pool.push('battery');
        if (!GAME.upgrades.ethernet) pool.push('lag');
        if (!GAME.upgrades.mugLid) pool.push('coffee');
        if (!GAME.upgrades.treats) pool.push('cat');
        if (!GAME.upgrades.gamerKB) pool.push('kbbreak');
        if (!GAME.upgrades.antivirus) pool.push('malware');
        if (!pool.length) return;
        GAME.hazard = pool[Math.floor(Math.random()*pool.length)];
    }
    GAME.coffeeWipe = 0; GAME.routerClicks = 0;
    if (GAME.hazard === 'cat') { GAME.catClicks = 0; GAME.catFlashTimer = 0; GAME.catStars = []; AudioEngine.playCatMeow(); }
    if (GAME.hazard === 'ad') {
        const M = MONITOR;
        GAME.adPos.w = M.sw - 40;
        GAME.adPos.h = M.sh - 30;
        GAME.adPos.x = M.sx + 20;
        GAME.adPos.y = M.sy + 15;
        GAME.adIndex = Math.floor(Math.random() * CHEEKY_ADS.length);
        GAME.adCloseCorner = Math.floor(Math.random() * 4);
    }
    if (GAME.hazard === 'battery') {
        GAME.dimLevel=0; GAME.batteryDrag=false;
        const M = MONITOR;
        GAME.plugPos = {x: M.sx + 50, y: M.sy + M.sh/2};
        GAME.socketPos = {x: M.sx + M.sw - 50, y: M.sy + M.sh/2};
        AudioEngine.playBatteryWarning();
    }
    if (GAME.hazard === 'lag') { AudioEngine.playWifiStatic(); GAME.routerShakeTimer = 999999; }
    if (GAME.hazard === 'coffee') AudioEngine.playCoffeeSplash();
    if (GAME.hazard === 'kbbreak') {
        GAME.kbScrews = [false, false, false, false];
        GAME.hasScrewdriver = false;
        GAME.screwdriverPos = { x: 250, y: DESK_Y + 120 };
        AudioEngine.playKBBreak();
    }
    if (GAME.hazard === 'malware') {
        GAME.virusIcons = [];
        GAME.virusesClicked = 0;
        const M = MONITOR;
        for (let i = 0; i < 5; i++) {
            GAME.virusIcons.push({
                x: M.sx + 60 + Math.random() * (M.sw - 120),
                y: M.sy + 60 + Math.random() * (M.sh - 120),
                vx: (Math.random()-0.5)*300,
                vy: (Math.random()-0.5)*300,
                alive: true
            });
        }
        AudioEngine.playMalwareAlert();
    }
}

function clearHazard() {
    GAME.hazard = null; GAME.coffeeWipe = 0; GAME.dimLevel = 0;
    GAME.routerShakeTimer = 0;
    GAME.kbScrews = [false,false,false,false]; GAME.hasScrewdriver = false;
    GAME.virusIcons = []; GAME.virusesClicked = 0;
    GAME.catFlashTimer = 0; GAME.catStars = [];
    const hfMin = 8000 - GAME.rank*350, hfMax = 12000 - GAME.rank*450;
    GAME.hazardNextSpawn = hfMin + Math.random()*(hfMax - hfMin);
}

function triggerResolution(result) {
    GAME.state = 'RESOLUTION'; GAME.lastResult = result;
    GAME.hazard = null; GAME.dimLevel = 0; GAME.inputBuffer = []; GAME.paused = false;
    GAME.routerShakeTimer = 0; GAME.kbShakeTimer = 0;
    GAME.catFlashTimer = 0; GAME.catStars = [];
    if (result === 'WIN') {
        if (GAME.rank < 14) GAME.rank++;
        const base = 200 + GAME.rank*100;
        const hb = GAME.hearts*(50 + GAME.rank*10);
        const tb = Math.floor((GAME.anesthesia/1000)*10);
        GAME.payout = base + hb + tb; GAME.cash += GAME.payout;
        AudioEngine.playLevelComplete();
        addNotification('Operation Success!', '🎉', 2500);
        if (GAME.rank > GAME.highestRank) { GAME.highestRank = GAME.rank; addNotification('Promoted to ' + getRankName(GAME.rank) + '!', '⭐', 3000); }
    } else { GAME.payout = 0; AudioEngine.playLevelFail(); }
    GAME.upgrades = { ...DEFAULT_UPGRADES };
    AudioEngine.setBGMMode('gameover');
}
