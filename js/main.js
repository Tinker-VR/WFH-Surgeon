/**
 * WFH SURGEON — Main Game Loop + Cursor
 */

let lastTime = performance.now();

function loop(timestamp) {
    const dt = timestamp - lastTime; lastTime = timestamp;
    ctx.clearRect(0, 0, CW, CH);

    if (GAME.state === 'PLAYING' && !GAME.paused) {
        // Hazard slowdown mechanic: slow drain during active hazards
        let drainRate = 1;
        if (GAME.hazard) {
            drainRate = 0.2 + (GAME.rank / 14) * 0.7;
        }
        const anesDrainMult = GAME.upgrades.energy_anes ? 0.6 : 1;
        GAME.anesthesia -= dt * drainRate * anesDrainMult;
        GAME.phaseTimer -= dt * drainRate;
        GAME.hazardTimer += dt;
        if (GAME.routerFlashTimer > 0) GAME.routerFlashTimer -= dt;
        if (GAME.routerShakeTimer > 0 && GAME.hazard !== 'lag') GAME.routerShakeTimer -= dt;
        if (GAME.kbShakeTimer > 0) GAME.kbShakeTimer -= dt;
        if (GAME.armReach > 0) GAME.armReach = Math.max(0, GAME.armReach - dt*0.12);
        if (GAME.armGlitchTimer > 0) GAME.armGlitchTimer -= dt;
        if (GAME.catFlashTimer > 0) GAME.catFlashTimer -= dt;
        if (GAME.routerSmashAnim > 0) GAME.routerSmashAnim -= dt;
        if (GAME.comboTimer > 0) GAME.comboTimer -= dt;
        if (GAME.screenFlashTimer > 0) GAME.screenFlashTimer -= dt;
        if (GAME.hazardSpawnFlash > 0) GAME.hazardSpawnFlash -= dt;
        // Heartbeat at low anesthesia
        if (GAME.anesthesia / GAME.anesthesiaMax < 0.3 && GAME.anesthesia > 0) {
            if (!GAME._lastHeartbeat || timestamp - GAME._lastHeartbeat > 600) {
                GAME._lastHeartbeat = timestamp;
                AudioEngine.playHeartbeat();
            }
        }
        // Update cat star particles
        GAME.catStars = GAME.catStars.filter(s => {
            s.x += s.vx * dt / 1000;
            s.y += s.vy * dt / 1000;
            s.life -= dt;
            return s.life > 0;
        });
        GAME.mouseIdleTimer += dt;
        if (GAME.inputBuffer.length > 0 && timestamp >= GAME.inputBuffer[0].time) processArrow(GAME.inputBuffer.shift().code);
        if (GAME.hazard === 'battery') GAME.dimLevel = Math.min(0.95, GAME.dimLevel + dt*0.0001);
        // Virus movement
        if (GAME.hazard === 'malware') {
            const M = MONITOR;
            GAME.virusIcons.forEach(v => {
                if (!v.alive) return;
                v.x += v.vx * dt / 1000;
                v.y += v.vy * dt / 1000;
                if (v.x < M.sx + 40 || v.x > M.sx + M.sw - 40) v.vx *= -1;
                if (v.y < M.sy + 40 || v.y > M.sy + M.sh - 40) v.vy *= -1;
                v.x = Math.max(M.sx + 40, Math.min(M.sx + M.sw - 40, v.x));
                v.y = Math.max(M.sy + 40, Math.min(M.sy + M.sh - 40, v.y));
            });
        }
        // Keyboard hazard: continuous shake (fixing is click-based in input.js)
        if (GAME.hazard === 'kbbreak') {
            GAME.kbShakeTimer = 200;
        }
        if (!DEBUG_GOD_MODE && GAME.anesthesia <= 0) triggerResolution('AWAKE');
        if (GAME.phaseTimer <= 0) {
            if (!DEBUG_GOD_MODE) GAME.hearts--;
            GAME.redFlashTimer=150; GAME.shakeTimer=300; GAME.perfectStreak=0;
            GAME.phaseTimer=GAME.phaseTimerMax; GAME.armGlitchTimer=800;
            for (let b=0;b<20;b++) GAME.bloodSpills.push({x:(Math.random()*300)-150,y:(Math.random()*60)-30,r:Math.random()*18+6});
            if (!DEBUG_GOD_MODE && GAME.hearts<=0) triggerResolution('MALPRACTICE');
        }
        if (GAME.state==='PLAYING' && !GAME.hazard && GAME.hazardTimer > GAME.hazardNextSpawn) { spawnHazard(); GAME.hazardTimer=0; }
        AudioEngine.updateEKG(timestamp, Math.max(0, GAME.anesthesia/GAME.anesthesiaMax), GAME.hearts, GAME.maxHearts);
        // Timer warning sounds
        if (GAME.phaseTimer / GAME.phaseTimerMax < 0.2 && timestamp - GAME.lastTimerWarnTime > 500) {
            GAME.lastTimerWarnTime = timestamp;
            AudioEngine.playTimerWarning();
        }
        if (GAME.anesthesia / GAME.anesthesiaMax < 0.15 && timestamp - GAME.lastAnesWarnTime > 800) {
            GAME.lastAnesWarnTime = timestamp;
            AudioEngine.playAnesthesiaWarning();
        }
    }

    if (GAME.arrowPopTimer > 0) GAME.arrowPopTimer -= dt;
    if (GAME.greenFlashTimer > 0) GAME.greenFlashTimer -= dt;
    if (GAME.yellowFlashTimer > 0) GAME.yellowFlashTimer -= dt;
    if (GAME.shopFlashTimer > 0) GAME.shopFlashTimer -= dt;

    let shakeX=0, shakeY=0;
    if (GAME.shakeTimer > 0) {
        GAME.shakeTimer -= dt;
        shakeX = (Math.random()-0.5)*12*(GAME.shakeTimer/300);
        shakeY = (Math.random()-0.5)*12*(GAME.shakeTimer/300);
    }

    ctx.save();
    if (GAME.shakeTimer > 0) ctx.translate(shakeX, shakeY);

    drawBackground();
    drawMonitorFrame();
    drawORScene();

    if (GAME.state === 'MENU') {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.save(); ctx.beginPath(); ctx.roundRectPolyfill(MONITOR.sx, MONITOR.sy, MONITOR.sw, MONITOR.orH, 4); ctx.clip();
        ctx.fillRect(MONITOR.sx, MONITOR.sy, MONITOR.sw, MONITOR.orH); ctx.restore();
        drawScreenMenu();
    }
    else if (GAME.state === 'STORE') drawScreenStore();
    else if (GAME.state === 'PLAYING') drawScreenPlaying();
    else if (GAME.state === 'RESOLUTION') drawScreenResolution();

    drawMonitorEffects();

    // Dimmer (battery hazard) — draw before hazards so hazard UI is visible on top
    if (GAME.dimLevel > 0) {
        ctx.save();
        ctx.beginPath(); ctx.roundRectPolyfill(MONITOR.sx, MONITOR.sy, MONITOR.sw, MONITOR.sh, 4); ctx.clip();
        ctx.fillStyle = `rgba(0,0,0,${GAME.dimLevel})`; ctx.fillRect(MONITOR.sx, MONITOR.sy, MONITOR.sw, MONITOR.sh);
        ctx.restore();
    }

    drawCatTailBehind();
    drawDeskItems();
    drawHazards();
    if (GAME.state === 'HELP') drawHelpModal();

    if (GAME.redFlashTimer > 0) {
        GAME.redFlashTimer -= dt;
        ctx.fillStyle = `rgba(255,0,0,${Math.min(0.6, GAME.redFlashTimer/150)})`;
        ctx.fillRect(0, 0, CW, CH);
    }

    // Yellow flash for perfect sequence bonus heart
    if (GAME.yellowFlashTimer > 0) {
        const alpha = Math.min(0.35, GAME.yellowFlashTimer / 400 * 0.35);
        ctx.fillStyle = `rgba(255,213,79,${alpha})`;
        ctx.fillRect(0, 0, CW, CH);
    }

    // Correct arrow green screen flash
    if (GAME.screenFlashTimer > 0) {
        const alpha = Math.min(0.15, GAME.screenFlashTimer / 100 * 0.15);
        ctx.strokeStyle = `rgba(0,230,118,${alpha})`;
        ctx.lineWidth = 6;
        ctx.strokeRect(3, 3, CW-6, CH-6);
    }

    // Hazard spawn orange border flash
    if (GAME.hazardSpawnFlash > 0) {
        const alpha = Math.min(0.3, GAME.hazardSpawnFlash / 300 * 0.3);
        ctx.strokeStyle = `rgba(255,152,0,${alpha})`;
        ctx.lineWidth = 8;
        ctx.strokeRect(2, 2, CW-4, CH-4);
    }

    ctx.restore();
    drawMuteButton();
    drawPauseOverlay();
    drawPauseButton();

    // Cursor with idle wiggle
    let cursorX = GAME.mouseX, cursorY = GAME.mouseY;
    if (GAME.state === 'PLAYING' && GAME.mouseIdleTimer > 500) {
        const t = performance.now();
        cursorX += Math.sin(t / 800) * 3;
        cursorY += Math.cos(t / 600) * 3;
    }
    ctx.fillStyle='#FFF'; ctx.strokeStyle='#000'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(cursorX, cursorY);
    ctx.lineTo(cursorX+14, cursorY+14); ctx.lineTo(cursorX+6, cursorY+16);
    ctx.lineTo(cursorX, cursorY+24); ctx.closePath(); ctx.fill(); ctx.stroke();

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
