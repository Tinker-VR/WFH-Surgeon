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
    //drawText('LG (Laundering Gray)', M.x+M.w/2, M.y+M.h-8, 10, '#444', 'center', null, 0, 'normal');
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
    // Wall with subtle gradient — muted/dull
    const wallGrad = ctx.createLinearGradient(M.sx, M.sy, M.sx, orBot - 70);
    wallGrad.addColorStop(0, '#C8D5D2'); wallGrad.addColorStop(1, '#BECCC8');
    ctx.fillStyle = wallGrad; ctx.fillRect(M.sx, M.sy, M.sw, M.orH);
    // Wall tile lines — very subtle
    ctx.strokeStyle = '#B8C8C4'; ctx.lineWidth = 1;
    for (let i = M.sx; i < M.sx+M.sw; i += 60) { ctx.beginPath(); ctx.moveTo(i, M.sy); ctx.lineTo(i, orBot-70); ctx.stroke(); }
    for (let j = M.sy; j < orBot-70; j += 40) { ctx.beginPath(); ctx.moveTo(M.sx, j); ctx.lineTo(M.sx+M.sw, j); ctx.stroke(); }
    // Baseboard
    drawRect(M.sx, orBot-73, M.sw, 6, '#8A9A96');
    // Ambient occlusion at wall-floor junction
    const aoGrad = ctx.createLinearGradient(M.sx, orBot-67, M.sx, orBot-52);
    aoGrad.addColorStop(0, 'rgba(0,0,0,0.08)'); aoGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = aoGrad; ctx.fillRect(M.sx, orBot-67, M.sw, 15);
    // Floor with tile pattern — muted
    const floorGrad = ctx.createLinearGradient(M.sx, orBot-67, M.sx, orBot);
    floorGrad.addColorStop(0, '#98B8B0'); floorGrad.addColorStop(1, '#8CABA4');
    ctx.fillStyle = floorGrad; ctx.fillRect(M.sx, orBot - 67, M.sw, 67);
    ctx.strokeStyle = '#88A8A0'; ctx.lineWidth = 1;
    for (let i = M.sx; i < M.sx+M.sw; i += 50) {
        ctx.beginPath(); ctx.moveTo(i, orBot-67); ctx.lineTo(i-20, orBot); ctx.stroke();
    }

    const lx = M.sx + M.sw/2;

    // === GLASS CABINET (left wall) — shifted down to clear HUD bar ===
    const cabX = M.sx + 8, cabY = M.sy + 55, cabW = 85, cabH = M.orH * 0.42;
    drawRoundRect(cabX, cabY, cabW, cabH, 5, '#B8C0C4', '#8A9498', 2);
    ctx.fillStyle = 'rgba(180,195,205,0.2)';
    ctx.fillRect(cabX+4, cabY+4, cabW-8, cabH-8);
    for (let s = 1; s < 4; s++) {
        const shelfY = cabY + s * (cabH/4);
        ctx.strokeStyle = '#A0AAB0'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cabX+4, shelfY); ctx.lineTo(cabX+cabW-4, shelfY); ctx.stroke();
        // Bottles — muted tones
        ctx.fillStyle = ['#B07070','#7090A8','#80A088','#B09870'][s-1];
        ctx.fillRect(cabX+10, shelfY-18, 10, 18);
        ctx.fillStyle = '#708088';
        ctx.fillRect(cabX+26, shelfY-14, 8, 14);
        ctx.fillStyle = '#907898';
        ctx.fillRect(cabX+42, shelfY-20, 10, 20);
        ctx.fillStyle = '#7898A8';
        ctx.fillRect(cabX+58, shelfY-12, 8, 12);
    }
    // Cabinet handle
    ctx.strokeStyle = '#78909C'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cabX+cabW-12, cabY+cabH/2-12); ctx.lineTo(cabX+cabW-12, cabY+cabH/2+12); ctx.stroke();
    // Glass reflection highlight (diagonal stripe)
    ctx.save();
    ctx.beginPath(); ctx.rect(cabX+4, cabY+4, cabW-8, cabH-8); ctx.clip();
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath();
    ctx.moveTo(cabX+cabW*0.2, cabY); ctx.lineTo(cabX+cabW*0.4, cabY);
    ctx.lineTo(cabX+cabW*0.05, cabY+cabH); ctx.lineTo(cabX-cabW*0.15, cabY+cabH);
    ctx.closePath(); ctx.fill();
    // Inner edge shadows for glass depth
    const cabInnerShadow = ctx.createLinearGradient(cabX+4, cabY+4, cabX+20, cabY+4);
    cabInnerShadow.addColorStop(0, 'rgba(0,0,0,0.12)'); cabInnerShadow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = cabInnerShadow; ctx.fillRect(cabX+4, cabY+4, cabW-8, cabH-8);
    const cabInnerTop = ctx.createLinearGradient(cabX+4, cabY+4, cabX+4, cabY+20);
    cabInnerTop.addColorStop(0, 'rgba(0,0,0,0.08)'); cabInnerTop.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = cabInnerTop; ctx.fillRect(cabX+4, cabY+4, cabW-8, cabH-8);
    ctx.restore();

    // === HAND SANITIZER DISPENSER (left wall, below cabinet) — muted ===
    const sanX = M.sx + 49, sanY = cabY + cabH - 10;
    drawRoundRect(sanX, sanY, 26, 40, 5, '#C8D0C8', '#98A898', 1);
    drawRoundRect(sanX + 7, sanY - 10, 12, 14, 4, '#B0BCB0', '#88988A', 1);
    ctx.strokeStyle = '#98A898'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(sanX + 13, sanY - 10); ctx.lineTo(sanX + 13, sanY - 16); ctx.lineTo(sanX + 21, sanY - 16); ctx.stroke();
    //drawText('🧴', sanX + 13, sanY + 20, 14, '#FFF', 'center');

    // === WALL CLOCK (animated, center-right, below HUD) — muted ===
    const clockX = M.sx + M.sw/2 + 170, clockY = M.sy + 40;
    ctx.fillStyle = '#C8CCD0'; ctx.strokeStyle = '#808C92'; ctx.lineWidth = 2;
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

    // === GLASS CABINET (right wall, shifted down to clear HUD) — dulled colors ===
    const cab2X = M.sx + M.sw - 93;
    drawRoundRect(cab2X, cabY, cabW, cabH, 5, '#B8C0C4', '#8A9498', 2);
    ctx.fillStyle = 'rgba(180,195,205,0.2)';
    ctx.fillRect(cab2X+4, cabY+4, cabW-8, cabH-8);
    for (let s = 1; s < 4; s++) {
        const shelfY = cabY + s * (cabH/4);
        ctx.strokeStyle = '#A0AAB0'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cab2X+4, shelfY); ctx.lineTo(cab2X+cabW-4, shelfY); ctx.stroke();
        ctx.fillStyle = '#C0C0C0'; ctx.fillRect(cab2X+10, shelfY-16, 16, 16);
        ctx.fillStyle = '#B09870'; ctx.fillRect(cab2X+32, shelfY-12, 8, 12);
        ctx.fillStyle = '#7898A8'; ctx.fillRect(cab2X+48, shelfY-18, 10, 18);
        ctx.fillStyle = '#B09090'; ctx.fillRect(cab2X+64, shelfY-14, 8, 14);
    }
    // Glass reflection highlight (diagonal stripe)
    ctx.save();
    ctx.beginPath(); ctx.rect(cab2X+4, cabY+4, cabW-8, cabH-8); ctx.clip();
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath();
    ctx.moveTo(cab2X+cabW*0.2, cabY); ctx.lineTo(cab2X+cabW*0.4, cabY);
    ctx.lineTo(cab2X+cabW*0.05, cabY+cabH); ctx.lineTo(cab2X-cabW*0.15, cabY+cabH);
    ctx.closePath(); ctx.fill();
    // Inner edge shadows for glass depth
    const cab2InnerShadow = ctx.createLinearGradient(cab2X+4, cabY+4, cab2X+20, cabY+4);
    cab2InnerShadow.addColorStop(0, 'rgba(0,0,0,0.12)'); cab2InnerShadow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = cab2InnerShadow; ctx.fillRect(cab2X+4, cabY+4, cabW-8, cabH-8);
    const cab2InnerTop = ctx.createLinearGradient(cab2X+4, cabY+4, cab2X+4, cabY+20);
    cab2InnerTop.addColorStop(0, 'rgba(0,0,0,0.08)'); cab2InnerTop.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = cab2InnerTop; ctx.fillRect(cab2X+4, cabY+4, cabW-8, cabH-8);
    ctx.restore();

    // === BLOOD BAG / IV POLE (right side, top lowered below HUD) — muted ===
    const ivX = M.sx + M.sw - 125, ivBaseY = orBot - 55;
    const ivTopY = M.sy + 58;
    ctx.strokeStyle = '#9AA4AA'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(ivX, ivBaseY); ctx.lineTo(ivX, ivTopY); ctx.stroke();
    // IV pole reflection highlight (thin white stripe)
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(ivX - 1, ivBaseY); ctx.lineTo(ivX - 1, ivTopY); ctx.stroke();
    // Cross bar
    ctx.strokeStyle = '#9AA4AA'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(ivX - 22, ivTopY); ctx.lineTo(ivX + 22, ivTopY); ctx.stroke();
    // Hook
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(ivX - 8, ivTopY + 6, 6, Math.PI, 0); ctx.stroke();
    // Blood bag — muted red
    drawRoundRect(ivX - 20, ivTopY + 14, 32, 48, 8, '#8A3030', '#7A2828', 2);
    // Shadow beneath blood bag
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath(); ctx.ellipse(ivX - 4, ivTopY + 64, 14, 4, 0, 0, Math.PI*2); ctx.fill();
    // Tube
    ctx.strokeStyle = '#B08888'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ivX - 4, ivTopY + 62); ctx.quadraticCurveTo(ivX + 14, ivTopY + 95, ivX - 35, orBot - 30); ctx.stroke();
    // Tripod base
    ctx.strokeStyle = '#9AA4AA'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(ivX, ivBaseY); ctx.lineTo(ivX - 20, orBot-2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ivX, ivBaseY); ctx.lineTo(ivX + 20, orBot-2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ivX, ivBaseY); ctx.lineTo(ivX, orBot-2); ctx.stroke();

    // === DEFIBRILLATOR / CRASH CART (right side) — muted + metallic gradient ===
    const ccX = M.sx + M.sw - 185, ccBaseY = orBot - 62;
    // Metallic gradient for cart body
    const ccGrad = ctx.createLinearGradient(ccX, ccBaseY, ccX+55, ccBaseY+52);
    ccGrad.addColorStop(0, '#4A5A64'); ccGrad.addColorStop(0.5, '#3A4A52'); ccGrad.addColorStop(1, '#2E3E46');
    drawRoundRect(ccX, ccBaseY, 55, 52, 6, ccGrad, '#303C42', 2);
    // Defib screen
    drawRoundRect(ccX + 5, ccBaseY + 5, 24, 18, 3, '#000', null);
    ctx.strokeStyle = '#408858'; ctx.lineWidth = 1;
    const defibEkg = (performance.now()/15) % 24;
    ctx.beginPath();
    ctx.moveTo(ccX+5, ccBaseY+14); ctx.lineTo(ccX+5+defibEkg/2, ccBaseY+14);
    ctx.lineTo(ccX+5+defibEkg/2+3, ccBaseY+8); ctx.lineTo(ccX+5+defibEkg/2+6, ccBaseY+20);
    ctx.lineTo(ccX+5+defibEkg/2+9, ccBaseY+14); ctx.lineTo(ccX+29, ccBaseY+14);
    ctx.stroke();
    // Paddles — muted
    drawRoundRect(ccX+34, ccBaseY+6, 16, 16, 4, '#9A7030', '#7A5828', 1);
    //drawText('\u26A1', ccX+42, ccBaseY+14, 16, '#CCC', 'center');
    // Wheels
    ctx.fillStyle = '#333';
    ctx.beginPath(); ctx.arc(ccX + 10, ccBaseY + 55, 5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ccX + 45, ccBaseY + 55, 5, 0, Math.PI*2); ctx.fill();

    // === MAYO STAND (instrument table, left of patient) — muted ===
    const mayoX = lx - 250, mayoTopY = orBot - 15;
    ctx.strokeStyle = '#9AA4AA'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(mayoX, mayoTopY + 20); ctx.lineTo(mayoX, orBot - 2); ctx.stroke();
    // Base
    ctx.beginPath(); ctx.moveTo(mayoX - 14, orBot - 2); ctx.lineTo(mayoX + 14, orBot - 2); ctx.stroke();
    // Tray — muted
    drawRoundRect(mayoX - 45, mayoTopY, 90, 20, 5, '#B0B8BC', '#808C92', 2);
    // Shadow beneath tray
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(mayoX, mayoTopY + 22, 40, 5, 0, 0, Math.PI*2); ctx.fill();
    // Instruments on tray
    ctx.strokeStyle = '#687880'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(mayoX - 28, mayoTopY); ctx.lineTo(mayoX - 28, mayoTopY - 16); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mayoX - 12, mayoTopY); ctx.lineTo(mayoX - 8, mayoTopY - 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mayoX + 5, mayoTopY); ctx.lineTo(mayoX + 5, mayoTopY - 14); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mayoX + 20, mayoTopY); ctx.lineTo(mayoX + 24, mayoTopY - 12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mayoX + 34, mayoTopY); ctx.lineTo(mayoX + 34, mayoTopY - 18); ctx.stroke();
    // Scalpel blade highlight
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath(); ctx.moveTo(mayoX - 30, mayoTopY - 16); ctx.lineTo(mayoX - 26, mayoTopY - 16); ctx.lineTo(mayoX - 28, mayoTopY - 8); ctx.fill();

    // === INSTRUMENT TRAY on side table (right of patient, raised) — muted ===
    const trayX = lx + 220, trayTableY = orBot - 10;
    // Table legs
    ctx.strokeStyle = '#9AA4AA'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(trayX - 30, trayTableY + 14); ctx.lineTo(trayX - 30, orBot - 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(trayX + 30, trayTableY + 14); ctx.lineTo(trayX + 30, orBot - 2); ctx.stroke();
    // Table top — muted
    drawRoundRect(trayX - 40, trayTableY, 80, 14, 4, '#B0B8BC', '#808C92', 1);
    // Instruments
    ctx.fillStyle = '#687880';
    ctx.fillRect(trayX - 24, trayTableY - 8, 4, 8);
    ctx.fillRect(trayX - 12, trayTableY - 10, 4, 10);
    ctx.fillRect(trayX + 4, trayTableY - 7, 4, 7);
    ctx.fillRect(trayX + 18, trayTableY - 9, 4, 9);
    ctx.fillRect(trayX + 30, trayTableY - 6, 4, 6);

    // === SHADOWS ON FLOOR — BIGGER + under freestanding props ===
    /*ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(lx, orBot - 3, 200, 12, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(mayoX, orBot - 1, 22, 6, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(ivX, orBot - 1, 24, 6, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(ccX + 27, orBot - 1, 22, 5, 0, 0, Math.PI*2); ctx.fill();*/
    // Floor shadow under bed legs
    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.beginPath(); ctx.ellipse(lx - 196, orBot - 1, 16, 5, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(lx + 196, orBot - 1, 16, 5, 0, 0, Math.PI*2); ctx.fill();
    // Floor shadow under IV pole base
    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.beginPath(); ctx.ellipse(ivX, orBot - 1, 26, 7, 0, 0, Math.PI*2); ctx.fill();
    // Floor shadow under crash cart wheels
    //ctx.fillStyle = 'rgba(0,0,0,0.10)';
    //ctx.beginPath(); ctx.ellipse(ccX + 10, orBot - 1, 8, 3, 0, 0, Math.PI*2); ctx.fill();
    //ctx.beginPath(); ctx.ellipse(ccX + 45, orBot - 1, 8, 3, 0, 0, Math.PI*2); ctx.fill();
    // Floor shadow under drawer cart wheels
    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    const drawerX = M.sx + 18;
    //ctx.beginPath(); ctx.ellipse(drawerX+10, orBot - 1, 7, 3, 0, 0, Math.PI*2); ctx.fill();
    //ctx.beginPath(); ctx.ellipse(drawerX+50, orBot - 1, 7, 3, 0, 0, Math.PI*2); ctx.fill();
    // Floor shadow under tray table legs
    //ctx.beginPath(); ctx.ellipse(trayX - 30, orBot - 1, 8, 3, 0, 0, Math.PI*2); ctx.fill();
    //ctx.beginPath(); ctx.ellipse(trayX + 30, orBot - 1, 8, 3, 0, 0, Math.PI*2); ctx.fill();

    // Lamp — metallic gradient housing, but keep light cone visible
    const lampX = lx;
    // Metallic gradient for lamp housing
    const lampGrad = ctx.createLinearGradient(lampX-18, M.sy-5, lampX+18, M.sy+30);
    lampGrad.addColorStop(0, '#98A4AA'); lampGrad.addColorStop(0.4, '#808C92'); lampGrad.addColorStop(1, '#4A585E');
    drawRoundRect(lampX-18, M.sy-5, 36, 35, 10, lampGrad, '#4A585E', 2);
    // Metallic sheen on housing
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    drawRoundRect(lampX-14, M.sy-2, 12, 28, 6, 'rgba(255,255,255,0.10)', null);
    ctx.fillStyle = '#C8CCD0'; ctx.strokeStyle = '#687078'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(lampX, M.sy+22, 70, Math.PI, 0); ctx.fill(); ctx.stroke();
    // Lamp reflector rim highlight
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(lampX, M.sy+22, 69, Math.PI+0.1, -0.1); ctx.stroke();
    // Lamp bulbs — slightly muted
    for (let lb = -2; lb <= 2; lb++) {
        ctx.fillStyle = '#E8E4B0';
        ctx.beginPath(); ctx.arc(lampX + lb*20, M.sy+18, 5, 0, Math.PI*2); ctx.fill();
    }
    let lg = ctx.createLinearGradient(lampX, M.sy+22, lampX, orBot);
    lg.addColorStop(0, 'rgba(255,255,240,0.12)'); lg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = lg;
    ctx.beginPath(); ctx.moveTo(lampX-65, M.sy+22); ctx.lineTo(lampX+65, M.sy+22); ctx.lineTo(lampX+150, orBot); ctx.lineTo(lampX-150, orBot); ctx.fill();

    // Heart monitor — moved to center-left wall, below HUD + arms
    const hmx = M.sx + M.sw/2 - 340, hmy = M.sy + 80;
    drawShadowRoundRect(hmx, hmy, 95, 72, 10, '#303840', '#222830', 2);
    drawRoundRect(hmx+6, hmy+6, 83, 38, 5, '#000');
    // Subtle green glow behind EKG line area
    ctx.save();
    ctx.shadowColor = '#00E676'; ctx.shadowBlur = 12;
    ctx.fillStyle = 'rgba(0,230,118,0.06)';
    ctx.fillRect(hmx+6, hmy+6, 83, 38);
    ctx.restore();
    ctx.strokeStyle = '#00E676'; ctx.lineWidth = 2;
    let ekg = (performance.now()/12) % 83;
    ctx.beginPath();
    ctx.moveTo(hmx+6, hmy+26); ctx.lineTo(hmx+6+ekg/2, hmy+26);
    ctx.lineTo(hmx+6+ekg/2+5, hmy+12); ctx.lineTo(hmx+6+ekg/2+10, hmy+38);
    ctx.lineTo(hmx+6+ekg/2+15, hmy+26); ctx.lineTo(hmx+89, hmy+26);
    ctx.stroke();
    ctx.fillStyle = (Math.floor(performance.now()/300)%2===0) ? '#00E676' : '#1B5E20';
    ctx.beginPath(); ctx.arc(hmx+78, hmy+56, 5, 0, Math.PI*2); ctx.fill();
    //drawText('HR', hmx+12, hmy+56, 16, '#4CAF50', 'left', null, 0, 'normal');
    //drawText('SpO2', hmx+12, hmy+66, 16, '#42A5F5', 'left', null, 0, 'normal');
    //drawText('98', hmx+70, hmy+66, 16, '#42A5F5', 'right', null, 0, 'normal');

    // === EKG WIRE from patient to monitor ===
    /*ctx.strokeStyle = '#66BB6A'; ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(hmx + 47, hmy + 44);
    ctx.quadraticCurveTo(lx - 80, M.sy + M.orH * 0.35, lx - 30, M.sy + M.orH * 0.55);
    ctx.stroke();
    ctx.setLineDash([]);*/

    // === ROLLING DRAWER CART (left side) — muted + gradient per drawer ===
    const drawerBaseY = orBot - 78;
    drawRoundRect(drawerX, drawerBaseY, 60, 68, 6, '#4A5A60', '#3A484E', 2);
    for (let d = 0; d < 3; d++) {
        // Gradient per drawer face
        const dwGrad = ctx.createLinearGradient(drawerX+4, drawerBaseY+4+d*20, drawerX+4, drawerBaseY+4+d*20+16);
        dwGrad.addColorStop(0, '#5A6A72'); dwGrad.addColorStop(0.5, '#506068'); dwGrad.addColorStop(1, '#48585E');
        drawRoundRect(drawerX+4, drawerBaseY+4+d*20, 52, 16, 3, dwGrad, '#4A5860', 1);
        drawRoundRect(drawerX+22, drawerBaseY+9+d*20, 16, 6, 2, '#607078', null);
    }
    ctx.fillStyle = '#333';
    ctx.beginPath(); ctx.arc(drawerX+10, drawerBaseY+72, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(drawerX+50, drawerBaseY+72, 4, 0, Math.PI*2); ctx.fill();

    // === MEDICINE CABINET (left wall, below glass cabinet) — muted ===
    /* const medCabX = M.sx + 8, medCabY = cabY + cabH + 8;
    drawRoundRect(medCabX, medCabY, 70, 50, 4, '#C0C4C8', '#9AA0A6', 1);
    ctx.strokeStyle = '#9AA0A6'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(medCabX+35, medCabY+4); ctx.lineTo(medCabX+35, medCabY+46); ctx.stroke();
    drawRoundRect(medCabX+14, medCabY+20, 8, 10, 2, '#808C92', null);
    drawRoundRect(medCabX+48, medCabY+20, 8, 10, 2, '#808C92', null); */

    // === WASTE BIN (left side, under drawer cart) — muted ===
    const binX = M.sx + 85, binY = orBot - 38;
    ctx.fillStyle = '#687880'; ctx.strokeStyle = '#4A5860'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(binX, binY); ctx.lineTo(binX-3, binY+34); ctx.lineTo(binX+32, binY+34); ctx.lineTo(binX+29, binY); ctx.closePath();
    ctx.fill(); ctx.stroke();
    drawRoundRect(binX-1, binY-3, 32, 5, 2, '#506068', '#3A484E', 1);

    // === X-RAY LIGHTBOX (wall, center, below HUD) — muted ===
    /* const xrayX = M.sx + M.sw/2 - 100, xrayY = M.sy + 60;
    drawRoundRect(xrayX, xrayY, 55, 40, 4, '#222830', '#303840', 2);
    drawRoundRect(xrayX+4, xrayY+4, 47, 28, 2, '#182050', null);
    ctx.strokeStyle = 'rgba(80,130,170,0.3)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(xrayX+15, xrayY+10); ctx.lineTo(xrayX+15, xrayY+28); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(xrayX+10, xrayY+18); ctx.lineTo(xrayX+20, xrayY+18); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(xrayX+35, xrayY+18, 8, 10, 0, 0, Math.PI*2); ctx.stroke(); */

    // === OXYGEN TANK (next to IV pole) — muted ===
    const o2X = ivX + 20, o2Y = orBot - 60;
    drawRoundRect(o2X, o2Y, 16, 58, 8, '#6888A0', '#507088', 2);
    drawRoundRect(o2X+3, o2Y-7, 10, 10, 3, '#607078', '#4A585E', 1);
    //drawText('O2', o2X+8, o2Y+30, 16, '#CCC', 'center', null, 0, 'normal');

    // === SUPPLY SHELF (right wall, higher up) — muted ===
    /*const shelfX = M.sx + M.sw - 95, shelfY = orBot - 70;
    drawRoundRect(shelfX, shelfY, 35, 8, 2, '#9AA4AA', '#808C92', 1);
    drawRoundRect(shelfX+4, shelfY-14, 12, 14, 2, '#B8C0B8', null);
    drawRoundRect(shelfX+18, shelfY-12, 12, 12, 2, '#B0BCC4', null);*/

    // === CLIPBOARD on wall (center-right, below HUD) — muted ===
    const clipX = M.sx + M.sw/2 + 290, clipY = M.sy + 62;
    drawRoundRect(clipX, clipY, 30, 40, 3, '#C8C4C0', '#A09890', 1);
    drawRoundRect(clipX+8, clipY-4, 14, 8, 2, '#786858', null);
    ctx.strokeStyle = '#A09890'; ctx.lineWidth = 1;
    for (let cl = 0; cl < 4; cl++) { ctx.beginPath(); ctx.moveTo(clipX+6, clipY+10+cl*7); ctx.lineTo(clipX+24, clipY+10+cl*7); ctx.stroke(); }

    // === GLOVE BOX DISPENSER (wall-mounted, center-right, below HUD) — muted ===
    const gloveX = M.sx + M.sw/2 + 275, gloveY = M.sy + 120;
    drawRoundRect(gloveX, gloveY, 50, 30, 4, '#C0C8C0', '#90A090', 1);
    drawRoundRect(gloveX+15, gloveY+22, 20, 12, 3, '#A8B8A8', null);
    //drawText('GLOVES', gloveX+25, gloveY+14, 16, '#7A9A7A', 'center', null, 0, 'normal');

    // === PAPER TOWEL HOLDER (wall-mounted, right side, below HUD) — muted ===
    const ptX = M.sx + M.sw - 60, ptY = M.sy + 180;
    drawRoundRect(ptX, ptY, 35, 25, 3, '#C8CCD0', '#9AA0A6', 1);
    drawRoundRect(ptX+4, ptY+8, 27, 14, 6, '#D8D8D8', '#C0C0C0', 1);

    // === SHARPS CONTAINER (wall-mounted, near IV, below HUD) — muted ===
    /*const scX = ivX - 50, scY = M.sy + 70;
    drawRoundRect(scX, scY, 22, 28, 3, '#A06060', '#804040', 1);
    drawText('\u26A0', scX+11, scY+14, 16, '#DDD', 'center');*/

    // Patient — centered vertically in OR area, bigger
    const patientY = M.sy + M.orH * 0.58;

    // === ROBOT ARM VARIABLES (computed before drawPatient) ===
    let speed = GAME.state==='PLAYING' ? 600 : 2000;
    let sway = Math.sin(performance.now()/speed)*12 + Math.sin(performance.now()/(speed*0.7))*GAME.armReach*0.4;
    let sway2 = Math.cos(performance.now()/(speed*0.8))*(8+GAME.armReach*0.35);
    let erratic = GAME.armGlitchTimer > 0;
    const armMinX = lx - 180, armMaxX = lx + 180;
    const armTargetY = patientY - 40;
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    // === OUTER ARMS (behind patient) ===
    if (erratic) {
        ctx.globalAlpha = 0.15;
        drawArm(M.sx+80, M.sy-10, clamp(lx-80+sway*1.2, armMinX, armMaxX), armTargetY, true, true);
        drawArm(M.sx+M.sw-80, M.sy-10, clamp(lx+80-sway*1.2, armMinX, armMaxX), armTargetY, true, false);
        ctx.globalAlpha = 1;
    }
    drawArm(M.sx+80, M.sy-10, clamp(lx-80+sway, armMinX, armMaxX), armTargetY, erratic, true);
    drawArm(M.sx+M.sw-80, M.sy-10, clamp(lx+80-sway, armMinX, armMaxX), armTargetY, erratic, false);

    // === DRAW PATIENT (between outer and inner arms) ===
    drawPatient(lx, patientY);

    // Blood
    ctx.fillStyle = 'rgba(211,47,47,0.8)';
    GAME.bloodSpills.forEach(s => { ctx.beginPath(); ctx.arc(lx+s.x*0.8, patientY+s.y, s.r*0.8, 0, Math.PI*2); ctx.fill(); });

    // === INNER ARMS (in front of patient) ===
    drawArm(M.sx+180, M.sy-10, clamp(lx-30+sway2, armMinX, armMaxX), armTargetY-5, erratic, true);
    drawArm(M.sx+M.sw-180, M.sy-10, clamp(lx+30-sway2, armMinX, armMaxX), armTargetY-5, erratic, false);

    // HUD
    if (GAME.state === 'PLAYING' || GAME.state === 'RESOLUTION') {
        drawRoundRect(M.sx+12, M.sy+6, M.sw-24, 44, 12, 'rgba(0,0,0,0.65)', null);

        // LIVE HOSPITAL FEED indicator (left side of HUD bar)
        const liveX = M.sx + 24;
        if (Math.floor(performance.now()/500)%2===0) {
            ctx.fillStyle = '#FF1744';
        } else {
            ctx.fillStyle = '#880000';
        }
        ctx.beginPath(); ctx.arc(liveX, M.sy+28, 5, 0, Math.PI*2); ctx.fill();
        drawText('LIVE', liveX + 12, M.sy+28, 16, '#FF1744', 'left', null, 0, 'bold');
        drawText('HOSPITAL FEED', liveX + 52, M.sy+28, 16, '#CC8888', 'left', null, 0, 'normal');

        // Hearts shifted right after LIVE HOSPITAL FEED section (with pulse)
        let hx = liveX + 170;
        for (let i = 0; i < GAME.maxHearts; i++) {
            const isLawyer = GAME.upgrades.lawyer && i === GAME.maxHearts - 1;
            const alive = i < GAME.hearts;
            const hColor = alive ? (isLawyer ? COLORS.gold : COLORS.red) : '#444';
            const pulse = alive ? 1 + Math.sin(performance.now()/300 + i*0.8) * 0.06 : 1;
            ctx.save();
            ctx.translate(hx + 16, M.sy + 28);
            ctx.scale(pulse, pulse);
            drawText('\u2764', 0, 0, 32, hColor, 'center');
            ctx.restore();
            hx += 42;
        }
        // Anesthesia bar fills remaining width
        const barX = hx + 15, barW = M.sx+M.sw-40 - barX;
        const pct = Math.max(0, GAME.anesthesia/GAME.anesthesiaMax);
        let barC = GAME.upgrades.energy_anes ? '#42A5F5' : (pct > 0.5 ? COLORS.green : pct > 0.2 ? COLORS.gold : COLORS.red);
        drawRoundRect(barX, M.sy+14, barW, 28, 14, '#1A1A1A', null);
        if (barW*pct > 5) {
            if (pct <= 0.2) { ctx.shadowColor = COLORS.red; ctx.shadowBlur = 8 + Math.sin(performance.now()/150)*4; }
            const fillW = (barW-6)*pct;
            drawRoundRect(barX+3, M.sy+17, fillW, 22, 11, barC, null);
            // Shimmer highlight sweep
            ctx.save();
            ctx.beginPath();
            ctx.roundRectPolyfill(barX+3, M.sy+17, fillW, 22, 11);
            ctx.clip();
            const shimX = ((performance.now()/1200) % 1) * (fillW + 60) - 30 + barX+3;
            const shimGrad = ctx.createLinearGradient(shimX-30, 0, shimX+30, 0);
            shimGrad.addColorStop(0, 'rgba(255,255,255,0)');
            shimGrad.addColorStop(0.5, 'rgba(255,255,255,0.12)');
            shimGrad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = shimGrad;
            ctx.fillRect(barX+3, M.sy+17, fillW, 22);
            ctx.restore();
            ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
        }
        drawText('ANESTHESIA', barX+14, M.sy+28, 16, '#DDD', 'left', '#000', 3, 'bold');
    } else {
        drawRoundRect(M.sx+M.sw/2-120, M.sy+12, 240, 36, 12, 'rgba(0,0,0,0.5)', null);
        drawText('OR SYSTEM STANDBY', M.sx+M.sw/2, M.sy+30, 18, COLORS.green, 'center');
    }

    ctx.restore();
}

function drawPatient(cx, y) {
    // Shadow under bed
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(cx, y+76, 220, 10, 0, 0, Math.PI*2); ctx.fill();

    

    // Head — 32 radius, raised onto pillow
    ctx.fillStyle = '#EAC086'; ctx.beginPath(); ctx.arc(cx-155, y-11, 32, 0, Math.PI*2); ctx.fill();
    // Surgical cap
    //ctx.fillStyle = '#00ACC1'; ctx.beginPath(); ctx.arc(cx-170, y-15, 32, Math.PI, 0); ctx.fill();


    // Pillow — raised and plumper
    ctx.fillStyle = '#E3F2FD';
    ctx.beginPath(); ctx.ellipse(cx-170, y+0, 48, 22, 0, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#BBDEFB'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(cx-170, y+0, 48, 22, 0, 0, Math.PI*2); ctx.stroke();

    // Bed — 460 wide, 36 tall — muted + gradient
    const bedGrad = ctx.createLinearGradient(cx-230, y+8, cx-230, y+44);
    bedGrad.addColorStop(0, '#B0B4B8'); bedGrad.addColorStop(0.5, '#A0A4A8'); bedGrad.addColorStop(1, '#909498');
    drawRoundRect(cx-230, y+8, 460, 36, 12, bedGrad, '#888C90', 2);
    // Bed legs
    drawRect(cx-205, y+44, 18, 30, '#787C80');
    drawRect(cx+187, y+44, 18, 30, '#787C80');
    // Bed rail hints with reflections
    //ctx.strokeStyle = '#909498'; ctx.lineWidth = 2;
    //ctx.beginPath(); ctx.moveTo(cx-230, y+4); ctx.lineTo(cx-230, y-10); ctx.stroke();
    //ctx.beginPath(); ctx.moveTo(cx+230, y+4); ctx.lineTo(cx+230, y-10); ctx.stroke();
    // Rail reflection highlights
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx-229, y+4); ctx.lineTo(cx-229, y-10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx+231, y+4); ctx.lineTo(cx+231, y-10); ctx.stroke();
    

    // Body/gown — bigger blanket with more volume
    let breath = Math.sin(performance.now()/500)*5;
    // Blanket shadow (depth) — taller
    ctx.fillStyle = 'rgba(1,87,155,0.2)';
    ctx.beginPath();
    ctx.moveTo(cx-155, y+14); ctx.quadraticCurveTo(cx-40, y-58-breath, cx+10, y-36-breath);
    ctx.quadraticCurveTo(cx+100, y-50, cx+210, y+14); ctx.lineTo(cx-155, y+14);
    ctx.fill();
    // Main blanket — taller peak, covers more bed
    ctx.fillStyle = '#81D4FA'; ctx.strokeStyle = '#0288D1'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx-155, y+12); ctx.quadraticCurveTo(cx-40, y-65-breath, cx+10, y-40-breath);
    ctx.quadraticCurveTo(cx+100, y-52, cx+210, y+12); ctx.lineTo(cx-155, y+12);
    ctx.fill(); ctx.stroke();
    // Blanket highlight strip (top ridge)
    ctx.strokeStyle = 'rgba(179,229,252,0.6)'; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx-120, y-8); ctx.quadraticCurveTo(cx-20, y-60-breath, cx+10, y-40-breath);
    ctx.quadraticCurveTo(cx+60, y-48, cx+140, y-8);
    ctx.stroke();
    // Drape fold lines
    ctx.strokeStyle = 'rgba(2,136,209,0.25)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx-100, y+6); ctx.lineTo(cx+140, y+6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx-80, y-4); ctx.lineTo(cx+120, y-6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx-50, y-16); ctx.lineTo(cx+80, y-18); ctx.stroke();

    

    // Surgical drape edges hanging over bed sides — longer
    ctx.fillStyle = 'rgba(129,212,250,0.5)';
    ctx.beginPath(); ctx.moveTo(cx-155, y+12); ctx.lineTo(cx-155, y+36); ctx.lineTo(cx-130, y+36); ctx.lineTo(cx-130, y+12); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx+190, y+12); ctx.lineTo(cx+190, y+36); ctx.lineTo(cx+210, y+36); ctx.lineTo(cx+210, y+12); ctx.fill();
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
