/**
 * WFH SURGEON — Drawing Utilities
 */

function isHover(x, y, w, h) { return GAME.mouseX >= x && GAME.mouseX <= x+w && GAME.mouseY >= y && GAME.mouseY <= y+h; }

function drawRect(x, y, w, h, fill, stroke, sw2 = 4) {
    if (fill) { ctx.fillStyle = fill; ctx.fillRect(x, y, w, h); }
    if (stroke) { ctx.lineWidth = sw2; ctx.strokeStyle = stroke; ctx.strokeRect(x, y, w, h); }
}

if (!ctx.roundRectPolyfill) {
    ctx.roundRectPolyfill = function(x, y, w, h, r) {
        if (w < 2*r) r = w/2; if (h < 2*r) r = h/2;
        this.beginPath(); this.moveTo(x+r, y);
        this.arcTo(x+w, y, x+w, y+h, r); this.arcTo(x+w, y+h, x, y+h, r);
        this.arcTo(x, y+h, x, y, r); this.arcTo(x, y, x+w, y, r);
        this.closePath(); return this;
    }
}

function drawRoundRect(x, y, w, h, r, fill, stroke, sw2 = 4) {
    ctx.roundRectPolyfill(x, y, w, h, r);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.lineWidth = sw2; ctx.strokeStyle = stroke; ctx.stroke(); }
}

function drawShadowRoundRect(x, y, w, h, r, fill, stroke, sw2 = 4) {
    ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4;
    drawRoundRect(x, y, w, h, r, fill, stroke, sw2);
    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
}

function drawText(text, x, y, size, fill, align = 'left', shadowCol = null, shadowBlur = 0, weight = 'bold') {
    ctx.font = `${weight} ${size}px 'Segoe UI', Tahoma, sans-serif`;
    ctx.textAlign = align; ctx.textBaseline = 'middle';
    if (shadowCol) { ctx.shadowColor = shadowCol; ctx.shadowBlur = shadowBlur; ctx.shadowOffsetY = 2; }
    ctx.fillStyle = fill; ctx.fillText(text, x, y);
    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
}

function drawButton(text, x, y, w, h, color, fontSize = 20, pulse = false) {
    const hover = isHover(x, y, w, h);
    const yo = hover ? 2 : 0;
    if (!hover) { ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 4; }
    drawRoundRect(x, y + yo, w, h, h/2, hover ? '#FFF' : color, null, 0);
    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    let sc = 1; if (pulse && !hover) sc = 1 + Math.sin(performance.now()/200)*0.03;
    ctx.save(); ctx.translate(x+w/2, y+h/2+yo); ctx.scale(sc, sc);
    drawText(text, 0, 0, fontSize, hover ? '#000' : '#FFF', 'center');
    ctx.restore();
}

function getRankName(ri) {
    const t = ['Unpaid Intern','Sleep-Deprived Resident','Malpractice Magnet','Chief of Chaos','God Complex'];
    return `${t[Math.floor(ri/3)] || 'Literally God'} ${['I','II','III'][ri%3] || 'III'}`;
}
