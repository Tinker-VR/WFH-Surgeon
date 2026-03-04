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
        // Shrink on click feedback
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
        drawText(`🐱 SHOO THE CAT!! Click ${3-GAME.catClicks} more!! 🐱`, 0, 0, 42, '#FFA000', 'center', '#000', 6);
        ctx.restore();
        ctx.save(); ctx.translate(cx2, CH - 40); ctx.scale(pulse, pulse);
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
            drawText('⭐', star.x, star.y, star.size, '#FFD54F', 'center');
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
        // X buttons — BIGGER (40×40), differentiated
        const fakeXPositions = [{bx: x+w-48, by: y+8}, {bx: x+8, by: y+8}, {bx: x+w/2-20, by: y+h-48}];
        fakeXPositions.forEach((fp, fi) => {
            if (fi === 0) {
                // Real close button — gray, subtle but findable
                drawRoundRect(fp.bx, fp.by, 40, 40, 8, 'rgba(100,100,100,0.5)', null);
                ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(fp.bx+12, fp.by+12); ctx.lineTo(fp.bx+28, fp.by+28); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(fp.bx+28, fp.by+12); ctx.lineTo(fp.bx+12, fp.by+28); ctx.stroke();
            } else {
                // Fake X buttons — red, pulsing, with "CLICK HERE!" bait
                const fakeScale = 1 + Math.sin(performance.now()/200 + fi)*0.1;
                ctx.save(); ctx.translate(fp.bx+20, fp.by+20); ctx.scale(fakeScale, fakeScale);
                drawRoundRect(-20, -20, 40, 40, 8, COLORS.red, '#FF1744', 2);
                drawText('✕', 0, 0, 22, '#FFF', 'center');
                ctx.restore();
                // "CLICK HERE!" bait text
                const arrowBob = Math.sin(performance.now()/250 + fi) * 4;
                if (fi === 1) {
                    drawText('CLICK HERE! →', fp.bx + 55, fp.by + 20 + arrowBob, 14, COLORS.red, 'left');
                } else {
                    drawText('← CLOSE AD', fp.bx - 10, fp.by + 20 + arrowBob, 14, COLORS.red, 'right');
                }
            }
        });
        // Ad content
        drawText('⚠️ URGENT ⚠️', x+w/2, y+25, 20, '#FFF', 'center');
        const headPulse = 1 + Math.sin(performance.now()/150)*0.04;
        ctx.save(); ctx.translate(x+w/2, y+h*0.28); ctx.scale(headPulse, headPulse);
        drawText(ad.headline, 0, 0, 34, ad.color, 'center', null, 0, 'bold');
        ctx.restore();
        drawText(ad.sub, x+w/2, y+h*0.42, 22, '#555', 'center', null, 0, 'normal');
        const ctaW = 300, ctaH = 55;
        const ctaPulse = 1 + Math.sin(performance.now()/200)*0.05;
        ctx.save(); ctx.translate(x+w/2, y+h*0.58); ctx.scale(ctaPulse, ctaPulse);
        drawRoundRect(-ctaW/2, -ctaH/2, ctaW, ctaH, ctaH/2, ad.color, null);
        drawText(ad.cta, 0, 0, 24, '#FFF', 'center');
        ctx.restore();
        const arrowBounce = Math.sin(performance.now()/300) * 10;
        drawText('👇👇👇', x+w/2, y+h*0.72+arrowBounce, 28, ad.color, 'center');
        drawText('*Not responsible for any surgical outcomes', x+w/2, y+h*0.82, 12, '#BBB', 'center', null, 0, 'normal');
        drawText('Click gray × or press ESC to dismiss', x+w/2, y+h-18, 14, '#999', 'center', null, 0, 'normal');
        for (let sp = 0; sp < 5; sp++) {
            const spx = x + 30 + Math.random()*(w-60);
            const spy = y + 60 + Math.random()*(h-100);
            const spEmoji = ['✨','💫','⭐','🎉','🔥'][sp];
            drawText(spEmoji, spx, spy, 16+Math.random()*8, '#FFF', 'center');
        }
    }
    else if (GAME.hazard === 'coffee') {
        const s = Math.max(0, 1-(GAME.coffeeWipe/3000));
        const splashR = M.sw * 0.45 * s;
        ctx.fillStyle = '#4E342E';
        ctx.beginPath(); ctx.arc(mcx, mcy, splashR, 0, Math.PI*2); ctx.fill();
        const splatOffsets = [
            [-0.6, 0.3, 0.5], [0.5, -0.2, 0.55], [-0.2, -0.5, 0.4], [0.35, 0.5, 0.45],
            [-0.4, -0.3, 0.35], [0.6, 0.1, 0.38], [-0.1, 0.6, 0.3], [0.2, -0.6, 0.32]
        ];
        splatOffsets.forEach(([ox, oy, sr]) => {
            ctx.beginPath(); ctx.arc(mcx + splashR*ox, mcy + splashR*oy, splashR*sr, 0, Math.PI*2); ctx.fill();
        });
        ctx.fillStyle = '#5D4037';
        for (let d = 0; d < 4; d++) {
            const dx = mcx + (d-1.5)*80;
            const dripLen = Math.sin(performance.now()/400 + d)*20 + 30;
            ctx.beginPath(); ctx.moveTo(dx-8, mcy+splashR*0.4); ctx.quadraticCurveTo(dx, mcy+splashR*0.4+dripLen*s, dx+8, mcy+splashR*0.4); ctx.fill();
        }
        ctx.strokeStyle = '#6D4C41'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(mcx, mcy, splashR*0.85, 0, Math.PI*2); ctx.stroke();
        let pulse = 1+Math.sin(performance.now()/120)*0.08;
        ctx.save(); ctx.translate(mcx, M.sy + 28); ctx.scale(pulse, pulse);
        drawText('☕ COFFEE SPILL!! WIPE IT UP!! ☕', 0, 0, 38, '#D7CCC8', 'center', '#000', 6);
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
        let pulse = 1+Math.sin(performance.now()/120)*0.08;
        ctx.save(); ctx.translate(mcx, mcy+65); ctx.scale(pulse, pulse);
        drawText('🔋 BATTERY DYING!! PLUG IN NOW!! ⚡', 0, 0, 36, COLORS.red, 'center', '#000', 6);
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
        let pulse = 1+Math.sin(performance.now()/120)*0.08;
        ctx.save(); ctx.translate(mcx, mcy-20); ctx.scale(pulse, pulse);
        drawText(`📶 WI-FI IS DOWN!!!`, 0, 0, 52, COLORS.red, 'center', '#000', 8);
        ctx.restore();
        drawText(`SMASH THE ROUTER!! ${3-GAME.routerClicks} more clicks!`, mcx, mcy+35, 28, '#CCC', 'center', null, 0, 'normal');
    }
    else if (GAME.hazard === 'kbbreak') {
        drawText('⌨️', mcx, mcy - 30, 80, '#FFF', 'center');
        let pulse = 1+Math.sin(performance.now()/120)*0.08;
        ctx.save(); ctx.translate(mcx, mcy+40); ctx.scale(pulse, pulse);
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
        drawText('⚠️ MALWARE DETECTED ⚠️', popX+popW/2, popY+22, 22, '#FFF', 'center');
        drawText('🦠 SYSTEM INFECTED 🦠', popX+popW/2, popY+75, 32, '#FF4444', 'center');
        drawText(`Click all virus icons to clean! (${GAME.virusesClicked}/5)`, popX+popW/2, popY+115, 20, '#CCC', 'center', null, 0, 'normal');
        drawRoundRect(popX+40, popY+140, popW-80, 20, 10, '#333', null);
        const scanPct = GAME.virusesClicked / 5;
        if (scanPct > 0) drawRoundRect(popX+43, popY+143, (popW-86)*scanPct, 14, 7, COLORS.green, null);
        drawText('SCANNING...', popX+popW/2, popY+150, 12, '#AAA', 'center', null, 0, 'normal');
        // Virus icons — MUCH BIGGER with rotation
        GAME.virusIcons.forEach(v => {
            if (!v.alive) return;
            const vPulse = 1 + Math.sin(performance.now()/200 + v.x)*0.15;
            const vRot = (performance.now()/1000 + v.x * 0.01) % (Math.PI * 2);
            ctx.save(); ctx.translate(v.x, v.y); ctx.rotate(vRot); ctx.scale(vPulse, vPulse);
            drawText('🦠', 0, 0, 65, '#FFF', 'center');
            ctx.restore();
            // Bigger glow
            ctx.fillStyle = 'rgba(255,0,0,0.15)';
            ctx.beginPath(); ctx.arc(v.x, v.y, 40, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = 'rgba(255,0,0,0.08)';
            ctx.beginPath(); ctx.arc(v.x, v.y, 55, 0, Math.PI*2); ctx.fill();
        });
    }

    ctx.restore();

    // === DESK-LEVEL hazard elements (outside monitor clip) ===
    if (GAME.hazard === 'battery') {
        // BIGGER socket (140×140)
        drawShadowRoundRect(GAME.socketPos.x-70, GAME.socketPos.y-70, 140, 140, 16, '#FAFAFA', '#B0BEC5', 3);
        // Face plate detail
        drawRoundRect(GAME.socketPos.x-60, GAME.socketPos.y-60, 120, 120, 10, '#F5F5F5', '#E0E0E0', 1);
        // Bigger slots
        drawRoundRect(GAME.socketPos.x-20, GAME.socketPos.y-18, 16, 36, 5, '#1A1A1A', null);
        drawRoundRect(GAME.socketPos.x+4, GAME.socketPos.y-18, 16, 36, 5, '#1A1A1A', null);
        // Ground hole
        ctx.fillStyle = '#1A1A1A';
        ctx.beginPath(); ctx.arc(GAME.socketPos.x, GAME.socketPos.y+30, 8, 0, Math.PI*2); ctx.fill();
        drawText('⚡', GAME.socketPos.x, GAME.socketPos.y+52, 20, '#888', 'center');
        // Cord — THICKER
        ctx.lineWidth=22; ctx.strokeStyle='#1A1A1A';
        ctx.beginPath(); ctx.moveTo(CW/2, CH); ctx.quadraticCurveTo(CW/2, GAME.plugPos.y+50, GAME.plugPos.x, GAME.plugPos.y); ctx.stroke();
        ctx.lineWidth=18; ctx.strokeStyle='#333';
        ctx.beginPath(); ctx.moveTo(CW/2, CH); ctx.quadraticCurveTo(CW/2, GAME.plugPos.y+50, GAME.plugPos.x, GAME.plugPos.y); ctx.stroke();
        // Plug — BIGGER (80×105)
        drawShadowRoundRect(GAME.plugPos.x-40, GAME.plugPos.y-52, 80, 105, 14, '#333', '#1A1A1A', 3);
        // Grip ridges
        ctx.strokeStyle = '#444'; ctx.lineWidth = 1;
        for (let gr = 0; gr < 4; gr++) {
            ctx.beginPath(); ctx.moveTo(GAME.plugPos.x-28, GAME.plugPos.y+10+gr*10); ctx.lineTo(GAME.plugPos.x+28, GAME.plugPos.y+10+gr*10); ctx.stroke();
        }
        // Prongs — BIGGER (12×35)
        drawRoundRect(GAME.plugPos.x-16, GAME.plugPos.y-82, 12, 35, 4, '#CCC', '#AAA', 1);
        drawRoundRect(GAME.plugPos.x+4, GAME.plugPos.y-82, 12, 35, 4, '#CCC', '#AAA', 1);
    }

    if (GAME.hazard === 'kbbreak') {
        // BIGGER screw indicators at keyboard corners
        const screws = getKBScrewPositions();
        screws.forEach((sp, idx) => {
            const fixed = GAME.kbScrews[idx];
            const screwColor = fixed ? COLORS.green : '#FF4444';
            const screwBg = fixed ? 'rgba(0,230,118,0.3)' : 'rgba(255,68,68,0.3)';
            // Bigger glow
            ctx.fillStyle = screwBg;
            ctx.beginPath(); ctx.arc(sp.x, sp.y, 24, 0, Math.PI*2); ctx.fill();
            // Bigger screw head
            ctx.fillStyle = fixed ? '#4CAF50' : '#888';
            ctx.beginPath(); ctx.arc(sp.x, sp.y, 14, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = screwColor; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(sp.x, sp.y, 14, 0, Math.PI*2); ctx.stroke();
            // Cross slot
            ctx.strokeStyle = fixed ? '#1B5E20' : '#444'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(sp.x-7, sp.y); ctx.lineTo(sp.x+7, sp.y); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(sp.x, sp.y-7); ctx.lineTo(sp.x, sp.y+7); ctx.stroke();
            if (fixed) drawText('✓', sp.x, sp.y-22, 18, COLORS.green, 'center');
        });

        // Screwdriver — MUCH BIGGER
        const sdx = GAME.hasScrewdriver ? GAME.mouseX : GAME.screwdriverPos.x;
        const sdy = GAME.hasScrewdriver ? GAME.mouseY : GAME.screwdriverPos.y;
        ctx.save();
        ctx.translate(sdx, sdy);
        ctx.rotate(GAME.hasScrewdriver ? -0.3 : 0.5);
        // Handle — BIGGER (28×48)
        drawRoundRect(-14, -50, 28, 48, 6, '#FFA000', '#E65100', 2);
        // Grip ridges
        ctx.strokeStyle = '#E65100'; ctx.lineWidth = 1;
        for (let gr = 0; gr < 4; gr++) {
            ctx.beginPath(); ctx.moveTo(-10, -42+gr*10); ctx.lineTo(10, -42+gr*10); ctx.stroke();
        }
        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(-12, -48, 8, 44);
        // Shaft — BIGGER (10×55)
        ctx.fillStyle = '#B0BEC5'; ctx.fillRect(-5, -2, 10, 55);
        // Tip — wider
        ctx.fillStyle = '#78909C';
        ctx.beginPath(); ctx.moveTo(-6, 53); ctx.lineTo(6, 53); ctx.lineTo(3, 65); ctx.lineTo(-3, 65); ctx.fill();
        ctx.restore();
        if (!GAME.hasScrewdriver) {
            drawText('🔧 GRAB ME!', GAME.screwdriverPos.x, GAME.screwdriverPos.y - 60, 18, COLORS.gold, 'center');
        }
    }
}
