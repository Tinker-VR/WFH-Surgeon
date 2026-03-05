/**
 * WFH SURGEON — Render: Desk Items (router, mug, keyboard, mouse, tablet, decor)
 */

function drawDeskItems() {
    const dy = DESK_Y;
    const deskH = CH - DESK_Y;

    // === DESK DECOR — draw FIRST so it's BEHIND everything ===

    // Scattered papers (behind keyboard area, not overlapping main items)
    ctx.save(); ctx.translate(320, dy + 155); ctx.rotate(-0.08);
    drawRoundRect(-40, -30, 80, 60, 2, '#FFFDE7', '#E0E0E0', 1);
    ctx.strokeStyle = '#BBDEFB'; ctx.lineWidth = 1;
    for (let ln = 0; ln < 4; ln++) { ctx.beginPath(); ctx.moveTo(-28, -18+ln*12); ctx.lineTo(28, -18+ln*12); ctx.stroke(); }
    ctx.fillStyle = '#E53935'; ctx.fillRect(-40, -30, 4, 60);
    ctx.restore();

    ctx.save(); ctx.translate(230, dy + 165); ctx.rotate(0.15);
    drawRoundRect(-32, -24, 64, 48, 2, '#E3F2FD', '#BBDEFB', 1);
    ctx.strokeStyle = '#90CAF9'; ctx.lineWidth = 1;
    for (let ln = 0; ln < 3; ln++) { ctx.beginPath(); ctx.moveTo(-22, -12+ln*12); ctx.lineTo(22, -12+ln*12); ctx.stroke(); }
    ctx.restore();

    ctx.save(); ctx.translate(860, dy + 158); ctx.rotate(0.12);
    drawRoundRect(-28, -20, 56, 40, 2, '#FFF3E0', '#FFE0B2', 1);
    ctx.strokeStyle = '#FFCC80'; ctx.lineWidth = 1;
    for (let ln = 0; ln < 2; ln++) { ctx.beginPath(); ctx.moveTo(-18, -8+ln*12); ctx.lineTo(18, -8+ln*12); ctx.stroke(); }
    ctx.restore();

    // Sticky notes cluster (between router and mug)
    ctx.save(); ctx.translate(145, dy + 100); ctx.rotate(0.12);
    drawRoundRect(-22, -22, 44, 44, 3, '#FFF176', '#F9A825', 1);
    ctx.strokeStyle = '#E0E0E0'; ctx.lineWidth = 1;
    for (let ln = 0; ln < 3; ln++) { ctx.beginPath(); ctx.moveTo(-14, -8+ln*10); ctx.lineTo(14, -8+ln*10); ctx.stroke(); }
    ctx.restore();

    ctx.save(); ctx.translate(163, dy + 68); ctx.rotate(-0.08);
    drawRoundRect(-20, -20, 40, 40, 3, '#80DEEA', '#00ACC1', 1);
    ctx.strokeStyle = '#B2EBF2'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-12, -6); ctx.lineTo(12, -6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-12, 2); ctx.lineTo(8, 2); ctx.stroke();
    ctx.restore();

    ctx.save(); ctx.translate(130, dy + 140); ctx.rotate(-0.14);
    drawRoundRect(-18, -18, 36, 36, 3, '#F8BBD0', '#EC407A', 1);
    ctx.strokeStyle = '#F48FB1'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-10, -4); ctx.lineTo(10, -4); ctx.stroke();
    ctx.restore();

    // Pen lying on desk
    ctx.save(); ctx.translate(180, dy + 155); ctx.rotate(0.3);
    ctx.strokeStyle = '#1565C0'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(30, 0); ctx.stroke();
    ctx.strokeStyle = '#0D47A1'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(38, 0); ctx.stroke();
    ctx.fillStyle = '#B0BEC5'; ctx.beginPath(); ctx.moveTo(38, -2); ctx.lineTo(44, 0); ctx.lineTo(38, 2); ctx.fill();
    ctx.restore();

    // Another pen (red)
    ctx.save(); ctx.translate(920, dy + 170); ctx.rotate(-0.2);
    ctx.strokeStyle = '#C62828'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-25, 0); ctx.lineTo(25, 0); ctx.stroke();
    ctx.fillStyle = '#B0BEC5'; ctx.beginPath(); ctx.moveTo(25, -2); ctx.lineTo(30, 0); ctx.lineTo(25, 2); ctx.fill();
    ctx.restore();

    // Paper clip
    ctx.save(); ctx.translate(280, dy + 130); ctx.rotate(0.4);
    ctx.strokeStyle = '#B0BEC5'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-5, -8); ctx.lineTo(-5, 8); ctx.arc(-2, 8, 3, Math.PI, 0); ctx.lineTo(1, -5); ctx.arc(-2, -5, 3, 0, Math.PI); ctx.stroke();
    ctx.restore();

    // Eraser
    ctx.save(); ctx.translate(380, dy + 168); ctx.rotate(0.25);
    drawRoundRect(-12, -8, 24, 16, 3, '#F8BBD0', '#EC407A', 1);
    ctx.restore();

    // Tape dispenser
    ctx.save(); ctx.translate(780, dy + 140); ctx.rotate(-0.1);
    drawRoundRect(-20, -12, 40, 24, 4, '#333', '#222', 1);
    ctx.fillStyle = '#90CAF9'; ctx.fillRect(-16, -8, 28, 16);
    ctx.restore();

    // Stapler
    ctx.save(); ctx.translate(950, dy + 100); ctx.rotate(0.08);
    drawRoundRect(-30, -8, 60, 16, 4, '#C62828', '#B71C1C', 2);
    drawRoundRect(-28, -14, 56, 8, 3, '#D32F2F', null);
    ctx.restore();

    // Headphones
    ctx.save(); ctx.translate(110, dy + 180); ctx.rotate(-0.3);
    ctx.strokeStyle = '#333'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0, 0, 28, Math.PI, 0); ctx.stroke();
    drawRoundRect(-32, -5, 14, 22, 5, '#444', '#333', 1);
    drawRoundRect(18, -5, 14, 22, 5, '#444', '#333', 1);
    ctx.restore();

    // Snack wrapper
    ctx.save(); ctx.translate(830, dy + 180); ctx.rotate(0.35);
    drawRoundRect(-22, -10, 44, 20, 3, '#FFD54F', '#FFA000', 1);
    ctx.strokeStyle = '#FF6F00'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-22, -4); ctx.lineTo(-28, -8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(22, -4); ctx.lineTo(28, -8); ctx.stroke();
    ctx.restore();

    // Extra sticky note (green)
    ctx.save(); ctx.translate(750, dy + 70); ctx.rotate(0.06);
    drawRoundRect(-18, -18, 36, 36, 3, '#C5E1A5', '#8BC34A', 1);
    ctx.strokeStyle = '#AED581'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-10, -6); ctx.lineTo(10, -6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-10, 2); ctx.lineTo(6, 2); ctx.stroke();
    ctx.restore();

    // Extra sticky note (yellow)
    ctx.save(); ctx.translate(400, dy + 180); ctx.rotate(-0.12);
    drawRoundRect(-18, -18, 36, 36, 3, '#FFE082', '#FFB300', 1);
    ctx.strokeStyle = '#FFCA28'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-10, -4); ctx.lineTo(10, -4); ctx.stroke();
    ctx.restore();

    // Extra paper (purple-tinted)
    ctx.save(); ctx.translate(700, dy + 170); ctx.rotate(-0.2);
    drawRoundRect(-30, -22, 60, 44, 2, '#F3E5F5', '#CE93D8', 1);
    ctx.strokeStyle = '#BA68C8'; ctx.lineWidth = 1;
    for (let ln = 0; ln < 3; ln++) { ctx.beginPath(); ctx.moveTo(-20, -10+ln*10); ctx.lineTo(20, -10+ln*10); ctx.stroke(); }
    ctx.restore();

    // Green pen
    ctx.save(); ctx.translate(500, dy + 175); ctx.rotate(-0.4);
    ctx.strokeStyle = '#2E7D32'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-22, 0); ctx.lineTo(22, 0); ctx.stroke();
    ctx.fillStyle = '#B0BEC5'; ctx.beginPath(); ctx.moveTo(22, -2); ctx.lineTo(27, 0); ctx.lineTo(22, 2); ctx.fill();
    ctx.restore();

    // Gold paper clip
    ctx.save(); ctx.translate(650, dy + 155); ctx.rotate(-0.3);
    ctx.strokeStyle = '#FFD54F'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-5, -8); ctx.lineTo(-5, 8); ctx.arc(-2, 8, 3, Math.PI, 0); ctx.lineTo(1, -5); ctx.arc(-2, -5, 3, 0, Math.PI); ctx.stroke();
    ctx.restore();

    // Coaster (coffee ring mark) — moved to match new mug position
    ctx.strokeStyle = 'rgba(0,0,0,0.06)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(255, dy + 120, 35, 0, Math.PI*2); ctx.stroke();

    // === ROUTER (top-left, BIGGER, with natural rotation) ===
    const rx = 10, ry = dy + 5;
    const rw = 200, rh = 65;
    ctx.save();
    let rShakeX = 0, rShakeY = 0;
    if (GAME.routerShakeTimer > 0) {
        rShakeX = (Math.random()-0.5) * 8;
        rShakeY = (Math.random()-0.5) * 4;
    }
    ctx.translate(rx + rw/2 + rShakeX, ry + rh/2 + rShakeY);
    ctx.rotate(GAME.deskRotations.router);
    ctx.translate(-(rx + rw/2), -(ry + rh/2));

    drawShadowRoundRect(rx, ry, rw, rh, 10, '#1A1A1A', '#111', 3);
    drawRoundRect(rx+3, ry+3, rw-6, rh-6, 8, '#222', null);
    // Antennas
    drawRoundRect(rx+22, ry-55, 9, 62, 4, '#333', '#222', 2);
    drawRoundRect(rx+rw-31, ry-55, 9, 62, 4, '#333', '#222', 2);
    ctx.fillStyle = '#555'; ctx.beginPath(); ctx.arc(rx+26, ry-58, 8, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(rx+rw-27, ry-58, 8, 0, Math.PI*2); ctx.fill();
    // Center antenna
    drawRoundRect(rx+rw/2-4, ry-42, 8, 48, 4, '#333', '#222', 2);
    ctx.fillStyle = '#555'; ctx.beginPath(); ctx.arc(rx+rw/2, ry-45, 7, 0, Math.PI*2); ctx.fill();
    // Status LEDs
    let lc = '#00E676';
    if (GAME.hazard === 'lag') lc = (Math.floor(performance.now()/200)%2===0) ? '#FF1744' : '#550000';
    ctx.fillStyle = lc;
    ctx.beginPath(); ctx.arc(rx+50, ry+30, 8, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(rx+80, ry+30, 8, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(rx+110, ry+30, 8, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(rx+140, ry+30, 8, 0, Math.PI*2); ctx.fill();
    if (GAME.hazard !== 'lag') {
        ctx.fillStyle = 'rgba(0,230,118,0.15)';
        [50,80,110,140].forEach(xo => { ctx.beginPath(); ctx.arc(rx+xo, ry+30, 14, 0, Math.PI*2); ctx.fill(); });
    }
    drawText('TP-LEAK', rx+rw/2, ry+52, 11, '#444', 'center', null, 0, 'normal');
    if (GAME.routerFlashTimer > 0) {
        ctx.fillStyle = `rgba(255,255,255,${GAME.routerFlashTimer/150})`;
        ctx.roundRectPolyfill(rx, ry, rw, rh, 10); ctx.fill();
    }
    ctx.restore();

    // === MUG (moved right to clear router, with rotation) ===
    const mx2 = 220, my2 = dy + 80;
    const mugW = 75, mugH = 90;
    ctx.save();
    ctx.translate(mx2 + mugW/2, my2 + mugH/2);
    const mugTilt = GAME.hazard === 'coffee' ? -0.4 : 0;
    ctx.rotate(GAME.deskRotations.mug + mugTilt);
    ctx.translate(-(mx2 + mugW/2), -(my2 + mugH/2));
    drawShadowRoundRect(mx2, my2, mugW, mugH, 14, '#FAFAFA', '#E0E0E0', 3);
    ctx.strokeStyle = '#FAFAFA'; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.arc(mx2+mugW, my2+mugH*0.4, 20, -Math.PI*0.45, Math.PI*0.45); ctx.stroke();
    if (GAME.hazard !== 'coffee') {
        ctx.fillStyle = '#3E2723';
        ctx.beginPath(); ctx.ellipse(mx2+mugW/2, my2+10, mugW*0.38, 12, 0, 0, Math.PI*2); ctx.fill();
    }
    // Mug lid (when upgrade active)
    if (GAME.upgrades.mugLid) {
        drawRoundRect(mx2+4, my2-2, mugW-8, 10, 5, '#FFD54F', '#FFA000', 2);
    } else if (GAME.hazard !== 'coffee') {
        // Steam (no lid, no spill)
        ctx.strokeStyle = 'rgba(220,220,220,0.5)'; ctx.lineWidth = 3;
        let so = Math.sin(performance.now()/500)*8;
        ctx.beginPath(); ctx.moveTo(mx2+20, my2-6); ctx.quadraticCurveTo(mx2+26+so, my2-32, mx2+20, my2-55); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mx2+50, my2-4); ctx.quadraticCurveTo(mx2+56-so, my2-30, mx2+50, my2-52); ctx.stroke();
    }
    // Coffee puddle on desk during coffee hazard
    if (GAME.hazard === 'coffee') {
        ctx.fillStyle = 'rgba(62,39,35,0.4)';
        ctx.beginPath(); ctx.ellipse(mx2+mugW+10, my2+mugH-5, 30, 12, 0.3, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();

    // === KEYBOARD (centered, with shake + rotation) — shake ×3 ===
    const kbW = 480, kbH = 120;
    const deskMidZone = CW - 265;
    const kbCenterX = (175 + deskMidZone) / 2;
    const kx = kbCenterX - kbW/2, ky = dy + 38;

    ctx.save();
    let kbShkX = 0, kbShkY = 0;
    if (GAME.kbShakeTimer > 0) {
        const intensity = GAME.kbShakeTimer / 180;
        kbShkX = (Math.random()-0.5) * 18 * intensity;
        kbShkY = (Math.random()-0.5) * 9 * intensity;
    }
    ctx.translate(kbCenterX + kbShkX, ky + kbH/2 + kbShkY);
    ctx.rotate(GAME.deskRotations.keyboard);
    ctx.translate(-kbCenterX, -(ky + kbH/2));

    const kbBroken = GAME.hazard === 'kbbreak';
    const kbGamer = GAME.upgrades.gamerKB && !kbBroken;
    const kbBaseColor = kbBroken ? '#3A1A1A' : kbGamer ? '#0A0A0A' : '#2A2A2A';
    const kbBorderColor = kbBroken ? '#661111' : kbGamer ? '#00E676' : '#1A1A1A';
    if (kbGamer) {
        ctx.shadowColor = '#00E676'; ctx.shadowBlur = 12;
    }
    drawShadowRoundRect(kx, ky, kbW, kbH, 10, kbBaseColor, kbBorderColor, 3);
    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
    drawRoundRect(kx+3, ky+3, kbW-6, kbH-6, 8, kbBroken ? '#332222' : kbGamer ? '#111' : '#333', null);
    const keyPad = 10, keyGap = 3;
    const keysPerRow = [14, 13, 12, 10];
    const rowH = 18, rowGap = 4;
    const keyAreaW = kbW - keyPad*2 - 80;
    for (let row = 0; row < 4; row++) {
        const rowY = ky + keyPad + row * (rowH + rowGap);
        const indent = row * 5;
        const availW = keyAreaW - indent;
        const keyW = (availW - (keysPerRow[row]-1)*keyGap) / keysPerRow[row];
        for (let k = 0; k < keysPerRow[row]; k++) {
            const keyX = kx + keyPad + indent + k * (keyW + keyGap);
            const keyColor = kbBroken ? '#553333' : kbGamer ? '#1A3A1A' : '#444';
            drawRoundRect(keyX, rowY, keyW, rowH, 3, keyColor, kbGamer ? '#00E676' : '#333', 1);
        }
    }
    const spaceY = ky + keyPad + 4*(rowH+rowGap);
    drawRoundRect(kx + keyPad + 80, spaceY, 200, rowH, 5, kbBroken ? '#553333' : kbGamer ? '#1A3A1A' : '#444', kbGamer ? '#00E676' : '#333', 1);

    // Arrow keys cluster
    const arrowArea = kx + kbW - 72;
    const arrowTop = ky + kbH - 58;
    const akSz = 20, akGap2 = 3;
    const akc = GAME.state === 'PLAYING' && !kbBroken ? '#00E676' : '#555';
    drawRoundRect(arrowArea + akSz + akGap2, arrowTop, akSz, akSz, 4, akc, '#222', 1);
    drawText('▲', arrowArea + akSz + akGap2 + akSz/2, arrowTop + akSz/2, 10, '#000', 'center');
    drawRoundRect(arrowArea, arrowTop + akSz + akGap2, akSz, akSz, 4, akc, '#222', 1);
    drawText('◀', arrowArea + akSz/2, arrowTop + akSz*1.5 + akGap2, 10, '#000', 'center');
    drawRoundRect(arrowArea + akSz + akGap2, arrowTop + akSz + akGap2, akSz, akSz, 4, akc, '#222', 1);
    drawText('▼', arrowArea + akSz + akGap2 + akSz/2, arrowTop + akSz*1.5 + akGap2, 10, '#000', 'center');
    drawRoundRect(arrowArea + (akSz + akGap2)*2, arrowTop + akSz + akGap2, akSz, akSz, 4, akc, '#222', 1);
    drawText('▶', arrowArea + (akSz + akGap2)*2 + akSz/2, arrowTop + akSz*1.5 + akGap2, 10, '#000', 'center');

    if (kbBroken && Math.random() > 0.7) {
        ctx.fillStyle = '#FF6F00';
        for (let sp = 0; sp < 3; sp++) {
            ctx.beginPath();
            ctx.arc(kx + 50 + Math.random()*(kbW-100), ky + 10 + Math.random()*(kbH-20), Math.random()*3+1, 0, Math.PI*2);
            ctx.fill();
        }
    }
    ctx.restore();

    // === MOUSE (right of keyboard, with shake + rotation + autonomous drift) ===
    let msx = kx + kbW + 20;
    let msy = ky + kbH/2 - 42;
    if (GAME.state === 'PLAYING') {
        const mt = performance.now() / 1000;
        msx += Math.sin(mt * 0.4 + GAME.deskMousePhaseX) * 18 + Math.sin(mt * 0.9) * 8;
        msy += Math.cos(mt * 0.35 + GAME.deskMousePhaseY) * 14 + Math.cos(mt * 0.7) * 6;
    }
    const msW = 55, msH = 80;
    ctx.save();
    const mouseDriftRot = GAME.state === 'PLAYING' ? Math.sin(performance.now()/2000) * 0.08 : 0;
    ctx.translate(msx + msW/2 + kbShkX*0.5, msy + msH/2 + kbShkY*0.5);
    ctx.rotate(GAME.deskRotations.mouse + mouseDriftRot);
    ctx.translate(-(msx + msW/2), -(msy + msH/2));

    ctx.beginPath();
    ctx.ellipse(msx + msW/2, msy + msH/2, msW/2, msH/2, 0, 0, Math.PI * 2);
    ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 5;
    ctx.fillStyle = '#2A2A2A'; ctx.fill();
    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 2; ctx.stroke();
    ctx.strokeStyle = '#444'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(msx + msW/2, msy + 6); ctx.lineTo(msx + msW/2, msy + msH*0.4); ctx.stroke();
    drawRoundRect(msx + 6, msy + 6, msW/2 - 8, msH*0.3, 6, '#333', null);
    drawRoundRect(msx + msW/2 + 2, msy + 6, msW/2 - 8, msH*0.3, 6, '#303030', null);
    drawRoundRect(msx + msW/2 - 5, msy + 10, 10, 14, 5, '#555', '#444', 1);
    ctx.fillStyle = GAME.state === 'PLAYING' ? 'rgba(0,230,118,0.6)' : 'rgba(100,100,100,0.3)';
    ctx.beginPath(); ctx.arc(msx + msW/2, msy + msH - 12, 5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#333'; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(msx + msW/2, msy);
    ctx.quadraticCurveTo(msx + msW/2, msy - 22, msx + msW/2 - 18, msy - 35);
    ctx.quadraticCurveTo(msx - 8, msy - 50, msx - 25, msy - 40);
    ctx.stroke();
    ctx.restore();

    // === TABLET / iPad (right side, with rotation) ===
    const px = CW - 265, py = dy + 2;
    const tw = 258, th = deskH - 8;
    ctx.save();
    ctx.translate(px + tw/2, py + th/2);
    ctx.rotate(GAME.deskRotations.tablet);
    ctx.translate(-(px + tw/2), -(py + th/2));

    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 15; ctx.shadowOffsetY = 6;
    drawRoundRect(px, py, tw, th, 18, '#3A3A3C', null);
    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    drawRoundRect(px+2, py+2, tw-4, th-4, 16, '#2C2C2E', null);
    drawRoundRect(px+7, py+10, tw-14, th-20, 8, '#0D1B2A', null);
    ctx.fillStyle = '#1C1C1E'; ctx.beginPath(); ctx.arc(px + tw/2, py + 6, 3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#0A0A0A'; ctx.beginPath(); ctx.arc(px + tw/2, py + 6, 1.5, 0, Math.PI*2); ctx.fill();
    drawRoundRect(px + tw/2 - 30, py + th - 8, 60, 3, 2, '#555', null);

    // Bank app
    const bankH = 40;
    const bankPulse = (GAME.state === 'STORE' || (GAME.state === 'RESOLUTION' && GAME.lastResult === 'WIN'));
    if (bankPulse) {
        const glow = Math.abs(Math.sin(performance.now() / 300));
        ctx.shadowColor = '#4CAF50';
        ctx.shadowBlur = 8 + glow * 18;
    }
    drawRoundRect(px + 14, py + 18, tw - 28, bankH, 8, '#1B5E20', '#2E7D32', 2);
    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
    drawText('💰', px + 30, py + 38, 16, '#FFF', 'center');
    const cashStr = '$' + GAME.cash;
    const cashSize = bankPulse ? 24 + Math.sin(performance.now()/200)*2 : 24;
    drawText(cashStr, px + tw/2 + 10, py + 38, cashSize, '#FFF', 'center');

    // Installed plugins section
    const plugY = py + 18 + bankH + 6;
    const plugH = th - bankH - 40;
    drawRoundRect(px + 14, plugY, tw - 28, plugH, 8, '#1A2332', '#2A3A4E', 2);
    drawText('PLUGINS', px + tw/2, plugY + 14, 11, '#6B7A8E', 'center', null, 0, 'normal');
    let apps = [];
    Object.entries(GAME.upgrades).forEach(([k,v]) => { if(v) { const it = STORE_ITEMS.find(i=>i.id===k); if(it) apps.push({icon: it.icon, name: it.title}); }});
    if (apps.length === 0) {
        drawText('None', px + tw/2, plugY + plugH/2, 14, '#444', 'center', null, 0, 'normal');
    } else {
        for (let i = 0; i < apps.length && i < 10; i++) {
            const col = i % 5, row = Math.floor(i / 5);
            const ix = px + 18 + col * 44;
            const iy = plugY + 26 + row * 38;
            drawRoundRect(ix, iy, 36, 32, 6, '#263248', '#3A4A5E', 1);
            drawText(apps[i].icon, ix + 18, iy + 16, 16, '#FFF', 'center');
        }
    }
    ctx.restore();

    // Cat tail moved to drawCatTailBehind() — drawn before monitor in main.js

    // === ETHERNET CABLE (router to monitor) — black, thick, loopy ===
    if (GAME.upgrades.ethernet) {
        const cableStartX = 210, cableStartY = dy + 37;
        const cableEndX = MONITOR.x + MONITOR.w/2, cableEndY = MONITOR.y + MONITOR.h;
        // RJ45 connector at router end
        drawRoundRect(cableStartX - 4, cableStartY - 6, 8, 12, 2, '#333', '#222', 1);
        // Outer cable — black, thick, with loops
        ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 10; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cableStartX, cableStartY);
        ctx.bezierCurveTo(250, dy + 80, 300, dy + 85, 340, dy + 30);
        ctx.bezierCurveTo(380, dy - 15, 420, dy + 70, 460, dy + 20);
        ctx.bezierCurveTo(500, dy - 20, 540, dy + 40, cableEndX, cableEndY);
        ctx.stroke();
        // Inner highlight — dark gray
        ctx.strokeStyle = '#333'; ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(cableStartX, cableStartY);
        ctx.bezierCurveTo(250, dy + 80, 300, dy + 85, 340, dy + 30);
        ctx.bezierCurveTo(380, dy - 15, 420, dy + 70, 460, dy + 20);
        ctx.bezierCurveTo(500, dy - 20, 540, dy + 40, cableEndX, cableEndY);
        ctx.stroke();
        // RJ45 connector at monitor end
        drawRoundRect(cableEndX - 4, cableEndY - 6, 8, 12, 2, '#333', '#222', 1);
    }

    // === ENERGY CAN (next to mug when energy_time active) — bigger, realistic ===
    if (GAME.upgrades.energy_time) {
        const ecx = 295, ecy = dy + 58;
        ctx.save();
        ctx.translate(ecx + 22, ecy + 38);
        ctx.rotate(0.05);
        ctx.translate(-(ecx + 22), -(ecy + 38));
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath(); ctx.ellipse(ecx + 22, ecy + 76, 20, 6, 0, 0, Math.PI*2); ctx.fill();
        // Can body
        drawShadowRoundRect(ecx, ecy, 44, 76, 8, '#004D40', '#00251A', 2);
        // Green stripe
        drawRoundRect(ecx + 4, ecy + 18, 36, 30, 4, '#00C853', null);
        // Lightning bolt
        drawText('\u26A1', ecx + 22, ecy + 33, 28, '#FFD54F', 'center');
        // Brand text
        drawText('MONSTER', ecx + 22, ecy + 56, 8, '#76FF03', 'center', null, 0, 'bold');
        // Silver rim top
        drawRoundRect(ecx + 2, ecy, 40, 8, 4, '#B0BEC5', '#78909C', 1);
        // Pull tab
        ctx.fillStyle = '#90A4AE';
        ctx.beginPath(); ctx.ellipse(ecx + 22, ecy + 2, 8, 3, 0, 0, Math.PI*2); ctx.fill();
        // Condensation droplets
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath(); ctx.arc(ecx + 10, ecy + 42, 2, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(ecx + 34, ecy + 50, 1.5, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(ecx + 14, ecy + 60, 2, 0, Math.PI*2); ctx.fill();
        ctx.restore();
    }
}

// Cat tail — drawn BEFORE monitor frame so it appears behind
function drawCatTailBehind() {
    if (GAME.upgrades.treats) return;
    const tailT = performance.now() / 1000;
    const M = MONITOR;
    const tailBaseX = M.x + M.w + 15;
    const tailBaseY = DESK_Y + 5;
    // Main tail — thick, curving upward
    ctx.strokeStyle = '#FFA000'; ctx.lineWidth = 14; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(tailBaseX, tailBaseY);
    for (let i = 1; i <= 12; i++) {
        const ty = tailBaseY - i * 14;
        const tx = tailBaseX + Math.sin(tailT * 2.5 + i * 0.45) * (10 + i * 2);
        ctx.lineTo(tx, ty);
    }
    ctx.stroke();
    // Tabby stripes
    ctx.strokeStyle = '#E65100'; ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(tailBaseX + Math.sin(tailT * 2.5 + 1.35) * 13, tailBaseY - 42);
    for (let i = 3; i <= 10; i++) {
        const ty = tailBaseY - i * 14;
        const tx = tailBaseX + Math.sin(tailT * 2.5 + i * 0.45) * (10 + i * 2);
        if (i % 3 === 0) { ctx.moveTo(tx, ty); } else { ctx.lineTo(tx, ty); }
    }
    ctx.stroke();
    // Fur tip at end — small flick
    const tipI = 12;
    const tipY = tailBaseY - tipI * 14;
    const tipX = tailBaseX + Math.sin(tailT * 2.5 + tipI * 0.45) * (10 + tipI * 2);
    ctx.strokeStyle = '#FF8F00'; ctx.lineWidth = 10; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX + Math.sin(tailT * 3) * 8, tipY - 12);
    ctx.stroke();
}
