/**
 * WFH SURGEON — Render: Notifications, Mute/Pause Buttons, Pause Overlay
 */

function drawNotifications(dt) {
    let active = [];
    for (let i = GAME.notifications.length-1; i >= 0; i--) {
        GAME.notifications[i].timer -= dt;
        if (GAME.notifications[i].timer <= 0) GAME.notifications.splice(i, 1);
        else active.unshift(GAME.notifications[i]);
    }
    active.forEach((n, i) => {
        const alpha = Math.min(1, n.timer/300);
        const slideIn = Math.min(1, (n.maxTimer - n.timer)/150);
        const bounceIn = slideIn < 1 ? Math.sin(slideIn * Math.PI * 0.5) : 1;
        const nx = CW/2, ny = DESK_Y + 15 + i*42;
        const oy = (1-bounceIn)*30;
        ctx.globalAlpha = alpha;
        drawShadowRoundRect(nx-175, ny-18+oy, 350, 38, 19, 'rgba(0,0,0,0.85)', null);
        drawText(`${n.icon} ${n.text}`, nx, ny+2+oy, 19, '#FFF', 'center');
        ctx.globalAlpha = 1;
    });
}

function drawMuteButton() {
    const mb = GAME.muteBtn, hover = isHover(mb.x, mb.y, mb.w, mb.h);
    drawRoundRect(mb.x, mb.y, mb.w, mb.h, 8, hover ? '#444' : 'rgba(0,0,0,0.4)', null);
    drawText(AudioEngine.enabled ? '🔊' : '🔇', mb.x+mb.w/2, mb.y+mb.h/2, 18, AudioEngine.enabled ? '#FFF' : '#888', 'center');
}

function drawPauseButton() {
    if (GAME.state !== 'PLAYING') return;
    const pb = GAME.pauseBtn, hover = isHover(pb.x, pb.y, pb.w, pb.h);
    drawRoundRect(pb.x, pb.y, pb.w, pb.h, 8, hover ? '#555' : 'rgba(30,30,30,0.8)', null);
    drawText(GAME.paused ? '▶' : '⏸', pb.x+pb.w/2, pb.y+pb.h/2, 16, '#FFF', 'center');
}

function drawPauseOverlay() {
    if (!GAME.paused) return;
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, CW, CH);
    const cx = CW/2, cy = CH/2;

    if (GAME.pauseQuitConfirm) {
        // "Are you sure?" confirmation
        drawShadowRoundRect(cx-210, cy-100, 420, 200, 16, '#1A1A2E', '#555', 2);
        drawText('ARE YOU SURE?', cx, cy-55, 34, COLORS.red, 'center');
        drawText('Quitting resets all progress.', cx, cy-15, 18, '#AAA', 'center', null, 0, 'normal');
        drawButton('YES, QUIT', cx-200, cy+25, 185, 52, COLORS.red, 20);
        drawButton('NO, STAY', cx+15, cy+25, 185, 52, '#555', 20);
        return;
    }

    drawRoundRect(cx-55, cy-65, 40, 100, 8, '#FFF', null);
    drawRoundRect(cx+15, cy-65, 40, 100, 8, '#FFF', null);
    drawText('PAUSED', cx, cy+75, 42, '#FFF', 'center', 'rgba(0,0,0,0.5)', 4);
    drawButton('RESUME', cx - 110, cy + 100, 220, 55, COLORS.green, 26, true);
    drawButton('QUIT', cx - 110, cy + 170, 220, 55, COLORS.red, 26);
}
