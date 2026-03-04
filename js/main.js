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
        GAME.anesthesia -= dt * drainRate;
        GAME.phaseTimer -= dt * drainRate;
        GAME.hazardTimer += dt;
        if (GAME.routerFlashTimer > 0) GAME.routerFlashTimer -= dt;
        if (GAME.routerShakeTimer > 0 && GAME.hazard !== 'lag') GAME.routerShakeTimer -= dt;
        if (GAME.kbShakeTimer > 0) GAME.kbShakeTimer -= dt;
        if (GAME.armReach > 0) GAME.armReach = Math.max(0, GAME.armReach - dt*0.12);
        if (GAME.armGlitchTimer > 0) GAME.armGlitchTimer -= dt;
        if (GAME.catFlashTimer > 0) GAME.catFlashTimer -= dt;
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
    }

    if (GAME.arrowPopTimer > 0) GAME.arrowPopTimer -= dt;
    if (GAME.greenFlashTimer > 0) GAME.greenFlashTimer -= dt;

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
    drawDeskItems();
    drawHazards();
    drawNotifications(dt);
    if (GAME.state === 'HELP') drawHelpModal();

    if (GAME.redFlashTimer > 0) {
        GAME.redFlashTimer -= dt;
        ctx.fillStyle = `rgba(255,0,0,${Math.min(0.6, GAME.redFlashTimer/150)})`;
        ctx.fillRect(0, 0, CW, CH);
    }
    if (GAME.dimLevel > 0) {
        ctx.save();
        ctx.beginPath(); ctx.roundRectPolyfill(MONITOR.sx, MONITOR.sy, MONITOR.sw, MONITOR.sh, 4); ctx.clip();
        ctx.fillStyle = `rgba(0,0,0,${GAME.dimLevel})`; ctx.fillRect(MONITOR.sx, MONITOR.sy, MONITOR.sw, MONITOR.sh);
        ctx.restore();
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
