/**
 * WFH SURGEON — Input Handlers (mouse + keyboard)
 */

window.addEventListener('mousemove', (e) => {
    updateMousePos(e);
    GAME.mouseIdleTimer = 0;
    if (GAME.paused) return;
    if (GAME.hazard === 'battery' && GAME.batteryDrag) {
        GAME.plugPos.x = GAME.mouseX;
        GAME.plugPos.y = GAME.mouseY;
    }
    if (GAME.hazard === 'coffee') {
        const M = MONITOR;
        const splatX = M.sx + M.sw/2, splatY = M.sy + M.sh/2;
        if (Math.hypot(GAME.mouseX - splatX, GAME.mouseY - splatY) < M.sw*0.45) {
            GAME.coffeeWipe += Math.hypot(GAME.mouseX - GAME.lastMouseX, GAME.mouseY - GAME.lastMouseY);
            if (GAME.coffeeWipe > 3000) clearHazard();
        }
    }
    GAME.lastMouseX = GAME.mouseX;
    GAME.lastMouseY = GAME.mouseY;
});

window.addEventListener('mouseup', (e) => {
    updateMousePos(e);
    if (GAME.hazard === 'battery' && GAME.batteryDrag) {
        GAME.batteryDrag = false;
        if (Math.hypot(GAME.plugPos.x - GAME.socketPos.x, GAME.plugPos.y - GAME.socketPos.y) < 100) clearHazard();
    }
});

window.addEventListener('mousedown', (e) => {
    updateMousePos(e);
    if (!AudioEngine.ctx) { AudioEngine.init(); AudioEngine.setBGMMode('menu'); AudioEngine.startBGM(); }

    // Pause button — only during PLAYING state (check BEFORE paused block)
    const pb = GAME.pauseBtn;
    if (GAME.state === 'PLAYING' && isHover(pb.x, pb.y, pb.w, pb.h)) {
        AudioEngine.playClick();
        GAME.paused = !GAME.paused;
        return;
    }
    // Resume button on pause overlay (big center button)
    if (GAME.state === 'PLAYING' && GAME.paused && isHover(CW/2 - 110, CH/2 + 100, 220, 55)) {
        AudioEngine.playClick();
        GAME.paused = false;
        return;
    }
    // Block ALL other clicks while paused
    if (GAME.paused) return;

    const mb = GAME.muteBtn;
    if (isHover(mb.x, mb.y, mb.w, mb.h)) {
        AudioEngine.enabled = !AudioEngine.enabled;
        if (!AudioEngine.enabled) AudioEngine.stopBGM();
        else AudioEngine.startBGM();
        return;
    }

    const M = MONITOR;
    const sx = M.sx, sy = M.sy, sw = M.sw, sh = M.sh;

    if (GAME.state === 'MENU') {
        const btnW = 200, btnH = 44, btnGap = 25;
        const total = btnW * 3 + btnGap * 2;
        const bx0 = sx + (sw - total) / 2;
        const cy = M.uiY + M.uiH/2;
        const by = cy + 10;
        if (isHover(bx0, by, btnW, btnH)) {
            AudioEngine.playClick(); GAME.rank = STARTING_RANK; GAME.hearts = 3;
            GAME.pendingStart = true; GAME.state = 'HELP'; GAME.helpPage = 0;
        }
        if (isHover(bx0 + btnW + btnGap, by, btnW, btnH)) { AudioEngine.playClick(); GAME.storeReturnState = 'MENU'; GAME.state = 'STORE'; }
        if (isHover(bx0 + (btnW + btnGap)*2, by, btnW, btnH)) { AudioEngine.playClick(); GAME.state = 'HELP'; GAME.helpPage = 0; }
        return;
    }

    if (GAME.state === 'HELP') {
        const mx = CW/2 - 360, my = CH/2 - 280, mw = 720, mh = 560;
        if (isHover(mx + mw - 55, my + 12, 42, 42)) {
            AudioEngine.playClick();
            if (GAME.pendingStart) { GAME.pendingStart = false; startOperation(); } else GAME.state = 'MENU';
            return;
        }
        if (GAME.helpPage > 0 && isHover(mx + 25, my + mh - 65, 110, 44)) { AudioEngine.playClick(); GAME.helpPage--; return; }
        if (GAME.helpPage < 3 && isHover(mx + mw - 135, my + mh - 65, 110, 44)) { AudioEngine.playClick(); GAME.helpPage++; return; }
        if (isHover(CW/2 - 130, my + mh - 70, 260, 50)) {
            AudioEngine.playClick();
            if (GAME.pendingStart) { GAME.pendingStart = false; startOperation(); } else GAME.state = 'MENU';
        }
        return;
    }

    if (GAME.state === 'STORE') {
        // BACK button
        if (isHover(sx + 20, sy + 14, 110, 38)) {
            AudioEngine.playClick();
            GAME.state = GAME.storeReturnState || 'MENU';
        }
        // NEXT OPERATION button — top-right (only when coming from resolution)
        if (GAME.storeReturnState === 'RESOLUTION') {
            const nextBtnW = 220, nextBtnH = 38;
            const nextBtnX = sx + sw - 20 - nextBtnW;
            const nextBtnY = sy + 14;
            if (isHover(nextBtnX, nextBtnY, nextBtnW, nextBtnH)) {
                AudioEngine.playClick();
                startOperation();
                return;
            }
        }
        // Single-page grid — all items (4-col)
        const cols = 4;
        const cardW = Math.floor((sw - 30 - (cols-1)*10) / cols);
        STORE_ITEMS.forEach((item, i) => {
            const col = i % cols, row = Math.floor(i / cols);
            const ix = sx + 15 + col * (cardW + 10);
            const iy = sy + 78 + row * 118;
            const bx2 = ix + cardW/2 - 50, by2 = iy + 78;
            if (isHover(bx2, by2, 100, 26)) {
                if (item.consumable) {
                    if (GAME.cash >= item.price && GAME.hearts < GAME.maxHearts) {
                        GAME.cash -= item.price; GAME.hearts++;
                        AudioEngine.playBuy(); addNotification('Heart restored!', '❤️');
                    }
                } else {
                    if (GAME.upgrades[item.id]) return;
                    if (GAME.cash >= item.price) {
                        GAME.cash -= item.price; GAME.upgrades[item.id] = true;
                        AudioEngine.playBuy(); addNotification(`${item.title} equipped!`, item.icon);
                        if (item.id === 'lawyer') { GAME.maxHearts = 4; GAME.hearts++; }
                    }
                }
            }
        });
        return;
    }

    if (GAME.state === 'RESOLUTION') {
        if (GAME.showQuitConfirm) {
            const qx = sx + sw/2 - 210, qy = sy + sh/2 - 75;
            if (isHover(qx + 30, qy + 103, 170, 52)) {
                AudioEngine.playClick();
                GAME.cash = STARTING_CASH; GAME.highestRank = STARTING_RANK; GAME.rank = STARTING_RANK;
                GAME.hearts = 3; GAME.maxHearts = 3;
                GAME.upgrades = { ...DEFAULT_UPGRADES };
                GAME.showQuitConfirm = false; GAME.state = 'MENU'; resetHospitalAnimations(); AudioEngine.setBGMMode('menu');
            }
            if (isHover(qx + 220, qy + 103, 170, 52)) { AudioEngine.playClick(); GAME.showQuitConfirm = false; }
            return;
        }
        const btnW = 220, btnH = 55, gap = 30;
        const total = btnW*2 + gap;
        const bx0 = sx + (sw - total)/2;
        const by = sy + sh - 80;

        if (GAME.lastResult === 'WIN') {
            // OPEN SHOP
            if (isHover(bx0, by, btnW, btnH)) { AudioEngine.playClick(); GAME.storeReturnState = 'RESOLUTION'; GAME.state = 'STORE'; }
            // QUIT
            if (isHover(bx0+btnW+gap, by, btnW, btnH)) { AudioEngine.playClick(); GAME.showQuitConfirm = true; }
        } else {
            // RETRY — must afford the cost, then go to shop
            const retryCost = (GAME.rank+1)*300;
            if (isHover(bx0, by, btnW, btnH) && GAME.cash >= retryCost) {
                AudioEngine.playClick();
                GAME.cash -= retryCost;
                GAME.maxHearts = GAME.upgrades.lawyer ? 4 : 3;
                GAME.hearts = GAME.maxHearts;
                GAME.storeReturnState = 'RESOLUTION';
                GAME.state = 'STORE';
            }
            // QUIT
            if (isHover(bx0+btnW+gap, by, btnW, btnH)) { AudioEngine.playClick(); GAME.showQuitConfirm = true; }
        }
        return;
    }

    if (GAME.state === 'PLAYING') {
        if (GAME.hazard === 'cat') {
            const ccx = CW/2, ccy = CH/2 - 20;
            if (isHover(ccx - 220, ccy - 220, 440, 440)) {
                GAME.catClicks++;
                AudioEngine.playCatMeow();
                // Click feedback: flash + star burst
                GAME.catFlashTimer = 300;
                for (let s = 0; s < 8; s++) {
                    const angle = (s / 8) * Math.PI * 2;
                    GAME.catStars.push({
                        x: GAME.mouseX, y: GAME.mouseY,
                        vx: Math.cos(angle) * (150 + Math.random()*100),
                        vy: Math.sin(angle) * (150 + Math.random()*100),
                        life: 500, maxLife: 500, size: 12 + Math.random()*8
                    });
                }
                if (GAME.catClicks >= 3) clearHazard();
            }
        }
        else if (GAME.hazard === 'ad') {
            // Single X button — randomized corner
            const {x,y,w,h} = GAME.adPos;
            const corner = GAME.adCloseCorner;
            let closeX, closeY;
            if (corner === 0)      { closeX = x + 8;       closeY = y + 8; }
            else if (corner === 1) { closeX = x + w - 58;  closeY = y + 8; }
            else if (corner === 2) { closeX = x + 8;       closeY = y + h - 58; }
            else                   { closeX = x + w - 58;  closeY = y + h - 58; }
            if (isHover(closeX, closeY, 50, 50)) clearHazard();
        }
        else if (GAME.hazard === 'battery') {
            if (Math.hypot(GAME.mouseX - GAME.plugPos.x, GAME.mouseY - GAME.plugPos.y) < 90) GAME.batteryDrag = true;
        }
        else if (GAME.hazard === 'lag') {
            if (isHover(10, DESK_Y + 5, 200, 65)) {
                GAME.routerClicks++; GAME.routerFlashTimer = 150; GAME.routerShakeTimer = 200; AudioEngine.playWifiStatic();
                if (GAME.routerClicks >= 3) clearHazard();
            }
        }
        else if (GAME.hazard === 'kbbreak') {
            // Only handle screwdriver pickup click — fixing screws is hover-based (in main.js)
            if (!GAME.hasScrewdriver) {
                if (Math.hypot(GAME.mouseX - GAME.screwdriverPos.x, GAME.mouseY - GAME.screwdriverPos.y) < 55) {
                    GAME.hasScrewdriver = true;
                    AudioEngine.playClick();
                }
            }
        }
        else if (GAME.hazard === 'malware') {
            GAME.virusIcons.forEach(v => {
                if (v.alive && Math.hypot(GAME.mouseX - v.x, GAME.mouseY - v.y) < 135) {
                    v.alive = false;
                    GAME.virusesClicked++;
                    AudioEngine.playVirusZap();
                    if (GAME.virusesClicked >= 5) clearHazard();
                }
            });
        }
    }
});

window.addEventListener('keydown', (e) => {
    if (GAME.paused) return;
    if (GAME.state === 'PLAYING') {
        if (GAME.hazard === 'ad' && e.code === 'Escape') { clearHazard(); return; }
        if (ARROWS.includes(e.code)) {
            e.preventDefault();
            if (['cat', 'battery', 'ad', 'coffee', 'kbbreak', 'malware'].includes(GAME.hazard)) return;
            if (GAME.hazard === 'lag') GAME.inputBuffer.push({ code: e.code, time: performance.now() + 800 });
            else processArrow(e.code);
        }
    }
});
