/**
 * WFH SURGEON — Render: All 7 Hazard Types + Desk-Level Elements
 */

function drawHazards() {
    if (!GAME.hazard) return;
    const M = MONITOR;
    const mcx = M.sx + M.sw/2, mcy = M.sy + M.sh/2;
    const now = performance.now();

    // === CAT HAZARD: Fills the WHOLE SCREEN ===
    if (GAME.hazard === 'cat') {
        ctx.fillStyle = 'rgba(0,0,0,0.65)';
        ctx.fillRect(0, 0, CW, CH);

        const cx2 = CW/2, cy2 = CH/2 - 20;
        const catBob = Math.sin(now/300)*8;
        const cy2b = cy2 + catBob;
        const shrinkFactor = GAME.catFlashTimer > 0 ? 1 - 0.15 * (GAME.catFlashTimer / 300) : 1;
        const s = 2.2 * shrinkFactor;
        // Cat body
        drawShadowRoundRect(cx2-85*s, cy2b-65*s, 170*s, 140*s, 75*s, '#FFA000', '#E65100', 4);
        // Ears
        ctx.fillStyle='#FFA000'; ctx.strokeStyle='#E65100'; ctx.lineWidth=4;
        ctx.beginPath(); ctx.moveTo(cx2-65*s,cy2b-45*s); ctx.lineTo(cx2-90*s,cy2b-120*s); ctx.lineTo(cx2-28*s,cy2b-55*s); ctx.fill(); ctx.stroke();
        ctx.fillStyle='#FFCDD2'; ctx.beginPath(); ctx.moveTo(cx2-58*s,cy2b-50*s); ctx.lineTo(cx2-80*s,cy2b-105*s); ctx.lineTo(cx2-35*s,cy2b-56*s); ctx.fill();
        ctx.fillStyle='#FFA000'; ctx.strokeStyle='#E65100';
        ctx.beginPath(); ctx.moveTo(cx2+65*s,cy2b-45*s); ctx.lineTo(cx2+90*s,cy2b-120*s); ctx.lineTo(cx2+28*s,cy2b-55*s); ctx.fill(); ctx.stroke();
        ctx.fillStyle='#FFCDD2'; ctx.beginPath(); ctx.moveTo(cx2+58*s,cy2b-50*s); ctx.lineTo(cx2+80*s,cy2b-105*s); ctx.lineTo(cx2+35*s,cy2b-56*s); ctx.fill();
        // Eyes
        ctx.fillStyle='#FFF'; ctx.strokeStyle='#000'; ctx.lineWidth=3;
        const leyX = cx2-30*s, leyY = cy2b-15*s;
        const reyX = cx2+30*s, reyY = cy2b-15*s;
        ctx.beginPath(); ctx.ellipse(leyX,leyY,22*s,30*s,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(reyX,reyY,22*s,30*s,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
        const lAngle = Math.atan2(GAME.mouseY - leyY, GAME.mouseX - leyX);
        const rAngle = Math.atan2(GAME.mouseY - reyY, GAME.mouseX - reyX);
        const pupilOff = 6;
        ctx.fillStyle='#000';
        ctx.beginPath(); ctx.ellipse(leyX + Math.cos(lAngle)*pupilOff, leyY + Math.sin(lAngle)*pupilOff, 9*s, 22*s, 0, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(reyX + Math.cos(rAngle)*pupilOff, reyY + Math.sin(rAngle)*pupilOff, 9*s, 22*s, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle='#FFF';
        ctx.beginPath(); ctx.arc(cx2-36*s, cy2b-24*s, 5*s, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx2+24*s, cy2b-24*s, 5*s, 0, Math.PI*2); ctx.fill();
        // Nose & mouth
        ctx.fillStyle='#F48FB1'; ctx.beginPath(); ctx.moveTo(cx2-12*s,cy2b+16*s); ctx.lineTo(cx2+12*s,cy2b+16*s); ctx.lineTo(cx2,cy2b+28*s); ctx.fill();
        ctx.strokeStyle='#000'; ctx.lineWidth=3;
        ctx.beginPath(); ctx.arc(cx2-14*s,cy2b+32*s,14*s,0,Math.PI); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx2+14*s,cy2b+32*s,14*s,0,Math.PI); ctx.stroke();
        // Whiskers
        ctx.strokeStyle='#FFF'; ctx.lineWidth=3;
        [-1,1].forEach(dir => {
            ctx.beginPath(); ctx.moveTo(cx2+dir*25*s,cy2b+18*s); ctx.lineTo(cx2+dir*95*s,cy2b+8*s); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx2+dir*25*s,cy2b+26*s); ctx.lineTo(cx2+dir*100*s,cy2b+26*s); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx2+dir*25*s,cy2b+34*s); ctx.lineTo(cx2+dir*95*s,cy2b+44*s); ctx.stroke();
        });
        // Paws
        drawShadowRoundRect(cx2-70*s,cy2b+55*s,55*s,32*s,22*s,'#FFA000','#E65100',3);
        drawShadowRoundRect(cx2+15*s,cy2b+55*s,55*s,32*s,22*s,'#FFA000','#E65100',3);
        // SCREAMING text
        let pulse = 1+Math.sin(now/120)*0.08;
        ctx.save(); ctx.translate(cx2, 55); ctx.scale(pulse, pulse);
        drawText(`\uD83D\uDC31 SHOO THE CAT!! Click ${3-GAME.catClicks} more!! \uD83D\uDC31`, 0, 0, 36, '#FFA000', 'center', '#000', 6);
        ctx.restore();
        ctx.save(); ctx.translate(cx2, CH - 80); ctx.scale(pulse, pulse);
        drawText('YOUR CAT IS ON THE DESK AGAIN!!!', 0, 0, 28, '#FF6F00', 'center', '#000', 4);
        ctx.restore();
        // Click flash
        if (GAME.catFlashTimer > 0) {
            ctx.fillStyle = `rgba(255,255,255,${GAME.catFlashTimer/300 * 0.4})`;
            ctx.fillRect(0, 0, CW, CH);
        }
        GAME.catStars.forEach(star => {
            const alpha = star.life / star.maxLife;
            ctx.globalAlpha = alpha;
            drawText('\u2B50', star.x, star.y, star.size, '#FFD54F', 'center');
            ctx.globalAlpha = 1;
        });
        return;
    }

    // === ALL OTHER HAZARDS: Clipped to monitor ===
    ctx.save();
    ctx.beginPath(); ctx.roundRectPolyfill(M.sx, M.sy, M.sw, M.sh, 4); ctx.clip();
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(M.sx, M.sy, M.sw, M.sh);

    if (GAME.hazard === 'ad') {
        const {x,y,w,h} = GAME.adPos;
        const ad = CHEEKY_ADS[GAME.adIndex];
        const flashColor = Math.floor(now/200) % 2 === 0 ? ad.color : '#FFD600';
        const glowFlash = Math.floor(now/100) % 2 === 0 ? flashColor : '#FF00FF';
        drawShadowRoundRect(x-8, y-8, w+16, h+16, 18, glowFlash, null);
        drawShadowRoundRect(x-4, y-4, w+8, h+8, 16, flashColor, null);
        drawShadowRoundRect(x, y, w, h, 14, ad.bg, '#333', 3);
        drawRoundRect(x, y, w, 50, 14, ad.color, null); drawRect(x, y+20, w, 30, ad.color);

        // X button — randomized corner + wiggle
        const corner = GAME.adCloseCorner;
        let closeX, closeY;
        if (corner === 0)      { closeX = x + 8;       closeY = y + 8; }
        else if (corner === 1) { closeX = x + w - 58;  closeY = y + 8; }
        else if (corner === 2) { closeX = x + 8;       closeY = y + h - 58; }
        else                   { closeX = x + w - 58;  closeY = y + h - 58; }
        const wigX = Math.sin(now/80)*4;
        const wigY = Math.cos(now/100)*3;
        drawRoundRect(closeX + wigX, closeY + wigY, 50, 50, 8, '#424242', null);
        ctx.strokeStyle = '#FFF'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(closeX+14+wigX, closeY+14+wigY); ctx.lineTo(closeX+36+wigX, closeY+36+wigY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(closeX+36+wigX, closeY+14+wigY); ctx.lineTo(closeX+14+wigX, closeY+36+wigY); ctx.stroke();

        // Ad content — text shadow for readability
        const headPulse = 1 + Math.sin(now/150)*0.04;
        ctx.save(); ctx.translate(x+w/2, y+80); ctx.scale(headPulse, headPulse);
        drawText(ad.headline, 0, 0, 34, ad.color, 'center', '#000', 4, 'bold');
        ctx.restore();
        drawText(ad.sub, x+w/2, y+h*0.38, 22, '#333', 'center', 'rgba(255,255,255,0.7)', 3, 'normal');
        const ctaW = 380, ctaH = 70;
        const ctaPulse = 1 + Math.sin(now/200)*0.05;
        ctx.save(); ctx.translate(x+w/2, y+h*0.55); ctx.scale(ctaPulse, ctaPulse);
        drawRoundRect(-ctaW/2, -ctaH/2, ctaW, ctaH, ctaH/2, ad.color, null);
        drawText(ad.cta, 0, 0, 28, '#FFF', 'center', '#000', 3);
        ctx.restore();
        drawText('*Not responsible for any surgical outcomes', x+w/2, y+h*0.72, 16, '#666', 'center', 'rgba(255,255,255,0.5)', 2, 'normal');
        drawText('Find the X or press ESC to dismiss', x+w/2, y+h-18, 16, '#888', 'center', 'rgba(0,0,0,0.5)', 2, 'normal');
        drawText('Ad closes in ' + (Math.floor(now/1000) % 99 + 1) + '...', x+w/2, y+h-40, 16, '#AAA', 'center', null, 0, 'normal');
        for (let sp = 0; sp < 10; sp++) {
            const spx = x + 30 + Math.random()*(w-60);
            const spy = y + 60 + Math.random()*(h-100);
            const spEmoji = ['\u2728','\uD83D\uDCAB','\u2B50','\uD83C\uDF89','\uD83D\uDD25','\uD83C\uDF1F','\uD83D\uDCA5','\u2764\uFE0F','\uD83C\uDF08','\uD83D\uDE80'][sp];
            drawText(spEmoji, spx, spy, 16+Math.random()*8, '#FFF', 'center');
        }
    }
    else if (GAME.hazard === 'coffee') {
        const s = Math.max(0, 1-(GAME.coffeeWipe/3000));
        const browns = ['#3E2723', '#4E342E', '#5D4037', '#6D4C41'];
        const splats = [
            {ox: 0, oy: 0, r: 0.4}, {ox: -0.25, oy: 0.15, r: 0.22}, {ox: 0.22, oy: -0.12, r: 0.25},
            {ox: -0.12, oy: -0.22, r: 0.18}, {ox: 0.18, oy: 0.22, r: 0.20}, {ox: -0.3, oy: -0.08, r: 0.15},
            {ox: 0.28, oy: 0.05, r: 0.17}, {ox: -0.05, oy: 0.3, r: 0.14}, {ox: 0.1, oy: -0.28, r: 0.16},
            {ox: -0.18, oy: 0.25, r: 0.12}, {ox: 0.32, oy: -0.2, r: 0.13}, {ox: -0.08, oy: -0.32, r: 0.11}
        ];
        splats.forEach((sp, i) => {
            ctx.fillStyle = browns[i % browns.length];
            const bx = mcx + sp.ox * M.sw * s;
            const by = mcy + sp.oy * M.sh * s;
            const br = sp.r * M.sw * 0.5 * s;
            if (br > 2) { ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI*2); ctx.fill(); }
        });
        for (let d = 0; d < 8; d++) {
            const angle = (d / 8) * Math.PI * 2 + 0.3;
            const dist = M.sw * 0.32 * s;
            const dx = mcx + Math.cos(angle) * dist;
            const dy = mcy + Math.sin(angle) * dist;
            ctx.fillStyle = browns[d % browns.length];
            ctx.beginPath(); ctx.arc(dx, dy, 8 * s, 0, Math.PI*2); ctx.fill();
        }
        ctx.fillStyle = '#5D4037';
        for (let d = 0; d < 4; d++) {
            const dx = mcx + (d-1.5)*80;
            const dripLen = Math.sin(now/400 + d)*20 + 30;
            ctx.beginPath(); ctx.moveTo(dx-8, mcy+M.sw*0.15*s); ctx.quadraticCurveTo(dx, mcy+M.sw*0.15*s+dripLen*s, dx+8, mcy+M.sw*0.15*s); ctx.fill();
        }
        let pulse2 = 1+Math.sin(now/120)*0.08;
        ctx.save(); ctx.translate(mcx, M.sy + 28); ctx.scale(pulse2, pulse2);
        drawText('\u2615 COFFEE SPILL!! WIPE IT UP!! \u2615', 0, 0, 36, '#D7CCC8', 'center', '#000', 6);
        ctx.restore();
        // Cloth/rag at cursor when wiping — 4x bigger (160x96)
        if (GAME.coffeeWiping) {
            ctx.save();
            ctx.translate(GAME.mouseX, GAME.mouseY);
            ctx.rotate(Math.sin(now/100)*0.15);
            drawRoundRect(-80, -48, 160, 96, 16, '#42A5F5', '#1E88E5', 3);
            ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2;
            for (let tl = 0; tl < 8; tl++) {
                ctx.beginPath(); ctx.moveTo(-68, -36+tl*12); ctx.lineTo(68, -36+tl*12); ctx.stroke();
            }
            // Wet spots
            ctx.fillStyle = 'rgba(100,181,246,0.3)';
            ctx.beginPath(); ctx.arc(-30, -10, 18, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(25, 15, 14, 0, Math.PI*2); ctx.fill();
            ctx.restore();
        }
    }
    else if (GAME.hazard === 'battery') {
        const dimAlpha = GAME.dimLevel || 0;
        if (dimAlpha > 0) {
            ctx.fillStyle = `rgba(0,0,0,${dimAlpha})`;
            ctx.fillRect(M.sx, M.sy, M.sw, M.sh);
        }
    }
    else if (GAME.hazard === 'lag') {
        for (let i = 0; i < 120; i++) {
            const sx2 = M.sx + Math.random()*M.sw;
            const sy2 = M.sy + Math.random()*M.sh;
            const sw2 = Math.random()*80+15;
            ctx.fillStyle = `rgba(255,255,255,${Math.random()*0.2})`;
            ctx.fillRect(sx2, sy2, sw2, 2);
        }
        for (let t = 0; t < 4; t++) {
            const tearY = M.sy + (now/3 + t*120) % M.sh;
            ctx.fillStyle = 'rgba(0,255,255,0.05)';
            ctx.fillRect(M.sx, tearY, M.sw, 4);
        }
        let pulse4 = 1+Math.sin(now/120)*0.08;
        ctx.save(); ctx.translate(mcx, mcy-20); ctx.scale(pulse4, pulse4);
        drawText(`\uD83D\uDCF6 WI-FI IS DOWN!!!`, 0, 0, 36, COLORS.red, 'center', '#000', 6);
        ctx.restore();
        drawText(`SMASH THE ROUTER!! ${3-GAME.routerClicks} more clicks!`, mcx, mcy+35, 28, '#CCC', 'center', null, 0, 'normal');
    }
    else if (GAME.hazard === 'kbbreak') {
        drawText('\u2328\uFE0F', mcx, mcy - 30, 80, '#FFF', 'center');
        let pulse5 = 1+Math.sin(now/120)*0.08;
        ctx.save(); ctx.translate(mcx, mcy+40); ctx.scale(pulse5, pulse5);
        drawText('KEYBOARD DISCONNECTED!!', 0, 0, 36, COLORS.red, 'center', '#000', 6);
        ctx.restore();
        const fixedCount = GAME.kbScrews.filter(s => s).length;
        drawText(`Fix the screws! ${fixedCount}/4 done`, mcx, mcy+85, 24, '#CCC', 'center', null, 0, 'normal');
        if (!GAME.hasScrewdriver) drawText('Pick up the screwdriver from the desk!', mcx, mcy+115, 18, COLORS.gold, 'center', null, 0, 'normal');
    }
    else if (GAME.hazard === 'malware') {
        // Reduced glitch rects to 10 for performance
        for (let i = 0; i < 10; i++) {
            const gx = M.sx + Math.random()*M.sw;
            const gy = M.sy + Math.random()*M.sh;
            ctx.fillStyle = `rgba(${Math.random()>0.5?255:0},${Math.random()*255|0},${Math.random()>0.5?255:0},${Math.random()*0.25})`;
            ctx.fillRect(gx, gy, Math.random()*30+5, Math.random()*3+1);
        }
        const popW = 520, popH = 300;
        const popX = mcx - popW/2, popY = mcy - popH/2;
        // Flashing border — more intrusive
        const popBorderColor = Math.floor(now/100) % 3 === 0 ? '#FF4444' : Math.floor(now/100) % 3 === 1 ? '#FFFF00' : '#FF00FF';
        drawShadowRoundRect(popX-4, popY-4, popW+8, popH+8, 16, popBorderColor, null);
        drawShadowRoundRect(popX, popY, popW, popH, 14, '#0A0A1E', popBorderColor, 3);
        drawRoundRect(popX, popY, popW, 45, 14, '#C62828', null); drawRect(popX, popY+20, popW, 25, '#C62828');
        drawText('\u26A0\uFE0F MALWARE DETECTED \u26A0\uFE0F', popX+popW/2, popY+22, 22, '#FFF', 'center');
        // More intrusive popup content
        const flashText = Math.floor(now/300) % 2 === 0;
        drawText('\uD83E\uDDA0 SYSTEM INFECTED \uD83E\uDDA0', popX+popW/2, popY+70, 32, flashText ? '#FF4444' : '#FF8888', 'center', '#000', 4);
        drawText('DOWNLOADING VIRUS.EXE...', popX+popW/2, popY+100, 18, '#FF6666', 'center', null, 0, 'normal');
        drawText(`Click all virus icons to clean! (${GAME.virusesClicked}/5)`, popX+popW/2, popY+130, 20, '#CCC', 'center', null, 0, 'normal');
        // Progress bar
        drawRoundRect(popX+40, popY+155, popW-80, 22, 11, '#333', null);
        const scanPct = GAME.virusesClicked / 5;
        if (scanPct > 0) drawRoundRect(popX+43, popY+158, (popW-86)*scanPct, 16, 8, COLORS.green, null);
        // Fake virus progress bar (ominous)
        const virusPct = (Math.sin(now/500) + 1) / 2;
        drawRoundRect(popX+40, popY+190, popW-80, 18, 9, '#1A1A1A', null);
        drawRoundRect(popX+43, popY+193, (popW-86)*virusPct, 12, 6, '#FF4444', null);
        drawText('VIRUS SPREADING...', popX+popW/2, popY+200, 16, '#FF6666', 'center', null, 0, 'normal');
        drawText('YOUR FILES ARE BEING ENCRYPTED', popX+popW/2, popY+230, 16, flashText ? '#FF4444' : '#882222', 'center', null, 0, 'normal');
        drawText('SCANNING...', popX+popW/2, popY+260, 16, '#AAA', 'center', null, 0, 'normal');
        // Virus icons — halved to ~98px, reduced glow to 50px
        GAME.virusIcons.forEach(v => {
            if (!v.alive) return;
            const vPulse = 1 + Math.sin(now/200 + v.x)*0.06;
            const vRot = (now/1000 + v.x * 0.01) % (Math.PI * 2);
            ctx.save(); ctx.translate(v.x, v.y); ctx.rotate(vRot); ctx.scale(vPulse, vPulse);
            drawText('\uD83E\uDDA0', 0, 0, 98, '#FFF', 'center');
            ctx.restore();
            ctx.fillStyle = 'rgba(255,0,0,0.08)';
            ctx.beginPath(); ctx.arc(v.x, v.y, 50, 0, Math.PI*2); ctx.fill();
        });
    }

    ctx.restore();

    // === DESK-LEVEL hazard elements (outside monitor clip) ===
    if (GAME.hazard === 'battery') {
        // Battery icon and warning — centered on screen
        const batCY = CH/2;
        const bw = 270, bh = 135;
        drawRoundRect(mcx-bw/2, batCY-bh/2, bw, bh, 20, '#333', '#FF4444', 5);
        drawRect(mcx+bw/2, batCY-33, 20, 66, '#FF4444');
        const flashPct = (Math.sin(now/200)+1)/2 * 0.3;
        drawRoundRect(mcx-bw/2+12, batCY-bh/2+12, (bw-24)*flashPct, bh-24, 14, COLORS.red, null);
        ctx.fillStyle = COLORS.red;
        ctx.beginPath();
        ctx.moveTo(mcx-15, batCY-bh/2+20); ctx.lineTo(mcx+22, batCY-15);
        ctx.lineTo(mcx+3, batCY-12); ctx.lineTo(mcx+30, batCY+bh/2-27);
        ctx.lineTo(mcx-8, batCY+3); ctx.lineTo(mcx+12, batCY+6);
        ctx.closePath(); ctx.fill();
        let pulse3 = 1+Math.sin(now/120)*0.08;
        ctx.save(); ctx.translate(mcx, batCY-bh/2-30); ctx.scale(pulse3, pulse3);
        drawText('\uD83D\uDD0B BATTERY DYING!! PLUG IN NOW!! \u26A1', 0, 0, 36, COLORS.red, 'center', '#000', 6);
        ctx.restore();
        drawText('Drag the charger to the outlet!', mcx, batCY+bh/2+25, 22, '#CCC', 'center', null, 0, 'normal');

        // Plug and socket — 1.5x bigger, centered vertically
        const plugWig = Math.sin(now/150)*4;
        const sockWig = Math.sin(now/150 + 1)*4;
        const plugX = GAME.batteryDrag ? GAME.mouseX : 80;
        const plugY = GAME.batteryDrag ? GAME.mouseY : CH/2 + plugWig;
        const sockX = CW - 100;
        const sockY = CH/2 + sockWig;

        // Cord from outside left edge to plug only
        ctx.lineWidth = 30; ctx.strokeStyle = '#1A1A1A';
        ctx.beginPath(); ctx.moveTo(-40, plugY);
        ctx.bezierCurveTo(plugX - 60, plugY + 40, plugX - 20, plugY + 20, plugX, plugY);
        ctx.stroke();
        ctx.lineWidth = 24; ctx.strokeStyle = '#333';
        ctx.beginPath(); ctx.moveTo(-40, plugY);
        ctx.bezierCurveTo(plugX - 60, plugY + 40, plugX - 20, plugY + 20, plugX, plugY);
        ctx.stroke();

        // Socket — 1.5x (180x180)
        drawShadowRoundRect(sockX-90, sockY-90, 180, 180, 18, '#FAFAFA', '#B0BEC5', 4);
        drawRoundRect(sockX-75, sockY-75, 150, 150, 12, '#F5F5F5', '#E0E0E0', 2);
        drawRoundRect(sockX-27, sockY-30, 21, 54, 6, '#1A1A1A', null);
        drawRoundRect(sockX+6, sockY-30, 21, 54, 6, '#1A1A1A', null);
        ctx.fillStyle = '#1A1A1A';
        ctx.beginPath(); ctx.arc(sockX, sockY+42, 12, 0, Math.PI*2); ctx.fill();
        drawText('\u26A1', sockX, sockY+72, 28, '#888', 'center');

        // Plug — rotated 90deg (prongs face right toward socket)
        ctx.save();
        ctx.translate(plugX, plugY);
        ctx.rotate(Math.PI / 2);
        drawShadowRoundRect(-60, -45, 120, 90, 15, '#333', '#1A1A1A', 4);
        ctx.strokeStyle = '#555'; ctx.lineWidth = 3;
        for (let gr = 0; gr < 5; gr++) {
            ctx.beginPath(); ctx.moveTo(-42, -27+gr*16); ctx.lineTo(42, -27+gr*16); ctx.stroke();
        }
        drawRoundRect(-27, -97, 18, 57, 4, '#CCC', '#AAA', 2);
        drawRoundRect(9, -97, 18, 57, 4, '#CCC', '#AAA', 2);
        ctx.restore();
    }

    // Wifi fist — 3x bigger, on router with smash effect
    if (GAME.hazard === 'lag' && GAME.routerSmashAnim > 0) {
        const fistScale = 1 + (GAME.routerSmashAnim / 300) * 0.3;
        ctx.save();
        ctx.translate(110, DESK_Y + 37);
        ctx.scale(fistScale, fistScale);
        drawText('\uD83D\uDC4A', 0, 0, 72, '#FFF', 'center');
        ctx.restore();
        // Impact lines around fist
        for (let il = 0; il < 8; il++) {
            const angle = (il / 8) * Math.PI * 2;
            const innerR = 80, outerR = 120 + Math.random() * 30;
            ctx.strokeStyle = `rgba(255,255,100,${0.6 * GAME.routerSmashAnim/300})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(110 + Math.cos(angle) * innerR, DESK_Y + 37 + Math.sin(angle) * innerR);
            ctx.lineTo(110 + Math.cos(angle) * outerR, DESK_Y + 37 + Math.sin(angle) * outerR);
            ctx.stroke();
        }
    }

    if (GAME.hazard === 'kbbreak') {
        // Screw indicators
        const screws = getKBScrewPositions();
        screws.forEach((sp, idx) => {
            const fixed = GAME.kbScrews[idx];
            const screwColor = fixed ? COLORS.green : '#FF4444';
            if (!fixed) {
                const glowAlpha = 0.3 + Math.sin(now/200)*0.2;
                ctx.fillStyle = `rgba(255,100,0,${glowAlpha})`;
                ctx.beginPath(); ctx.arc(sp.x, sp.y, 50, 0, Math.PI*2); ctx.fill();
            }
            const screwBg = fixed ? 'rgba(0,230,118,0.3)' : 'rgba(255,68,68,0.3)';
            ctx.fillStyle = screwBg;
            ctx.beginPath(); ctx.arc(sp.x, sp.y, 40, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = fixed ? '#4CAF50' : '#888';
            ctx.beginPath(); ctx.arc(sp.x, sp.y, 22, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = screwColor; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(sp.x, sp.y, 22, 0, Math.PI*2); ctx.stroke();
            ctx.strokeStyle = fixed ? '#1B5E20' : '#444'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(sp.x-10, sp.y); ctx.lineTo(sp.x+10, sp.y); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(sp.x, sp.y-10); ctx.lineTo(sp.x, sp.y+10); ctx.stroke();
            if (fixed) drawText('\u2713', sp.x, sp.y-28, 28, COLORS.green, 'center');
        });

        // Screwdriver — 30% smaller than 3x (= 2.1x), cursor at TIP
        const sdx = GAME.hasScrewdriver ? GAME.mouseX : GAME.screwdriverPos.x;
        const sdy = GAME.hasScrewdriver ? GAME.mouseY : GAME.screwdriverPos.y;
        ctx.save();
        ctx.translate(sdx, sdy);
        ctx.rotate(GAME.hasScrewdriver ? -0.3 : 0.5);
        if (GAME.hasScrewdriver) {
            ctx.shadowColor = '#FFA000'; ctx.shadowBlur = 20;
        }
        // Everything drawn ABOVE origin so tip is at cursor (0,0)
        // Handle — 88x151 (30% smaller)
        drawRoundRect(-44, -354, 88, 151, 19, '#FFA000', '#E65100', 3);
        ctx.strokeStyle = '#E65100'; ctx.lineWidth = 3;
        for (let gr = 0; gr < 6; gr++) {
            ctx.beginPath(); ctx.moveTo(-32, -333+gr*22); ctx.lineTo(32, -333+gr*22); ctx.stroke();
        }
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(-38, -348, 25, 140);
        // Shaft — 31x168
        ctx.fillStyle = '#B0BEC5'; ctx.fillRect(-15.5, -203, 31, 168);
        // Tip — at origin (0,0) is the tip point
        ctx.fillStyle = '#78909C';
        ctx.beginPath(); ctx.moveTo(-19, -35); ctx.lineTo(19, -35); ctx.lineTo(10, 0); ctx.lineTo(-10, 0); ctx.fill();
        ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
        ctx.restore();
        if (!GAME.hasScrewdriver) {
            // Throbbing text above screwdriver
            const throb = 1 + Math.sin(now / 200) * 0.12;
            ctx.save(); ctx.translate(GAME.screwdriverPos.x, GAME.screwdriverPos.y - 400); ctx.scale(throb, throb);
            drawText('GRAB THE SCREWDRIVER!', 0, 0, 28, COLORS.gold, 'center', '#000', 4);
            ctx.restore();
        }
    }
}
