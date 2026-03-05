/**
 * WFH SURGEON — Render: All 7 Hazard Types + Desk-Level Elements
 */

function drawHazards() {
    if (!GAME.hazard) return;
    const M = MONITOR;
    const mcx = M.sx + M.sw/2, mcy = M.sy + M.sh/2;

    // === CAT HAZARD: Fills the WHOLE SCREEN ===
    if (GAME.hazard === 'cat') {
        ctx.fillStyle = 'rgba(0,0,0,0.65)';
        ctx.fillRect(0, 0, CW, CH);

        const cx2 = CW/2, cy2 = CH/2 - 20;
        const shrinkFactor = GAME.catFlashTimer > 0 ? 1 - 0.15 * (GAME.catFlashTimer / 300) : 1;
        const s = 2.2 * shrinkFactor;
        // Cat body
        drawShadowRoundRect(cx2-85*s, cy2-65*s, 170*s, 140*s, 75*s, '#FFA000', '#E65100', 4);
        // Ears
        ctx.fillStyle='#FFA000'; ctx.strokeStyle='#E65100'; ctx.lineWidth=4;
        ctx.beginPath(); ctx.moveTo(cx2-65*s,cy2-45*s); ctx.lineTo(cx2-90*s,cy2-120*s); ctx.lineTo(cx2-28*s,cy2-55*s); ctx.fill(); ctx.stroke();
        ctx.fillStyle='#FFCDD2'; ctx.beginPath(); ctx.moveTo(cx2-58*s,cy2-50*s); ctx.lineTo(cx2-80*s,cy2-105*s); ctx.lineTo(cx2-35*s,cy2-56*s); ctx.fill();
        ctx.fillStyle='#FFA000'; ctx.strokeStyle='#E65100';
        ctx.beginPath(); ctx.moveTo(cx2+65*s,cy2-45*s); ctx.lineTo(cx2+90*s,cy2-120*s); ctx.lineTo(cx2+28*s,cy2-55*s); ctx.fill(); ctx.stroke();
        ctx.fillStyle='#FFCDD2'; ctx.beginPath(); ctx.moveTo(cx2+58*s,cy2-50*s); ctx.lineTo(cx2+80*s,cy2-105*s); ctx.lineTo(cx2+35*s,cy2-56*s); ctx.fill();
        // Eyes
        ctx.fillStyle='#FFF'; ctx.strokeStyle='#000'; ctx.lineWidth=3;
        ctx.beginPath(); ctx.ellipse(cx2-30*s,cy2-15*s,22*s,30*s,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(cx2+30*s,cy2-15*s,22*s,30*s,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle='#000';
        ctx.beginPath(); ctx.ellipse(cx2-30*s,cy2-15*s,9*s,22*s,0,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx2+30*s,cy2-15*s,9*s,22*s,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#FFF';
        ctx.beginPath(); ctx.arc(cx2-36*s, cy2-24*s, 5*s, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx2+24*s, cy2-24*s, 5*s, 0, Math.PI*2); ctx.fill();
        // Nose & mouth
        ctx.fillStyle='#F48FB1'; ctx.beginPath(); ctx.moveTo(cx2-12*s,cy2+16*s); ctx.lineTo(cx2+12*s,cy2+16*s); ctx.lineTo(cx2,cy2+28*s); ctx.fill();
        ctx.strokeStyle='#000'; ctx.lineWidth=3;
        ctx.beginPath(); ctx.arc(cx2-14*s,cy2+32*s,14*s,0,Math.PI); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx2+14*s,cy2+32*s,14*s,0,Math.PI); ctx.stroke();
        // Whiskers
        ctx.strokeStyle='#FFF'; ctx.lineWidth=3;
        [-1,1].forEach(dir => {
            ctx.beginPath(); ctx.moveTo(cx2+dir*25*s,cy2+18*s); ctx.lineTo(cx2+dir*95*s,cy2+8*s); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx2+dir*25*s,cy2+26*s); ctx.lineTo(cx2+dir*100*s,cy2+26*s); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx2+dir*25*s,cy2+34*s); ctx.lineTo(cx2+dir*95*s,cy2+44*s); ctx.stroke();
        });
        // Paws
        drawShadowRoundRect(cx2-70*s,cy2+55*s,55*s,32*s,22*s,'#FFA000','#E65100',3);
        drawShadowRoundRect(cx2+15*s,cy2+55*s,55*s,32*s,22*s,'#FFA000','#E65100',3);
        // SCREAMING text
        let pulse = 1+Math.sin(performance.now()/120)*0.08;
        ctx.save(); ctx.translate(cx2, 55); ctx.scale(pulse, pulse);
        drawText(`\uD83D\uDC31 SHOO THE CAT!! Click ${3-GAME.catClicks} more!! \uD83D\uDC31`, 0, 0, 42, '#FFA000', 'center', '#000', 6);
        ctx.restore();
        ctx.save(); ctx.translate(cx2, CH - 80); ctx.scale(pulse, pulse);
        drawText('YOUR CAT IS ON THE DESK AGAIN!!!', 0, 0, 28, '#FF6F00', 'center', '#000', 4);
        ctx.restore();

        // Click flash overlay
        if (GAME.catFlashTimer > 0) {
            ctx.fillStyle = `rgba(255,255,255,${GAME.catFlashTimer/300 * 0.4})`;
            ctx.fillRect(0, 0, CW, CH);
        }
        // Star burst particles
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
        const flashColor = Math.floor(performance.now()/200) % 2 === 0 ? ad.color : '#FFD600';
        drawShadowRoundRect(x-4, y-4, w+8, h+8, 16, flashColor, null);
        drawShadowRoundRect(x, y, w, h, 14, ad.bg, '#333', 3);
        // Header bar
        drawRoundRect(x, y, w, 50, 14, ad.color, null); drawRect(x, y+20, w, 30, ad.color);

        // Single X button — randomized corner position
        const corner = GAME.adCloseCorner;
        let closeX, closeY;
        if (corner === 0)      { closeX = x + 8;       closeY = y + 8; }
        else if (corner === 1) { closeX = x + w - 58;  closeY = y + 8; }
        else if (corner === 2) { closeX = x + 8;       closeY = y + h - 58; }
        else                   { closeX = x + w - 58;  closeY = y + h - 58; }
        drawRoundRect(closeX, closeY, 50, 50, 8, '#424242', null);
        ctx.strokeStyle = '#FFF'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(closeX+14, closeY+14); ctx.lineTo(closeX+36, closeY+36); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(closeX+36, closeY+14); ctx.lineTo(closeX+14, closeY+36); ctx.stroke();

        // Ad content
        const headPulse = 1 + Math.sin(performance.now()/150)*0.04;
        ctx.save(); ctx.translate(x+w/2, y+80); ctx.scale(headPulse, headPulse);
        drawText(ad.headline, 0, 0, 34, ad.color, 'center', null, 0, 'bold');
        ctx.restore();
        drawText(ad.sub, x+w/2, y+h*0.38, 22, '#555', 'center', null, 0, 'normal');
        const ctaW = 300, ctaH = 55;
        const ctaPulse = 1 + Math.sin(performance.now()/200)*0.05;
        ctx.save(); ctx.translate(x+w/2, y+h*0.55); ctx.scale(ctaPulse, ctaPulse);
        drawRoundRect(-ctaW/2, -ctaH/2, ctaW, ctaH, ctaH/2, ad.color, null);
        drawText(ad.cta, 0, 0, 24, '#FFF', 'center');
        ctx.restore();
        drawText('*Not responsible for any surgical outcomes', x+w/2, y+h*0.72, 12, '#BBB', 'center', null, 0, 'normal');
        drawText('Find the X or press ESC to dismiss', x+w/2, y+h-18, 14, '#999', 'center', null, 0, 'normal');
        for (let sp = 0; sp < 5; sp++) {
            const spx = x + 30 + Math.random()*(w-60);
            const spy = y + 60 + Math.random()*(h-100);
            const spEmoji = ['\u2728','\uD83D\uDCAB','\u2B50','\uD83C\uDF89','\uD83D\uDD25'][sp];
            drawText(spEmoji, spx, spy, 16+Math.random()*8, '#FFF', 'center');
        }
    }
    else if (GAME.hazard === 'coffee') {
        const s = Math.max(0, 1-(GAME.coffeeWipe/3000));
        // Multiple organic splat blobs
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
            if (br > 2) {
                ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI*2); ctx.fill();
            }
        });
        // Splash droplets radiating outward
        for (let d = 0; d < 8; d++) {
            const angle = (d / 8) * Math.PI * 2 + 0.3;
            const dist = M.sw * 0.32 * s;
            const dx = mcx + Math.cos(angle) * dist;
            const dy = mcy + Math.sin(angle) * dist;
            ctx.fillStyle = browns[d % browns.length];
            ctx.beginPath(); ctx.arc(dx, dy, 8 * s, 0, Math.PI*2); ctx.fill();
        }
        // Drip effect
        ctx.fillStyle = '#5D4037';
        for (let d = 0; d < 4; d++) {
            const dx = mcx + (d-1.5)*80;
            const dripLen = Math.sin(performance.now()/400 + d)*20 + 30;
            ctx.beginPath(); ctx.moveTo(dx-8, mcy+M.sw*0.15*s); ctx.quadraticCurveTo(dx, mcy+M.sw*0.15*s+dripLen*s, dx+8, mcy+M.sw*0.15*s); ctx.fill();
        }
        let pulse2 = 1+Math.sin(performance.now()/120)*0.08;
        ctx.save(); ctx.translate(mcx, M.sy + 28); ctx.scale(pulse2, pulse2);
        drawText('\u2615 COFFEE SPILL!! WIPE IT UP!! \u2615', 0, 0, 38, '#D7CCC8', 'center', '#000', 6);
        ctx.restore();
    }
    else if (GAME.hazard === 'battery') {
        const bw = 180, bh = 90;
        drawRoundRect(mcx-bw/2, mcy-bh/2-20, bw, bh, 14, '#333', '#FF4444', 4);
        drawRect(mcx+bw/2, mcy-22-20, 14, 44, '#FF4444');
        const flashPct = (Math.sin(performance.now()/200)+1)/2 * 0.3;
        drawRoundRect(mcx-bw/2+8, mcy-bh/2+8-20, (bw-16)*flashPct, bh-16, 10, COLORS.red, null);
        ctx.fillStyle = COLORS.red;
        ctx.beginPath();
        ctx.moveTo(mcx-10, mcy-bh/2+14-20); ctx.lineTo(mcx+15, mcy-10-20);
        ctx.lineTo(mcx+2, mcy-8-20); ctx.lineTo(mcx+20, mcy+bh/2-18-20);
        ctx.lineTo(mcx-5, mcy+2-20); ctx.lineTo(mcx+8, mcy+4-20);
        ctx.closePath(); ctx.fill();
        let pulse3 = 1+Math.sin(performance.now()/120)*0.08;
        ctx.save(); ctx.translate(mcx, mcy+65); ctx.scale(pulse3, pulse3);
        drawText('\uD83D\uDD0B BATTERY DYING!! PLUG IN NOW!! \u26A1', 0, 0, 36, COLORS.red, 'center', '#000', 6);
        ctx.restore();
        drawText('Drag the charger to the outlet!', mcx, mcy+100, 22, '#CCC', 'center', null, 0, 'normal');
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
            const tearY = M.sy + (performance.now()/3 + t*120) % M.sh;
            ctx.fillStyle = 'rgba(0,255,255,0.05)';
            ctx.fillRect(M.sx, tearY, M.sw, 4);
        }
        let pulse4 = 1+Math.sin(performance.now()/120)*0.08;
        ctx.save(); ctx.translate(mcx, mcy-20); ctx.scale(pulse4, pulse4);
        drawText(`\uD83D\uDCF6 WI-FI IS DOWN!!!`, 0, 0, 52, COLORS.red, 'center', '#000', 8);
        ctx.restore();
        drawText(`SMASH THE ROUTER!! ${3-GAME.routerClicks} more clicks!`, mcx, mcy+35, 28, '#CCC', 'center', null, 0, 'normal');
    }
    else if (GAME.hazard === 'kbbreak') {
        drawText('\u2328\uFE0F', mcx, mcy - 30, 80, '#FFF', 'center');
        let pulse5 = 1+Math.sin(performance.now()/120)*0.08;
        ctx.save(); ctx.translate(mcx, mcy+40); ctx.scale(pulse5, pulse5);
        drawText('KEYBOARD DISCONNECTED!!', 0, 0, 40, COLORS.red, 'center', '#000', 6);
        ctx.restore();
        const fixedCount = GAME.kbScrews.filter(s => s).length;
        drawText(`Fix the screws! ${fixedCount}/4 done`, mcx, mcy+85, 24, '#CCC', 'center', null, 0, 'normal');
        if (!GAME.hasScrewdriver) drawText('Pick up the screwdriver from the desk!', mcx, mcy+115, 18, COLORS.gold, 'center', null, 0, 'normal');
    }
    else if (GAME.hazard === 'malware') {
        for (let i = 0; i < 60; i++) {
            const gx = M.sx + Math.random()*M.sw;
            const gy = M.sy + Math.random()*M.sh;
            ctx.fillStyle = `rgba(${Math.random()>0.5?255:0},${Math.random()*255|0},${Math.random()>0.5?255:0},${Math.random()*0.3})`;
            ctx.fillRect(gx, gy, Math.random()*40+5, Math.random()*4+1);
        }
        const popW = 500, popH = 280;
        const popX = mcx - popW/2, popY = mcy - popH/2;
        drawShadowRoundRect(popX, popY, popW, popH, 14, '#1A1A2E', '#FF4444', 3);
        drawRoundRect(popX, popY, popW, 45, 14, '#C62828', null); drawRect(popX, popY+20, popW, 25, '#C62828');
        drawText('\u26A0\uFE0F MALWARE DETECTED \u26A0\uFE0F', popX+popW/2, popY+22, 22, '#FFF', 'center');
        drawText('\uD83E\uDDA0 SYSTEM INFECTED \uD83E\uDDA0', popX+popW/2, popY+75, 32, '#FF4444', 'center');
        drawText(`Click all virus icons to clean! (${GAME.virusesClicked}/5)`, popX+popW/2, popY+115, 20, '#CCC', 'center', null, 0, 'normal');
        drawRoundRect(popX+40, popY+140, popW-80, 20, 10, '#333', null);
        const scanPct = GAME.virusesClicked / 5;
        if (scanPct > 0) drawRoundRect(popX+43, popY+143, (popW-86)*scanPct, 14, 7, COLORS.green, null);
        drawText('SCANNING...', popX+popW/2, popY+150, 12, '#AAA', 'center', null, 0, 'normal');
        // Virus icons — 3x BIGGER (195px), moving, more glow
        GAME.virusIcons.forEach(v => {
            if (!v.alive) return;
            const vPulse = 1 + Math.sin(performance.now()/200 + v.x)*0.15;
            const vRot = (performance.now()/1000 + v.x * 0.01) % (Math.PI * 2);
            ctx.save(); ctx.translate(v.x, v.y); ctx.rotate(vRot); ctx.scale(vPulse, vPulse);
            drawText('\uD83E\uDDA0', 0, 0, 195, '#FFF', 'center');
            ctx.restore();
            // Much bigger glow
            ctx.fillStyle = 'rgba(255,0,0,0.15)';
            ctx.beginPath(); ctx.arc(v.x, v.y, 120, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = 'rgba(255,0,0,0.08)';
            ctx.beginPath(); ctx.arc(v.x, v.y, 165, 0, Math.PI*2); ctx.fill();
        });
    }

    ctx.restore();

    // === DESK-LEVEL hazard elements (outside monitor clip) ===
    if (GAME.hazard === 'battery') {
        // Socket — left side of monitor
        drawShadowRoundRect(GAME.socketPos.x-80, GAME.socketPos.y-80, 160, 160, 16, '#FAFAFA', '#B0BEC5', 3);
        drawRoundRect(GAME.socketPos.x-70, GAME.socketPos.y-70, 140, 140, 10, '#F5F5F5', '#E0E0E0', 1);
        // Bigger slots
        drawRoundRect(GAME.socketPos.x-22, GAME.socketPos.y-20, 18, 40, 5, '#1A1A1A', null);
        drawRoundRect(GAME.socketPos.x+4, GAME.socketPos.y-20, 18, 40, 5, '#1A1A1A', null);
        // Ground hole
        ctx.fillStyle = '#1A1A1A';
        ctx.beginPath(); ctx.arc(GAME.socketPos.x, GAME.socketPos.y+35, 9, 0, Math.PI*2); ctx.fill();
        drawText('\u26A1', GAME.socketPos.x, GAME.socketPos.y+58, 22, '#888', 'center');
        // Cord — THICKER, from plug to socket
        ctx.lineWidth=22; ctx.strokeStyle='#1A1A1A';
        ctx.beginPath(); ctx.moveTo(GAME.plugPos.x, GAME.plugPos.y);
        ctx.quadraticCurveTo(GAME.plugPos.x + (GAME.socketPos.x - GAME.plugPos.x)*0.5, GAME.plugPos.y + 80, GAME.socketPos.x, GAME.socketPos.y);
        ctx.stroke();
        ctx.lineWidth=18; ctx.strokeStyle='#333';
        ctx.beginPath(); ctx.moveTo(GAME.plugPos.x, GAME.plugPos.y);
        ctx.quadraticCurveTo(GAME.plugPos.x + (GAME.socketPos.x - GAME.plugPos.x)*0.5, GAME.plugPos.y + 80, GAME.socketPos.x, GAME.socketPos.y);
        ctx.stroke();
        // Plug — BIGGER (100×130)
        drawShadowRoundRect(GAME.plugPos.x-50, GAME.plugPos.y-65, 100, 130, 14, '#333', '#1A1A1A', 3);
        // Grip ridges
        ctx.strokeStyle = '#444'; ctx.lineWidth = 1;
        for (let gr = 0; gr < 5; gr++) {
            ctx.beginPath(); ctx.moveTo(GAME.plugPos.x-35, GAME.plugPos.y+10+gr*12); ctx.lineTo(GAME.plugPos.x+35, GAME.plugPos.y+10+gr*12); ctx.stroke();
        }
        // Prongs — BIGGER
        drawRoundRect(GAME.plugPos.x-20, GAME.plugPos.y-100, 14, 40, 4, '#CCC', '#AAA', 1);
        drawRoundRect(GAME.plugPos.x+6, GAME.plugPos.y-100, 14, 40, 4, '#CCC', '#AAA', 1);
    }

    if (GAME.hazard === 'kbbreak') {
        // Screw indicators at keyboard corners — BIGGER
        const screws = getKBScrewPositions();
        screws.forEach((sp, idx) => {
            const fixed = GAME.kbScrews[idx];
            const screwColor = fixed ? COLORS.green : '#FF4444';
            const screwBg = fixed ? 'rgba(0,230,118,0.3)' : 'rgba(255,68,68,0.3)';
            // Bigger glow
            ctx.fillStyle = screwBg;
            ctx.beginPath(); ctx.arc(sp.x, sp.y, 40, 0, Math.PI*2); ctx.fill();
            // Bigger screw head
            ctx.fillStyle = fixed ? '#4CAF50' : '#888';
            ctx.beginPath(); ctx.arc(sp.x, sp.y, 22, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = screwColor; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(sp.x, sp.y, 22, 0, Math.PI*2); ctx.stroke();
            // Cross slot
            ctx.strokeStyle = fixed ? '#1B5E20' : '#444'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(sp.x-10, sp.y); ctx.lineTo(sp.x+10, sp.y); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(sp.x, sp.y-10); ctx.lineTo(sp.x, sp.y+10); ctx.stroke();
            if (fixed) drawText('\u2713', sp.x, sp.y-28, 28, COLORS.green, 'center');
        });

        // Screwdriver — 3X BIGGER (arcade scale)
        const sdx = GAME.hasScrewdriver ? GAME.mouseX : GAME.screwdriverPos.x;
        const sdy = GAME.hasScrewdriver ? GAME.mouseY : GAME.screwdriverPos.y;
        ctx.save();
        ctx.translate(sdx, sdy);
        ctx.rotate(GAME.hasScrewdriver ? -0.3 : 0.5);
        // Handle — 42x72
        drawRoundRect(-21, -75, 42, 72, 9, '#FFA000', '#E65100', 3);
        // Grip ridges
        ctx.strokeStyle = '#E65100'; ctx.lineWidth = 2;
        for (let gr = 0; gr < 5; gr++) {
            ctx.beginPath(); ctx.moveTo(-15, -65+gr*13); ctx.lineTo(15, -65+gr*13); ctx.stroke();
        }
        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(-18, -72, 12, 66);
        // Shaft — 15x80
        ctx.fillStyle = '#B0BEC5'; ctx.fillRect(-7.5, -3, 15, 80);
        // Tip — wider
        ctx.fillStyle = '#78909C';
        ctx.beginPath(); ctx.moveTo(-9, 77); ctx.lineTo(9, 77); ctx.lineTo(5, 97); ctx.lineTo(-5, 97); ctx.fill();
        ctx.restore();
        if (!GAME.hasScrewdriver) {
            drawText('\uD83D\uDD27 GRAB ME!', GAME.screwdriverPos.x, GAME.screwdriverPos.y - 85, 22, COLORS.gold, 'center');
        }
    }
}
