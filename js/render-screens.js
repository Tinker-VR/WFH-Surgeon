/**
 * WFH SURGEON — Render: Screen States (menu, playing, store, resolution, help)
 */

function drawScreenMenu() {
    const M = MONITOR;
    ctx.save();
    ctx.beginPath(); ctx.roundRectPolyfill(M.sx, M.uiY, M.sw, M.uiH, 4); ctx.clip();
    drawRect(M.sx, M.uiY, M.sw, M.uiH, 'rgba(8,18,35,0.95)');
    const cy = M.uiY + M.uiH/2;
    drawText('WFH SURGEON', M.sx+M.sw/2, cy - 22, 42, '#FFF', 'center', 'rgba(0,0,0,0.5)', 4);
    const btnW = 200, btnH = 44, gap = 25;
    const total = btnW*3+gap*2;
    const bx0 = M.sx + (M.sw - total)/2;
    const by = cy + 10;
    drawButton('START', bx0, by, btnW, btnH, COLORS.green, 22, true);
    drawButton('SHOP', bx0+btnW+gap, by, btnW, btnH, COLORS.gold, 20);
    drawButton('HELP', bx0+(btnW+gap)*2, by, btnW, btnH, '#1976D2', 22);
    drawText('Vibe coded by Michael at Tinker Studio', M.sx+M.sw/2, M.uiY+M.uiH-6, 11, '#667', 'center', null, 0, 'normal');
    ctx.restore();
}

function drawScreenPlaying() {
    const M = MONITOR;
    ctx.save();
    ctx.beginPath(); ctx.roundRectPolyfill(M.sx, M.uiY, M.sw, M.uiH, 4); ctx.clip();
    drawRect(M.sx, M.uiY, M.sw, M.uiH, 'rgba(8,18,35,0.95)');

    // Info text — combined into one line for more arrow space
    drawText(`${getRankName(GAME.rank)}  ·  Phase ${GAME.phasesCompleted}/${GAME.phasesNeeded}  ·  ${GAME.flavorText}`, M.sx+M.sw/2, M.uiY+14, 15, '#AAB8CC', 'center', null, 0, 'normal');

    // Arrow keys — more vertical space
    const arrowY = M.uiY + 28;
    const maxSqH = M.uiH - 28 - 24;
    const sqW = Math.min(65, maxSqH);
    const sqGap = 8;
    const availW = M.sw - 50;
    const neededW = GAME.sequence.length * (sqW + sqGap) - sqGap;
    const finalSqW = neededW > availW ? Math.floor((availW - (GAME.sequence.length-1)*sqGap) / GAME.sequence.length) : sqW;
    const totalW = GAME.sequence.length * finalSqW + (GAME.sequence.length-1)*sqGap;
    let kx2 = M.sx + (M.sw - totalW)/2;
    const arrowCenterY = arrowY + (maxSqH - finalSqW)/2;

    for (let i = 0; i < GAME.sequence.length; i++) {
        let bg = '#2A3A4E', txt = '#AAA', sc = 1;
        if (i < GAME.currentIndex) { bg = COLORS.green; txt = '#000'; }
        else if (i === GAME.currentIndex) { bg = COLORS.gold; txt = '#000'; sc = 1+Math.sin(performance.now()/100)*0.08; }
        if (i === GAME.currentIndex-1 && GAME.arrowPopTimer > 0) sc = 1+(GAME.arrowPopTimer/100)*0.2;
        if (GAME.hazard === 'lag') { bg = '#333'; txt = '#555'; }
        let aw = finalSqW*sc, ax = kx2+(finalSqW-aw)/2, ay = arrowCenterY+(finalSqW-aw)/2;
        drawRoundRect(ax, ay, aw, aw, 12, bg, null);
        drawText(ARROW_SYM[GAME.sequence[i]], kx2+finalSqW/2, arrowCenterY+finalSqW/2, 34*sc, txt, 'center');
        kx2 += finalSqW + sqGap;
    }

    // Timer bar — color changes green -> gold -> red
    const barY = M.uiY + M.uiH - 20;
    const pPct = Math.max(0, GAME.phaseTimer/GAME.phaseTimerMax);
    let barColor = pPct > 0.5 ? COLORS.green : pPct > 0.2 ? COLORS.gold : COLORS.red;
    drawRoundRect(M.sx+40, barY, M.sw-80, 16, 8, '#1A1A1A', '#333', 2);
    if ((M.sw-88)*pPct > 4) {
        if (pPct <= 0.2) {
            ctx.shadowColor = COLORS.red; ctx.shadowBlur = 8 + Math.sin(performance.now()/150)*4;
        }
        drawRoundRect(M.sx+44, barY+2, (M.sw-88)*pPct, 12, 6, barColor, null);
        ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
    }

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
    drawText('All plugins last ONE ROUND only!', M.sx+M.sw/2, M.sy+48, 15, '#FF9800', 'center', null, 0, 'normal');

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
        drawText(item.title, ix+50, iy+20, 18, '#FFF', 'left');
        drawText(item.desc, ix+50, iy+42, 14, '#7889A0', 'left', null, 0, 'normal');
        const isMax = item.consumable && GAME.hearts >= GAME.maxHearts;
        const owned = !item.consumable && GAME.upgrades[item.id];
        const bc = (owned||isMax) ? '#555' : GAME.cash>=item.price ? COLORS.gold : '#555';
        const bt = owned ? 'OWNED' : isMax ? 'FULL' : `$${item.price}`;
        drawButton(bt, ix+cardW/2-50, iy+78, 100, 26, bc, 14);
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
        drawText('WFH HAZARDS', cx, cy-100, 34, '#FFA000', 'center');
        const hz1 = [{i:'\uD83D\uDC31',a:'Click 3x'},{i:'\u2615',a:'Wipe it'},{i:'\uD83D\uDCF6',a:'Click router'},{i:'\uD83D\uDD0B',a:'Plug in'}];
        for (let i = 0; i < 4; i++) {
            drawRoundRect(cx-165+i*88, cy-55, 72, 72, 12, '#2A3A4E', null);
            drawText(hz1[i].i, cx-165+i*88+36, cy-22, 28, '#FFF', 'center');
            drawText(hz1[i].a, cx-165+i*88+36, cy+10, 11, '#AAA', 'center', null, 0, 'normal');
        }
        const hz2 = [{i:'\uD83D\uDCBC',a:'Close popup'},{i:'\uD83D\uDD27',a:'Fix screws'},{i:'\uD83E\uDDA0',a:'Zap viruses'}];
        for (let i = 0; i < 3; i++) {
            drawRoundRect(cx-120+i*88, cy+30, 72, 72, 12, '#2A3A4E', null);
            drawText(hz2[i].i, cx-120+i*88+36, cy+63, 28, '#FFF', 'center');
            drawText(hz2[i].a, cx-120+i*88+36, cy+95, 11, '#AAA', 'center', null, 0, 'normal');
        }
        drawText('Deal with interruptions to get back to surgery!', cx, cy+130, 19, '#CCC', 'center', null, 0, 'normal');
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
