/**
 * WFH SURGEON — Render: Background, Monitor, OR Scene, Patient, Arms
 */

function drawBackground() {
    drawRect(0, 0, CW, CH, COLORS.wallBg);
    ctx.strokeStyle = COLORS.wallAccent; ctx.lineWidth = 1;
    for (let i = 0; i < CW; i += 100) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, DESK_Y); ctx.stroke(); }
    let dg = ctx.createLinearGradient(0, DESK_Y, 0, CH);
    dg.addColorStop(0, COLORS.deskSurface); dg.addColorStop(0.08, COLORS.deskEdge); dg.addColorStop(1, COLORS.deskShadow);
    ctx.fillStyle = dg; ctx.fillRect(0, DESK_Y, CW, CH - DESK_Y);
    drawRect(0, DESK_Y, CW, 4, '#D4C4A8');
    let ds = ctx.createLinearGradient(0, DESK_Y, 0, DESK_Y + 20);
    ds.addColorStop(0, 'rgba(0,0,0,0.15)'); ds.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = ds; ctx.fillRect(0, DESK_Y, CW, 20);
}

function drawMonitorFrame() {
    const M = MONITOR;
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
    drawRoundRect(M.x, M.y, M.w, M.h, M.radius, COLORS.monitorBezel, null);
    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    drawRoundRect(M.x+3, M.y+3, M.w-6, M.h-6, M.radius-2, '#252525', null);
    drawRoundRect(M.sx, M.sy, M.sw, M.sh, 4, COLORS.monitorScreen, null);
    drawRect(M.x+M.w/2 - M.standW/2, M.y+M.h, M.standW, M.standH, '#2D2D2D');
    drawRoundRect(M.x+M.w/2 - M.baseW/2, M.y+M.h+M.standH, M.baseW, M.baseH, 3, '#333', '#222', 2);
    ctx.fillStyle = GAME.state === 'PLAYING' ? '#00E676' : '#4CAF50';
    ctx.beginPath(); ctx.arc(M.x+M.w/2, M.y+M.h-8, 4, 0, Math.PI*2); ctx.fill();
    drawText('LG (Laundering Gray)', M.x+M.w/2, M.y+M.h-8, 10, '#444', 'center', null, 0, 'normal');
}

function drawMonitorEffects() {
    const M = MONITOR;
    // Scanlines
    ctx.fillStyle = 'rgba(0,0,0,0.025)';
    for (let i = M.sy; i < M.sy+M.sh; i += 3) ctx.fillRect(M.sx, i, M.sw, 1);
    // CRT scrolling bar
    ctx.save();
    ctx.beginPath(); ctx.rect(M.sx, M.sy, M.sw, M.sh); ctx.clip();
    const crtCycle = 4000;
    const crtProgress = (performance.now() % crtCycle) / crtCycle;
    const crtBarY = M.sy + crtProgress * (M.sh + 35) - 35;
    const crtBarGrad = ctx.createLinearGradient(M.sx, crtBarY, M.sx, crtBarY + 35);
    crtBarGrad.addColorStop(0, 'rgba(255,255,255,0)');
    crtBarGrad.addColorStop(0.5, 'rgba(255,255,255,0.08)');
    crtBarGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = crtBarGrad;
    ctx.fillRect(M.sx, crtBarY, M.sw, 35);
    ctx.restore();
    // Vignette
    const vg = ctx.createRadialGradient(M.sx+M.sw/2, M.sy+M.sh/2, M.sw*0.4, M.sx+M.sw/2, M.sy+M.sh/2, M.sw*0.65);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.12)');
    ctx.fillStyle = vg; ctx.fillRect(M.sx, M.sy, M.sw, M.sh);
}

function drawORScene() {
    const M = MONITOR;
    ctx.save();
    ctx.beginPath(); ctx.roundRectPolyfill(M.sx, M.sy, M.sw, M.orH, 4); ctx.clip();

    const orBot = M.sy + M.orH;
    // Wall with subtle gradient
    const wallGrad = ctx.createLinearGradient(M.sx, M.sy, M.sx, orBot - 70);
    wallGrad.addColorStop(0, '#D5EDE8'); wallGrad.addColorStop(1, COLORS.orWall);
    ctx.fillStyle = wallGrad; ctx.fillRect(M.sx, M.sy, M.sw, M.orH);
    // Wall tile lines
    ctx.strokeStyle = '#C8DDD8'; ctx.lineWidth = 1;
    for (let i = M.sx; i < M.sx+M.sw; i += 60) { ctx.beginPath(); ctx.moveTo(i, M.sy); ctx.lineTo(i, orBot-70); ctx.stroke(); }
    for (let j = M.sy; j < orBot-70; j += 40) { ctx.beginPath(); ctx.moveTo(M.sx, j); ctx.lineTo(M.sx+M.sw, j); ctx.stroke(); }
    // Baseboard
    drawRect(M.sx, orBot-73, M.sw, 6, '#90A4AE');
    // Floor with tile pattern
    const floorGrad = ctx.createLinearGradient(M.sx, orBot-67, M.sx, orBot);
    floorGrad.addColorStop(0, '#A8CCC4'); floorGrad.addColorStop(1, COLORS.orFloor);
    ctx.fillStyle = floorGrad; ctx.fillRect(M.sx, orBot - 67, M.sw, 67);
    ctx.strokeStyle = '#9CC0B6'; ctx.lineWidth = 1;
    for (let i = M.sx; i < M.sx+M.sw; i += 50) {
        ctx.beginPath(); ctx.moveTo(i, orBot-67); ctx.lineTo(i-20, orBot); ctx.stroke();
    }

    const lx = M.sx + M.sw/2;

    // === GLASS CABINET (left wall) — BIGGER ===
    const cabX = M.sx + 8, cabY = M.sy + 12, cabW = 85, cabH = M.orH * 0.55;
    drawRoundRect(cabX, cabY, cabW, cabH, 5, '#CFD8DC', '#90A4AE', 2);
    ctx.fillStyle = 'rgba(200,220,230,0.25)';
    ctx.fillRect(cabX+4, cabY+4, cabW-8, cabH-8);
    for (let s = 1; s < 4; s++) {
        const shelfY = cabY + s * (cabH/4);
        ctx.strokeStyle = '#B0BEC5'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cabX+4, shelfY); ctx.lineTo(cabX+cabW-4, shelfY); ctx.stroke();
        // Bigger bottles
        ctx.fillStyle = ['#EF5350','#42A5F5','#66BB6A','#FFA726'][s-1];
        ctx.fillRect(cabX+10, shelfY-18, 10, 18);
        ctx.fillStyle = '#78909C';
        ctx.fillRect(cabX+26, shelfY-14, 8, 14);
        ctx.fillStyle = '#AB47BC';
        ctx.fillRect(cabX+42, shelfY-20, 10, 20);
        ctx.fillStyle = '#4FC3F7';
        ctx.fillRect(cabX+58, shelfY-12, 8, 12);
    }
    // Cabinet handle
    ctx.strokeStyle = '#78909C'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cabX+cabW-12, cabY+cabH/2-12); ctx.lineTo(cabX+cabW-12, cabY+cabH/2+12); ctx.stroke();

    // === HAND SANITIZER DISPENSER (left wall) ===
    const sanX = M.sx + 100, sanY = M.sy + 18;
    drawRoundRect(sanX, sanY, 26, 40, 5, '#E8F5E9', '#A5D6A7', 1);
    drawRoundRect(sanX + 7, sanY - 10, 12, 14, 4, '#C8E6C9', '#81C784', 1);
    ctx.strokeStyle = '#A5D6A7'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(sanX + 13, sanY - 10); ctx.lineTo(sanX + 13, sanY - 16); ctx.lineTo(sanX + 21, sanY - 16); ctx.stroke();
    drawText('🧴', sanX + 13, sanY + 20, 14, '#FFF', 'center');

    // === WALL CLOCK (animated) ===
    const clockX = M.sx + M.sw/2 + 120, clockY = M.sy + 26;
    ctx.fillStyle = '#ECEFF1'; ctx.strokeStyle = '#90A4AE'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(clockX, clockY, 26, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    for (let h = 0; h < 12; h++) {
        const cAngle = (h / 12) * Math.PI * 2 - Math.PI/2;
        ctx.fillStyle = '#546E7A';
        ctx.beginPath(); ctx.arc(clockX + Math.cos(cAngle)*20, clockY + Math.sin(cAngle)*20, 2, 0, Math.PI*2); ctx.fill();
    }
    const clockNow = performance.now() / 1000;
    const minuteAngle = (clockNow / 60) * Math.PI * 2 - Math.PI/2;
    const hourAngle = (clockNow / 720) * Math.PI * 2 - Math.PI/2;
    ctx.strokeStyle = '#37474F'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(clockX, clockY); ctx.lineTo(clockX + Math.cos(hourAngle)*14, clockY + Math.sin(hourAngle)*14); ctx.stroke();
    ctx.strokeStyle = '#546E7A'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(clockX, clockY); ctx.lineTo(clockX + Math.cos(minuteAngle)*20, clockY + Math.sin(minuteAngle)*20); ctx.stroke();
    ctx.fillStyle = '#37474F';
    ctx.beginPath(); ctx.arc(clockX, clockY, 3, 0, Math.PI*2); ctx.fill();

    // === GLASS CABINET (right wall) — BIGGER ===
    const cab2X = M.sx + M.sw - 93;
    drawRoundRect(cab2X, cabY, cabW, cabH, 5, '#CFD8DC', '#90A4AE', 2);
    ctx.fillStyle = 'rgba(200,220,230,0.25)';
    ctx.fillRect(cab2X+4, cabY+4, cabW-8, cabH-8);
    for (let s = 1; s < 4; s++) {
        const shelfY = cabY + s * (cabH/4);
        ctx.strokeStyle = '#B0BEC5'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cab2X+4, shelfY); ctx.lineTo(cab2X+cabW-4, shelfY); ctx.stroke();
        ctx.fillStyle = '#E0E0E0'; ctx.fillRect(cab2X+10, shelfY-16, 16, 16);
        ctx.fillStyle = '#FFB74D'; ctx.fillRect(cab2X+32, shelfY-12, 8, 12);
        ctx.fillStyle = '#4FC3F7'; ctx.fillRect(cab2X+48, shelfY-18, 10, 18);
        ctx.fillStyle = '#EF9A9A'; ctx.fillRect(cab2X+64, shelfY-14, 8, 14);
    }

    // === BLOOD BAG / IV POLE (right side) — BIGGER ===
    const ivX = M.sx + M.sw - 125, ivBaseY = orBot - 55;
    ctx.strokeStyle = '#B0BEC5'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(ivX, ivBaseY); ctx.lineTo(ivX, M.sy + 18); ctx.stroke();
    // Cross bar
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(ivX - 22, M.sy + 18); ctx.lineTo(ivX + 22, M.sy + 18); ctx.stroke();
    // Hook
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(ivX - 8, M.sy + 24, 6, Math.PI, 0); ctx.stroke();
    // Blood bag — BIGGER
    drawRoundRect(ivX - 20, M.sy + 32, 32, 48, 8, '#C62828', '#B71C1C', 2);
    drawText('A+', ivX - 4, M.sy + 56, 14, '#FFCDD2', 'center', null, 0, 'normal');
    // Tube
    ctx.strokeStyle = '#EF9A9A'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ivX - 4, M.sy + 80); ctx.quadraticCurveTo(ivX + 14, M.sy + 115, ivX - 35, orBot - 30); ctx.stroke();
    // Tripod base
    ctx.strokeStyle = '#B0BEC5'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(ivX, ivBaseY); ctx.lineTo(ivX - 20, orBot-2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ivX, ivBaseY); ctx.lineTo(ivX + 20, orBot-2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ivX, ivBaseY); ctx.lineTo(ivX, orBot-2); ctx.stroke();

    // === DEFIBRILLATOR / CRASH CART (right side) ===
    const ccX = M.sx + M.sw - 185, ccBaseY = orBot - 62;
    drawRoundRect(ccX, ccBaseY, 55, 52, 6, '#455A64', '#37474F', 2);
    // Defib screen
    drawRoundRect(ccX + 5, ccBaseY + 5, 24, 18, 3, '#000', null);
    ctx.strokeStyle = '#00E676'; ctx.lineWidth = 1;
    const defibEkg = (performance.now()/15) % 24;
    ctx.beginPath();
    ctx.moveTo(ccX+5, ccBaseY+14); ctx.lineTo(ccX+5+defibEkg/2, ccBaseY+14);
    ctx.lineTo(ccX+5+defibEkg/2+3, ccBaseY+8); ctx.lineTo(ccX+5+defibEkg/2+6, ccBaseY+20);
    ctx.lineTo(ccX+5+defibEkg/2+9, ccBaseY+14); ctx.lineTo(ccX+29, ccBaseY+14);
    ctx.stroke();
    // Paddles
    drawRoundRect(ccX+34, ccBaseY+6, 16, 16, 4, '#FF6F00', '#E65100', 1);
    drawText('⚡', ccX+42, ccBaseY+14, 10, '#FFF', 'center');
    // Wheels
    ctx.fillStyle = '#333';
    ctx.beginPath(); ctx.arc(ccX + 10, ccBaseY + 55, 5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ccX + 45, ccBaseY + 55, 5, 0, Math.PI*2); ctx.fill();

    // === MAYO STAND (instrument table, left of patient) — BIGGER ===
    const mayoX = lx - 220, mayoTopY = orBot - 52;
    ctx.strokeStyle = '#B0BEC5'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(mayoX, mayoTopY + 20); ctx.lineTo(mayoX, orBot - 2); ctx.stroke();
    // Base
    ctx.beginPath(); ctx.moveTo(mayoX - 14, orBot - 2); ctx.lineTo(mayoX + 14, orBot - 2); ctx.stroke();
    // Tray — BIGGER
    drawRoundRect(mayoX - 45, mayoTopY, 90, 20, 5, '#CFD8DC', '#90A4AE', 2);
    // Instruments on tray
    ctx.strokeStyle = '#78909C'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(mayoX - 28, mayoTopY); ctx.lineTo(mayoX - 28, mayoTopY - 16); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mayoX - 12, mayoTopY); ctx.lineTo(mayoX - 8, mayoTopY - 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mayoX + 5, mayoTopY); ctx.lineTo(mayoX + 5, mayoTopY - 14); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mayoX + 20, mayoTopY); ctx.lineTo(mayoX + 24, mayoTopY - 12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mayoX + 34, mayoTopY); ctx.lineTo(mayoX + 34, mayoTopY - 18); ctx.stroke();
    // Scalpel blade highlight
    ctx.fillStyle = '#E0E0E0';
    ctx.beginPath(); ctx.moveTo(mayoX - 30, mayoTopY - 16); ctx.lineTo(mayoX - 26, mayoTopY - 16); ctx.lineTo(mayoX - 28, mayoTopY - 8); ctx.fill();

    // === INSTRUMENT TRAY (right of patient) — BIGGER ===
    const trayX = lx + 180, trayY = orBot - 32;
    drawRoundRect(trayX - 40, trayY, 80, 14, 4, '#CFD8DC', '#90A4AE', 1);
    // Instruments
    ctx.fillStyle = '#78909C';
    ctx.fillRect(trayX - 24, trayY - 8, 4, 8);
    ctx.fillRect(trayX - 12, trayY - 10, 4, 10);
    ctx.fillRect(trayX + 4, trayY - 7, 4, 7);
    ctx.fillRect(trayX + 18, trayY - 9, 4, 9);
    ctx.fillRect(trayX + 30, trayY - 6, 4, 6);

    // === SHADOWS ON FLOOR — BIGGER ===
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(lx, orBot - 3, 200, 12, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(mayoX, orBot - 1, 22, 6, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(ivX, orBot - 1, 24, 6, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(ccX + 27, orBot - 1, 22, 5, 0, 0, Math.PI*2); ctx.fill();

    // Lamp
    const lampX = lx;
    drawRoundRect(lampX-18, M.sy-5, 36, 35, 10, '#90A4AE', '#546E7A', 2);
    ctx.fillStyle = '#ECEFF1'; ctx.strokeStyle = '#78909C'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(lampX, M.sy+22, 70, Math.PI, 0); ctx.fill(); ctx.stroke();
    // Lamp bulbs
    for (let lb = -2; lb <= 2; lb++) {
        ctx.fillStyle = '#FFF9C4';
        ctx.beginPath(); ctx.arc(lampX + lb*20, M.sy+18, 5, 0, Math.PI*2); ctx.fill();
    }
    let lg = ctx.createLinearGradient(lampX, M.sy+22, lampX, orBot);
    lg.addColorStop(0, 'rgba(255,255,240,0.18)'); lg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = lg;
    ctx.beginPath(); ctx.moveTo(lampX-65, M.sy+22); ctx.lineTo(lampX+65, M.sy+22); ctx.lineTo(lampX+150, orBot); ctx.lineTo(lampX-150, orBot); ctx.fill();

    // Heart monitor
    const hmx = M.sx+80, hmy = M.sy+15;
    drawShadowRoundRect(hmx, hmy, 95, 72, 10, '#37474F', '#263238', 2);
    drawRoundRect(hmx+6, hmy+6, 83, 38, 5, '#000');
    ctx.strokeStyle = '#00E676'; ctx.lineWidth = 2;
    let ekg = (performance.now()/12) % 83;
    ctx.beginPath();
    ctx.moveTo(hmx+6, hmy+26); ctx.lineTo(hmx+6+ekg/2, hmy+26);
    ctx.lineTo(hmx+6+ekg/2+5, hmy+12); ctx.lineTo(hmx+6+ekg/2+10, hmy+38);
    ctx.lineTo(hmx+6+ekg/2+15, hmy+26); ctx.lineTo(hmx+89, hmy+26);
    ctx.stroke();
    ctx.fillStyle = (Math.floor(performance.now()/300)%2===0) ? '#00E676' : '#1B5E20';
    ctx.beginPath(); ctx.arc(hmx+78, hmy+56, 5, 0, Math.PI*2); ctx.fill();
    drawText('HR', hmx+12, hmy+56, 10, '#4CAF50', 'left', null, 0, 'normal');
    drawText('SpO2', hmx+12, hmy+66, 10, '#42A5F5', 'left', null, 0, 'normal');
    drawText('98', hmx+70, hmy+66, 10, '#42A5F5', 'right', null, 0, 'normal');

    // === EKG WIRE from patient to monitor ===
    ctx.strokeStyle = '#66BB6A'; ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(hmx + 47, hmy + 44);
    ctx.quadraticCurveTo(lx - 80, M.sy + M.orH * 0.35, lx - 30, M.sy + M.orH * 0.55);
    ctx.stroke();
    ctx.setLineDash([]);

    // === ROLLING DRAWER CART (left side) ===
    const drawerX = M.sx + 18, drawerBaseY = orBot - 78;
    drawRoundRect(drawerX, drawerBaseY, 60, 68, 6, '#546E7A', '#455A64', 2);
    for (let d = 0; d < 3; d++) {
        drawRoundRect(drawerX+4, drawerBaseY+4+d*20, 52, 16, 3, '#607D8B', '#546E7A', 1);
        drawRoundRect(drawerX+22, drawerBaseY+9+d*20, 16, 6, 2, '#78909C', null);
    }
    ctx.fillStyle = '#333';
    ctx.beginPath(); ctx.arc(drawerX+10, drawerBaseY+72, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(drawerX+50, drawerBaseY+72, 4, 0, Math.PI*2); ctx.fill();

    // === MEDICINE CABINET (left wall, below glass cabinet) ===
    const medCabX = M.sx + 8, medCabY = cabY + cabH + 8;
    drawRoundRect(medCabX, medCabY, 70, 50, 4, '#ECEFF1', '#B0BEC5', 1);
    ctx.strokeStyle = '#B0BEC5'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(medCabX+35, medCabY+4); ctx.lineTo(medCabX+35, medCabY+46); ctx.stroke();
    drawRoundRect(medCabX+14, medCabY+20, 8, 10, 2, '#90A4AE', null);
    drawRoundRect(medCabX+48, medCabY+20, 8, 10, 2, '#90A4AE', null);

    // === WASTE BIN (right side, floor) ===
    const binX = M.sx + M.sw - 55, binY = orBot - 42;
    ctx.fillStyle = '#78909C'; ctx.strokeStyle = '#546E7A'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(binX, binY); ctx.lineTo(binX-4, binY+38); ctx.lineTo(binX+40, binY+38); ctx.lineTo(binX+36, binY); ctx.closePath();
    ctx.fill(); ctx.stroke();
    drawRoundRect(binX-2, binY-4, 40, 6, 2, '#607D8B', '#455A64', 1);

    // === X-RAY LIGHTBOX (wall) ===
    const xrayX = M.sx + M.sw/2 - 180, xrayY = M.sy + 10;
    drawRoundRect(xrayX, xrayY, 55, 40, 4, '#263238', '#37474F', 2);
    drawRoundRect(xrayX+4, xrayY+4, 47, 28, 2, '#1A237E', null);
    ctx.strokeStyle = 'rgba(100,181,246,0.4)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(xrayX+15, xrayY+10); ctx.lineTo(xrayX+15, xrayY+28); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(xrayX+10, xrayY+18); ctx.lineTo(xrayX+20, xrayY+18); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(xrayX+35, xrayY+18, 8, 10, 0, 0, Math.PI*2); ctx.stroke();

    // === OXYGEN TANK (next to IV pole) ===
    const o2X = ivX + 28, o2Y = orBot - 65;
    drawRoundRect(o2X, o2Y, 16, 58, 8, '#42A5F5', '#1E88E5', 2);
    drawRoundRect(o2X+3, o2Y-7, 10, 10, 3, '#78909C', '#546E7A', 1);
    drawText('O2', o2X+8, o2Y+30, 9, '#FFF', 'center', null, 0, 'normal');

    // === SUPPLY SHELF (right wall, near floor) ===
    const shelfX = M.sx + M.sw - 95, shelfY = orBot - 35;
    drawRoundRect(shelfX, shelfY, 35, 8, 2, '#B0BEC5', '#90A4AE', 1);
    drawRoundRect(shelfX+4, shelfY-14, 12, 14, 2, '#E8F5E9', null);
    drawRoundRect(shelfX+18, shelfY-12, 12, 12, 2, '#E3F2FD', null);

    // === CLIPBOARD on wall (near heart monitor) ===
    const clipX = hmx + 100, clipY = M.sy + 18;
    drawRoundRect(clipX, clipY, 30, 40, 3, '#EFEBE9', '#BCAAA4', 1);
    drawRoundRect(clipX+8, clipY-4, 14, 8, 2, '#8D6E63', null);
    ctx.strokeStyle = '#BCAAA4'; ctx.lineWidth = 1;
    for (let cl = 0; cl < 4; cl++) { ctx.beginPath(); ctx.moveTo(clipX+6, clipY+10+cl*7); ctx.lineTo(clipX+24, clipY+10+cl*7); ctx.stroke(); }

    // === GLOVE BOX DISPENSER (wall-mounted, left of clock) ===
    const gloveX = M.sx + M.sw/2 + 50, gloveY = M.sy + 10;
    drawRoundRect(gloveX, gloveY, 50, 30, 4, '#E8F5E9', '#A5D6A7', 1);
    drawRoundRect(gloveX+15, gloveY+22, 20, 12, 3, '#C8E6C9', null);
    drawText('GLOVES', gloveX+25, gloveY+14, 7, '#66BB6A', 'center', null, 0, 'normal');

    // === FIRE EXTINGUISHER BOX (wall-mounted, left side) ===
    const feX = M.sx + 105, feY = M.sy + 65;
    drawRoundRect(feX, feY, 28, 35, 3, '#FFCDD2', '#EF5350', 1);
    drawRoundRect(feX+6, feY+8, 16, 22, 4, '#C62828', '#B71C1C', 1);
    drawText('\uD83E\uDDEF', feX+14, feY+19, 12, '#FFF', 'center');

    // === PAPER TOWEL HOLDER (wall-mounted, right side) ===
    const ptX = M.sx + M.sw - 60, ptY = M.sy + 65;
    drawRoundRect(ptX, ptY, 35, 25, 3, '#ECEFF1', '#B0BEC5', 1);
    drawRoundRect(ptX+4, ptY+8, 27, 14, 6, '#FAFAFA', '#E0E0E0', 1);

    // === SHARPS CONTAINER (wall-mounted, near IV) ===
    const scX = ivX - 50, scY = M.sy + 50;
    drawRoundRect(scX, scY, 22, 28, 3, '#F44336', '#C62828', 1);
    drawText('\u26A0', scX+11, scY+14, 10, '#FFF', 'center');

    // Patient — centered vertically in OR area, bigger
    const patientY = M.sy + M.orH * 0.55;
    drawPatient(lx, patientY);

    // Blood
    ctx.fillStyle = 'rgba(211,47,47,0.8)';
    GAME.bloodSpills.forEach(s => { ctx.beginPath(); ctx.arc(lx+s.x*0.8, patientY+s.y, s.r*0.8, 0, Math.PI*2); ctx.fill(); });

    // Arms — constrained to patient body area
    let speed = GAME.state==='PLAYING' ? 600 : 2000;
    let sway = Math.sin(performance.now()/speed)*12 + Math.sin(performance.now()/(speed*0.7))*GAME.armReach*0.4;
    let sway2 = Math.cos(performance.now()/(speed*0.8))*(8+GAME.armReach*0.35);
    let erratic = GAME.armGlitchTimer > 0;
    const armMinX = lx - 180, armMaxX = lx + 180;
    const armTargetY = patientY - 15;
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    if (erratic) {
        ctx.globalAlpha = 0.15;
        drawArm(M.sx+80, M.sy-10, clamp(lx-80+sway*1.2, armMinX, armMaxX), armTargetY, true, true);
        drawArm(M.sx+M.sw-80, M.sy-10, clamp(lx+80-sway*1.2, armMinX, armMaxX), armTargetY, true, false);
        ctx.globalAlpha = 1;
    }
    drawArm(M.sx+80, M.sy-10, clamp(lx-80+sway, armMinX, armMaxX), armTargetY, erratic, true);
    drawArm(M.sx+180, M.sy-10, clamp(lx-30+sway2, armMinX, armMaxX), armTargetY-5, erratic, true);
    drawArm(M.sx+M.sw-180, M.sy-10, clamp(lx+30-sway2, armMinX, armMaxX), armTargetY-5, erratic, false);
    drawArm(M.sx+M.sw-80, M.sy-10, clamp(lx+80-sway, armMinX, armMaxX), armTargetY, erratic, false);

    // HUD
    if (GAME.state === 'PLAYING' || GAME.state === 'RESOLUTION') {
        drawRoundRect(M.sx+12, M.sy+6, M.sw-24, 44, 12, 'rgba(0,0,0,0.65)', null);
        let hx = M.sx+28;
        for (let i = 0; i < GAME.maxHearts; i++) {
            const isLawyer = GAME.upgrades.lawyer && i === GAME.maxHearts - 1;
            const hColor = i < GAME.hearts ? (isLawyer ? COLORS.gold : COLORS.red) : '#444';
            drawText('\u2764', hx, M.sy+28, 32, hColor, 'left'); hx += 42;
        }
        const barX = hx + 15, barW = M.sx+M.sw-40 - barX;
        const pct = Math.max(0, GAME.anesthesia/GAME.anesthesiaMax);
        let barC = GAME.upgrades.energy_anes ? '#42A5F5' : (pct > 0.5 ? COLORS.green : pct > 0.2 ? COLORS.gold : COLORS.red);
        drawRoundRect(barX, M.sy+14, barW, 28, 14, '#1A1A1A', null);
        if (barW*pct > 5) {
            if (pct <= 0.2) { ctx.shadowColor = COLORS.red; ctx.shadowBlur = 8 + Math.sin(performance.now()/150)*4; }
            drawRoundRect(barX+3, M.sy+17, (barW-6)*pct, 22, 11, barC, null);
            ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
        }
        drawText('ANESTHESIA', barX+14, M.sy+28, 16, '#DDD', 'left', '#000', 3, 'bold');
    } else {
        drawRoundRect(M.sx+M.sw/2-120, M.sy+12, 240, 36, 12, 'rgba(0,0,0,0.5)', null);
        drawText('OR SYSTEM STANDBY', M.sx+M.sw/2, M.sy+30, 18, COLORS.green, 'center');
    }

    // LIVE HOSPITAL FEED badge
    const badgeW = 195;
    drawRoundRect(M.sx+M.sw-badgeW-15, M.sy+M.orH-32, badgeW, 28, 14, 'rgba(0,0,0,0.6)', null);
    if (Math.floor(performance.now()/500)%2===0) { ctx.fillStyle='#FF1744'; ctx.beginPath(); ctx.arc(M.sx+M.sw-badgeW-2, M.sy+M.orH-18, 6, 0, Math.PI*2); ctx.fill(); }
    drawText('LIVE HOSPITAL FEED', M.sx+M.sw-badgeW/2-10, M.sy+M.orH-18, 13, '#FFF', 'center', null, 0, 'bold');

    ctx.restore();
}

function drawPatient(cx, y) {
    // Bed — 460 wide, 36 tall
    drawRoundRect(cx-230, y+8, 460, 36, 12, '#BDBDBD', '#999', 2);
    // Bed legs
    drawRect(cx-205, y+44, 18, 30, '#888');
    drawRect(cx+187, y+44, 18, 30, '#888');
    // Bed rail hints
    ctx.strokeStyle = '#AAA'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx-230, y+4); ctx.lineTo(cx-230, y-10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx+230, y+4); ctx.lineTo(cx+230, y-10); ctx.stroke();
    // Pillow
    ctx.fillStyle = '#E3F2FD';
    ctx.beginPath(); ctx.ellipse(cx-185, y+8, 45, 16, 0, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#BBDEFB'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(cx-185, y+8, 45, 16, 0, 0, Math.PI*2); ctx.stroke();
    // Head — 32 radius
    ctx.fillStyle = '#EAC086'; ctx.beginPath(); ctx.arc(cx-185, y+2, 32, 0, Math.PI*2); ctx.fill();
    // Surgical cap
    ctx.fillStyle = '#00ACC1'; ctx.beginPath(); ctx.arc(cx-185, y-5, 33, Math.PI, 0); ctx.fill();
    // Body/gown — bigger blanket with more volume
    let breath = Math.sin(performance.now()/500)*5;
    // Blanket shadow (depth)
    ctx.fillStyle = 'rgba(1,87,155,0.2)';
    ctx.beginPath();
    ctx.moveTo(cx-155, y+10); ctx.quadraticCurveTo(cx-40, y-42-breath, cx+10, y-22-breath);
    ctx.quadraticCurveTo(cx+100, y-36, cx+210, y+10); ctx.lineTo(cx-155, y+10);
    ctx.fill();
    // Main blanket
    ctx.fillStyle = '#81D4FA'; ctx.strokeStyle = '#0288D1'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx-155, y+6); ctx.quadraticCurveTo(cx-40, y-48-breath, cx+10, y-26-breath);
    ctx.quadraticCurveTo(cx+100, y-38, cx+210, y+6); ctx.lineTo(cx-155, y+6);
    ctx.fill(); ctx.stroke();
    // Blanket highlight strip (top ridge)
    ctx.strokeStyle = 'rgba(179,229,252,0.6)'; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx-120, y-8); ctx.quadraticCurveTo(cx-20, y-44-breath, cx+10, y-26-breath);
    ctx.quadraticCurveTo(cx+60, y-34, cx+140, y-8);
    ctx.stroke();
    // Drape fold lines
    ctx.strokeStyle = 'rgba(2,136,209,0.25)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx-100, y+2); ctx.lineTo(cx+140, y+2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx-80, y-8); ctx.lineTo(cx+120, y-10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx-50, y-18); ctx.lineTo(cx+80, y-20); ctx.stroke();
    // Surgical drape edges hanging over bed sides
    ctx.fillStyle = 'rgba(129,212,250,0.5)';
    ctx.beginPath(); ctx.moveTo(cx-155, y+6); ctx.lineTo(cx-155, y+28); ctx.lineTo(cx-130, y+28); ctx.lineTo(cx-130, y+6); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx+190, y+6); ctx.lineTo(cx+190, y+28); ctx.lineTo(cx+210, y+28); ctx.lineTo(cx+210, y+6); ctx.fill();
}

function drawArm(sx2, sy2, tx, ty, erratic, flip) {
    let dx = tx-sx2, dy = ty-sy2, bd = flip ? -1 : 1;
    let ex = sx2+dx*0.35+bd*50, ey = sy2+dy*0.5;
    let wx = sx2+dx*0.7+bd*18, wy = sy2+dy*0.85;
    if (erratic) { ex+=(Math.random()-0.5)*30; ey+=(Math.random()-0.5)*30; wx+=(Math.random()-0.5)*18; wy+=(Math.random()-0.5)*18; tx+=(Math.random()-0.5)*14; ty+=(Math.random()-0.5)*14; }
    ctx.lineWidth=35; ctx.strokeStyle = erratic ? '#FF4444' : '#455A64';
    ctx.beginPath(); ctx.moveTo(sx2, sy2); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.lineWidth=25; ctx.strokeStyle = erratic ? '#EF5350' : '#607D8B';
    ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(wx, wy); ctx.stroke();
    ctx.lineWidth=18; ctx.strokeStyle='#78909C';
    ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.fillStyle='#263238'; ctx.beginPath(); ctx.arc(sx2, sy2, 26, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle='#37474F'; ctx.beginPath(); ctx.arc(ex, ey, 20, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = erratic ? '#FF1744' : '#00E676'; ctx.beginPath(); ctx.arc(ex, ey, 7, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle='#546E7A'; ctx.beginPath(); ctx.arc(wx, wy, 15, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle='#E0E0E0'; ctx.strokeStyle='#B0BEC5'; ctx.lineWidth=3;
    if (flip) {
        ctx.beginPath(); ctx.moveTo(tx-8,ty); ctx.lineTo(tx+3,ty+32); ctx.lineTo(tx+12,ty); ctx.closePath(); ctx.fill(); ctx.stroke();
    } else {
        ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(tx-10,ty+28); ctx.moveTo(tx,ty); ctx.lineTo(tx+10,ty+28); ctx.stroke();
    }
}
