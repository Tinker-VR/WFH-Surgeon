/**
 * WFH SURGEON — Render: Screen States (menu, playing, store, resolution, help)
 */

function drawScreenMenu() {
    const M = MONITOR;
    ctx.save();
    ctx.beginPath(); ctx.roundRectPolyfill(M.sx, M.uiY, M.sw, M.uiH, 4); ctx.clip();
    drawRect(M.sx, M.uiY, M.sw, M.uiH, 'rgba(8,18,35,0.95)');
    const cy = M.uiY + M.uiH/2;
    drawText('Work-From-Home Surgeon', M.sx+M.sw/2, cy - 32, 40, '#FFF', 'center', 'rgba(0,0,0,0.5)', 4);
    const btnW = 175, btnH = 40, gap = 15;
    const total = btnW*3+gap*2;
    const bx0 = M.sx + (M.sw - total)/2;
    const by = cy - 5;
    drawButton('START', bx0, by, btnW, btnH, COLORS.green, 20, true);
    drawButton('SHOP', bx0+btnW+gap, by, btnW, btnH, COLORS.gold, 20);
    drawButton('HELP', bx0+(btnW+gap)*2, by, btnW, btnH, '#1976D2', 20);
    drawText('Created by Michael at Tinker Studio', M.sx+M.sw/2, M.uiY+M.uiH-15, 16, '#667', 'center', null, 0, 'normal');
    ctx.restore();
}

function drawScreenPlaying() {
    const M = MONITOR;
    const now = performance.now();
    ctx.save();
    ctx.beginPath(); ctx.roundRectPolyfill(M.sx, M.uiY, M.sw, M.uiH, 4); ctx.clip();
    drawRect(M.sx, M.uiY, M.sw, M.uiH, 'rgba(8,18,35,0.95)');

    const pad = 12;
    const topY = M.uiY + 6;
    const contentY = topY + 22;
    const contentH = M.uiH - 32;

    // === TOP LINE: Level (bold) + Phase dots ===
    drawText(getRankName(GAME.rank), M.sx + pad + 4, topY + 8, 18, '#DDE4EE', 'left', null, 0, 'bold');
    // Phase dots
    const dotStartX = M.sx + pad + 320;
    for (let i = 0; i < GAME.phasesNeeded; i++) {
        const filled = i < GAME.phasesCompleted;
        const current = i === GAME.phasesCompleted;
        ctx.fillStyle = filled ? COLORS.green : current ? COLORS.gold : '#334';
        ctx.beginPath(); ctx.arc(dotStartX + i * 20, topY + 8, 6, 0, Math.PI*2); ctx.fill();
        if (current) {
            ctx.strokeStyle = COLORS.gold; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(dotStartX + i * 20, topY + 8, 8, 0, Math.PI*2); ctx.stroke();
        }
    }

    // === LEFT PANEL: Hospital Form (operation + patient) ===
    const formX = M.sx + pad;
    const formY = contentY + 4;
    const formW = 260;
    const formH = contentH - 12;
    drawRoundRect(formX, formY, formW, formH, 10, '#111828', '#2A3A4E', 2);
    // Form labels and values
    drawText('OPERATION', formX + 14, formY + 18, 16, '#5A6A80', 'left', null, 0, 'normal');
    drawText(GAME.operationName, formX + 14, formY + 40, 20, '#FFF', 'left', null, 0, 'bold');
    drawText('PATIENT', formX + 14, formY + 64, 16, '#5A6A80', 'left', null, 0, 'normal');
    drawText(GAME.patientName, formX + 14, formY + 84, 18, '#DDE4EE', 'left', null, 0, 'normal');
    // Combo counter
    if (GAME.comboCount >= 2 && GAME.comboTimer > 0) {
        const comboScale = 1 + Math.sin(now / 80) * 0.1;
        const comboColor = GAME.comboCount >= 5 ? '#FF4081' : GAME.comboCount >= 3 ? '#FFD54F' : '#00E676';
        ctx.save(); ctx.translate(formX + formW - 40, formY + formH - 20); ctx.scale(comboScale, comboScale);
        drawText(`${GAME.comboCount}x`, 0, 0, 22, comboColor, 'center', '#000', 4);
        ctx.restore();
    }

    // === CENTER: Ring/Donut Timer ===
    const ringCX = formX + formW + 60;
    const ringCY = formY + formH / 2 + 2;
    const ringR = 42;
    const ringInner = 28;
    const pPct = Math.max(0, GAME.phaseTimer / GAME.phaseTimerMax);
    const ringColor = pPct > 0.5 ? COLORS.green : pPct > 0.2 ? COLORS.gold : COLORS.red;

    // Ring glow
    if (pPct <= 0.2) {
        ctx.shadowColor = COLORS.red; ctx.shadowBlur = 12 + Math.sin(now/150)*6;
    } else {
        ctx.shadowColor = ringColor; ctx.shadowBlur = 6;
    }
    // Background ring
    ctx.beginPath(); ctx.arc(ringCX, ringCY, ringR, 0, Math.PI*2);
    ctx.arc(ringCX, ringCY, ringInner, 0, Math.PI*2, true);
    ctx.fillStyle = '#1A1A2E'; ctx.fill();
    // Filled arc (depletes clockwise from top)
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + Math.PI * 2 * pPct;
    ctx.beginPath(); ctx.arc(ringCX, ringCY, ringR, startAngle, endAngle);
    ctx.arc(ringCX, ringCY, ringInner, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = ringColor; ctx.fill();
    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
    // Medical emoji inside
    const emojiPulse = 1 + Math.sin(now / 400) * 0.06;
    ctx.save(); ctx.translate(ringCX, ringCY); ctx.scale(emojiPulse, emojiPulse);
    drawText(GAME.sequenceEmoji || '💉', 0, 0, 28, '#FFF', 'center');
    ctx.restore();

    // === RIGHT PANEL: Robot Command Sequence ===
    const arrowX = ringCX + ringR + 26;
    const arrowContW = M.sx + M.sw - pad - arrowX;
    const arrowContY = formY;
    const arrowContH = formH;
    drawRoundRect(arrowX, arrowContY, arrowContW, arrowContH, 10, '#111828', '#2A3A4E', 2);
    drawText('ROBOT COMMAND SEQUENCE', arrowX + arrowContW/2, arrowContY + 14, 16, '#5A6A80', 'center', null, 0, 'normal');

    // Arrow keys with horizontal scroll
    const sqW = 48;
    const sqGap = 6;
    const arrowAreaY = arrowContY + 26;
    const arrowAreaH = arrowContH - 32;
    const arrowCenterY2 = arrowAreaY + arrowAreaH / 2;
    const visibleW = arrowContW - 16;
    const totalArrowW = GAME.sequence.length * (sqW + sqGap) - sqGap;

    // Calculate scroll offset to keep current arrow visible
    let scrollOff = 0;
    if (totalArrowW > visibleW) {
        const targetOff = (GAME.currentIndex - 2) * (sqW + sqGap);
        scrollOff = Math.max(0, Math.min(targetOff, totalArrowW - visibleW));
    }

    ctx.save();
    ctx.beginPath();
    ctx.rect(arrowX + 6, arrowContY + 22, visibleW + 4, arrowContH - 26);
    ctx.clip();

    const arrowStartX = arrowX + 8 - scrollOff + (totalArrowW < visibleW ? (visibleW - totalArrowW)/2 : 0);
    for (let i = 0; i < GAME.sequence.length; i++) {
        let bg = '#2A3A4E', txt = '#555', sc = 1;
        if (i < GAME.currentIndex) { bg = COLORS.green; txt = '#000'; }
        else if (i === GAME.currentIndex) {
            bg = COLORS.gold; txt = '#000';
            sc = 1 + Math.sin(now / 100) * 0.08;
            // Glow on current
            ctx.shadowColor = COLORS.gold; ctx.shadowBlur = 10;
        }
        if (i === GAME.currentIndex - 1 && GAME.arrowPopTimer > 0) sc = 1 + (GAME.arrowPopTimer / 100) * 0.2;
        if (GAME.hazard === 'lag') { bg = '#333'; txt = '#444'; }
        const kx = arrowStartX + i * (sqW + sqGap);
        const aw = sqW * sc;
        const ax = kx + (sqW - aw) / 2;
        const ay = arrowCenterY2 - aw / 2;
        drawRoundRect(ax, ay, aw, aw, 10, bg, null);
        drawText(ARROW_SYM[GAME.sequence[i]], kx + sqW / 2, arrowCenterY2, 28 * sc, txt, 'center');
        ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
    }
    ctx.restore();

    // Green flash on phase complete
    if (GAME.greenFlashTimer > 0) {
        ctx.fillStyle = `rgba(0,230,118,${Math.min(0.35, GAME.greenFlashTimer/150)})`;
        ctx.fillRect(M.sx, M.uiY, M.sw, M.uiH);
    }
    ctx.restore();
}

function drawScreenStore() {
    const M = MONITOR;
    ctx.save();
    ctx.beginPath(); ctx.roundRectPolyfill(M.sx, M.sy, M.sw, M.sh, 4); ctx.clip();
    drawRect(M.sx, M.sy, M.sw, M.sh, '#0D1117');

    // Header — clean shop branding
    drawRect(M.sx, M.sy, M.sw, 58, '#161B22');
    drawText('PURCHASE PLUGINS', M.sx+M.sw/2, M.sy+25, 30, '#FFF', 'center');
    drawText('All plugins last ONE ROUND only!', M.sx+M.sw/2, M.sy+48, 16, '#FF9800', 'center', null, 0, 'normal');

    drawButton('\u2190 BACK', M.sx+20, M.sy+14, 110, 38, '#444', 16);

    // NEXT OPERATION button — top-right (only from resolution)
    if (GAME.storeReturnState === 'RESOLUTION') {
        const nextBtnW = 220, nextBtnH = 38;
        const nextBtnX = M.sx + M.sw - 20 - nextBtnW;
        const nextBtnY = M.sy + 14;
        drawButton('NEXT OP \u25B6', nextBtnX, nextBtnY, nextBtnW, nextBtnH, COLORS.green, 18, true);
    }

    // Single-page 4x3 grid — all 11 items
    const cols = 4;
    const cardW = Math.floor((M.sw - 30 - (cols-1)*10) / cols);
    const cardH = 108;
    STORE_ITEMS.forEach((item, i) => {
        const col = i % cols, row = Math.floor(i / cols);
        const ix = M.sx + 15 + col * (cardW + 10);
        const iy = M.sy + 78 + row * 118;
        drawShadowRoundRect(ix, iy, cardW, cardH, 10, '#1A2332', '#2A3A4E', 2);
        drawText(item.icon, ix+28, iy+30, 28, '#FFF', 'center');
        drawText(item.title, ix+50, iy+20, 16, '#FFF', 'left', null, 0, 'bold');
        drawText(item.desc, ix+50, iy+40, 16, '#7889A0', 'left', null, 0, 'normal');
        const isMax = item.consumable && GAME.hearts >= GAME.maxHearts;
        const owned = !item.consumable && GAME.upgrades[item.id];
        const bc = (owned||isMax) ? '#555' : GAME.cash>=item.price ? COLORS.gold : '#555';
        const bt = owned ? 'OWNED' : isMax ? 'FULL' : `$${item.price}`;
        drawButton(bt, ix+cardW/2-50, iy+78, 100, 26, bc, 16);
    });

    ctx.restore();
}

function drawScreenResolution() {
    const M = MONITOR;
    ctx.save();
    ctx.beginPath(); ctx.roundRectPolyfill(M.sx, M.sy, M.sw, M.sh, 4); ctx.clip();
    const isWin = GAME.lastResult === 'WIN';
    drawRect(M.sx, M.sy, M.sw, M.sh, isWin ? '#0D2818' : '#2A0A0A');

    if (GAME.showQuitConfirm) {
        drawShadowRoundRect(M.sx+M.sw/2-210, M.sy+M.sh/2-75, 420, 170, 16, '#1A1A2E', '#555', 2);
        drawText('ARE YOU SURE?', M.sx+M.sw/2, M.sy+M.sh/2-38, 34, COLORS.red, 'center');
        drawText('Quitting resets all progress.', M.sx+M.sw/2, M.sy+M.sh/2, 18, '#AAA', 'center', null, 0, 'normal');
        const qx = M.sx+M.sw/2-210;
        drawButton('YES, QUIT', qx+30, M.sy+M.sh/2+28, 170, 52, COLORS.red, 20);
        drawButton('NO, STAY', qx+220, M.sy+M.sh/2+28, 170, 52, '#555', 20);
        ctx.restore(); return;
    }

    const titleIcon = isWin ? '\u2705' : '\u274C';
    let title = isWin ? 'OPERATION SUCCESS' : GAME.lastResult==='AWAKE' ? 'PATIENT WOKE UP' : 'MALPRACTICE LAWSUIT';
    drawText(titleIcon, M.sx+M.sw/2, M.sy+55, 56, '#FFF', 'center');
    drawText(title, M.sx+M.sw/2, M.sy+105, 42, '#FFF', 'center', 'rgba(0,0,0,0.5)', 3);

    if (isWin) {
        drawText(`BASE: +$${200+GAME.rank*100}   HEARTS: +$${GAME.hearts*(50+GAME.rank*10)}   SPEED: +$${Math.floor((GAME.anesthesia/1000)*10)}`, M.sx+M.sw/2, M.sy+155, 18, '#AAA', 'center', null, 0, 'normal');
        drawText(`TOTAL PAYOUT: $${GAME.payout}`, M.sx+M.sw/2, M.sy+200, 44, COLORS.green, 'center', 'rgba(0,0,0,0.5)', 3);
        drawText(`Rank: ${getRankName(GAME.rank)}`, M.sx+M.sw/2, M.sy+245, 22, '#6B7A8E', 'center', null, 0, 'normal');
        drawText('Visit the shop or quit.', M.sx+M.sw/2, M.sy+275, 17, '#888', 'center', null, 0, 'normal');
    } else {
        const retryCost = (GAME.rank+1)*300;
        const canAfford = GAME.cash >= retryCost;
        drawText('YOU HAVE BEEN FIRED.', M.sx+M.sw/2, M.sy+155, 28, '#AAA', 'center');
        drawText('PAYOUT: $0', M.sx+M.sw/2, M.sy+195, 32, '#555', 'center');
        if (!canAfford) {
            drawText('Not enough cash to retry!', M.sx+M.sw/2, M.sy+235, 18, COLORS.red, 'center', null, 0, 'normal');
            drawText('Visit the shop or quit.', M.sx+M.sw/2, M.sy+255, 17, '#888', 'center', null, 0, 'normal');
        }
    }

    const btnW=220, btnH=55, gap=30;
    const total2=btnW*2+gap;
    const bx0 = M.sx+(M.sw-total2)/2, by = M.sy+M.sh-80;
    if (isWin) {
        drawButton('OPEN SHOP', bx0, by, btnW, btnH, COLORS.gold, 22, true);
        drawButton('QUIT', bx0+btnW+gap, by, btnW, btnH, COLORS.red, 22);
    } else {
        const retryCost = (GAME.rank+1)*300;
        const canAfford = GAME.cash >= retryCost;
        const rt = canAfford ? `RETRY (-$${retryCost})` : `RETRY ($${retryCost})`;
        const rc = canAfford ? COLORS.gold : '#444';
        drawButton(rt, bx0, by, btnW, btnH, rc, 18, canAfford);
        drawButton('QUIT', bx0+btnW+gap, by, btnW, btnH, COLORS.red, 22);
    }
    ctx.restore();
}

function drawHelpModal() {
    ctx.fillStyle = 'rgba(0,0,0,0.8)'; ctx.fillRect(0, 0, CW, CH);
    const mx = CW/2-360, my = CH/2-280, mw = 720, mh = 560;
    drawShadowRoundRect(mx, my, mw, mh, 18, '#1A1A2E', '#444', 2);
    drawText('HOW TO PLAY', CW/2, my+42, 38, '#FFF', 'center');
    drawButton('\u2715', mx+mw-55, my+12, 42, 38, '#444', 22);

    for (let i = 0; i < 4; i++) {
        ctx.fillStyle = i === GAME.helpPage ? COLORS.green : '#444';
        ctx.beginPath(); ctx.arc(CW/2 - 30 + i*20, my+mh-100, 6, 0, Math.PI*2); ctx.fill();
    }

    const cx = CW/2, cy = my + 220;
    if (GAME.helpPage === 0) {
        drawText('MATCH THE ARROWS', cx, cy-100, 34, COLORS.gold, 'center');
        const keys = ['\u21E7','\u21E9','\u21E6','\u21E8'], colors = [COLORS.green, COLORS.gold, '#2A3A4E', '#2A3A4E'];
        for (let i = 0; i < 4; i++) {
            drawRoundRect(cx-155+i*82, cy-55, 70, 70, 14, colors[i], null);
            drawText(keys[i], cx-155+i*82+35, cy-20, 40, i<2?'#000':'#AAA', 'center');
        }
        drawText('Press arrow keys in order before', cx, cy+45, 22, '#CCC', 'center', null, 0, 'normal');
        drawText('the timer runs out.', cx, cy+78, 22, '#FFF', 'center');
    } else if (GAME.helpPage === 1) {
        drawText('PROTECT YOUR HEARTS', cx, cy-100, 34, COLORS.red, 'center');
        for (let i = 0; i < 3; i++) drawText('\u2764', cx-70+i*70, cy-20, 56, i<2?COLORS.red:'#444', 'center');
        drawText('Wrong keys & timeouts cost hearts.', cx, cy+55, 22, '#CCC', 'center', null, 0, 'normal');
        drawText('Lose all hearts = game over!', cx, cy+88, 22, COLORS.red, 'center');
        drawText('3 perfect sequences in a row = bonus heart!', cx, cy+125, 18, COLORS.green, 'center', null, 0, 'normal');
    } else if (GAME.helpPage === 2) {
        drawText('WFH HAZARDS', cx, cy-110, 34, '#FFA000', 'center');
        const hz1 = [{i:'\uD83D\uDC31',a:'Click 3x'},{i:'\u2615',a:'Click & wipe'},{i:'\uD83D\uDCF6',a:'Smash router'},{i:'\uD83D\uDD0C',a:'Drag plug'}];
        const hzCardW = 82, hzCardH = 72, hzGap = 10;
        const hz1TotalW = 4*hzCardW + 3*hzGap;
        const hz1StartX = cx - hz1TotalW/2;
        for (let i = 0; i < 4; i++) {
            const hx = hz1StartX + i*(hzCardW+hzGap);
            drawRoundRect(hx, cy-75, hzCardW, hzCardH, 12, '#2A3A4E', null);
            drawText(hz1[i].i, hx+hzCardW/2, cy-75+hzCardH/2-8, 28, '#FFF', 'center');
            drawText(hz1[i].a, hx+hzCardW/2, cy-75+hzCardH+14, 16, '#AAA', 'center', null, 0, 'normal');
        }
        const hz2 = [{i:'\uD83D\uDCBC',a:'Close popup'},{i:'\uD83D\uDD27',a:'Fix screws'},{i:'\uD83E\uDDA0',a:'Zap viruses'}];
        const hz2TotalW = 3*hzCardW + 2*hzGap;
        const hz2StartX = cx - hz2TotalW/2;
        for (let i = 0; i < 3; i++) {
            const hx = hz2StartX + i*(hzCardW+hzGap);
            drawRoundRect(hx, cy+25, hzCardW, hzCardH, 12, '#2A3A4E', null);
            drawText(hz2[i].i, hx+hzCardW/2, cy+25+hzCardH/2-8, 28, '#FFF', 'center');
            drawText(hz2[i].a, hx+hzCardW/2, cy+25+hzCardH+14, 16, '#AAA', 'center', null, 0, 'normal');
        }
        drawText('Deal with interruptions to get back to surgery!', cx, cy+140, 19, '#CCC', 'center', null, 0, 'normal');
    } else {
        drawText('EARN & UPGRADE', cx, cy-100, 34, COLORS.gold, 'center');
        drawText('\uD83D\uDCB0', cx, cy-30, 66, '#FFF', 'center');
        drawText('Complete operations to earn cash.', cx, cy+45, 22, '#CCC', 'center', null, 0, 'normal');
        drawText('Spend it at the shop for plugins!', cx, cy+78, 22, COLORS.gold, 'center');
        drawText('Upgrades reset each shift.', cx, cy+115, 17, '#777', 'center', null, 0, 'normal');
    }

    if (GAME.helpPage > 0) drawButton('\u2190 PREV', mx+25, my+mh-65, 110, 44, '#444', 18);
    if (GAME.helpPage < 3) drawButton('NEXT \u2192', mx+mw-135, my+mh-65, 110, 44, '#444', 18);
    drawButton(GAME.pendingStart ? 'START OPERATION' : 'CLOSE', CW/2-130, my+mh-70, 260, 50, GAME.pendingStart ? COLORS.green : '#555', 22, GAME.pendingStart);
}
