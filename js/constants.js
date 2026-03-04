/**
 * WFH SURGEON — Constants & Configuration
 */

// Monitor — centered on desk
const MONITOR = {
    x: 150, y: 12,
    w: 980, h: 490,
    bezel: 16,
    radius: 14,
    get sx() { return this.x + this.bezel; },
    get sy() { return this.y + this.bezel; },
    get sw() { return this.w - this.bezel * 2; },
    get sh() { return this.h - this.bezel * 2; },
    standW: 120, standH: 14,
    baseW: 180, baseH: 8,
    get orH() { return this.sh * 0.70; },
    get uiY() { return this.sy + this.orH; },
    get uiH() { return this.sh - this.orH; }
};

const DESK_Y = MONITOR.y + MONITOR.h + MONITOR.standH + MONITOR.baseH + 2;

const COLORS = {
    wallBg: '#D8D4CF', wallAccent: '#C5BFB8',
    deskSurface: '#C4A882', deskEdge: '#A6845C', deskShadow: '#8B6F4E',
    monitorBezel: '#1A1A1A', monitorScreen: '#0A1628',
    orWall: '#E0F0EC', orFloor: '#B8D8D0',
    green: '#00E676', red: '#FF4444', white: '#FFFFFF', black: '#000000',
    gold: '#FFD54F', gray: '#9E9E9E',
    scamOrange: '#FF9900', scamDark: '#131921', scamBlue: '#232F3E'
};

const ARROWS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const ARROW_SYM = { ArrowUp: '⇧', ArrowDown: '⇩', ArrowLeft: '⇦', ArrowRight: '⇨' };

const PROCEDURES = ["Left Knee Replacement", "Cranial Decompression", "Triple Bypass", "Emergency Appendectomy", "Kidney Transplant", "Robot-Assisted Tonsillectomy", "Spinal Fusion", "Cybernetic Eye Implant", "Spleen Defrag", "Heart Reboot", "Brain Dusting", "Ghost Removal (Surgical)"];
const PATIENTS = ["John Doe", "Jane Smith", "Patient 8472", "The CEO", "Unknown Drifter", "Your Landlord", "A Literal Dog", "V.I.P. Client", "Three Kids in a Trenchcoat", "Florida Man", "Karen from Accounting", "Your Ex"];

const CHEEKY_ADS = [
    { headline: 'HOT SINGLES IN YOUR HOSPITAL', sub: 'Nurses HATE this one weird trick!', cta: 'SWIPE RIGHT NOW', color: '#E91E63', bg: '#FCE4EC' },
    { headline: 'CONGRATULATIONS!!!', sub: 'You are the 1,000,000th surgeon today!', cta: 'CLAIM $1,000,000', color: '#FF6F00', bg: '#FFF8E1' },
    { headline: 'ENLARGE YOUR... TOOLKIT', sub: 'Surgeons everywhere switching to THIS scalpel', cta: 'BUY NOW (-99%)', color: '#1565C0', bg: '#E3F2FD' },
    { headline: 'LOSE 50 LBS IN 5 MINUTES', sub: 'Doctors recommend this one weird fruit', cta: 'DOCTORS HATE HIM', color: '#2E7D32', bg: '#E8F5E9' },
    { headline: 'YOUR PC HAS 47 VIRUSES', sub: 'CLICK HERE IMMEDIATELY TO FIX', cta: 'DOWNLOAD NOW!!!', color: '#D32F2F', bg: '#FFEBEE' },
];

const STORE_ITEMS = [
    {id: 'heart_restore', icon: '❤️', title: 'Black Market Organ', desc: 'Restores 1 lost heart.', price: 2000, consumable: true},
    {id: 'lawyer', icon: '💼', title: 'Lawyer', desc: '+1 Max Heart Cap.', price: 1500},
    {id: 'keyboard', icon: '⌨️', title: 'Mech Keyboard', desc: 'Keys heal Anes. +20% Time', price: 1200},
    {id: 'ethernet', icon: '🔌', title: 'Ethernet Cable', desc: 'Blocks Wi-Fi Lag.', price: 800},
    {id: 'treats', icon: '🐟', title: 'Cat Treats', desc: 'Distracts the Cat.', price: 600},
    {id: 'energy', icon: '🔋', title: 'Energy Drink', desc: 'Anes. drains slower.', price: 1000},
    {id: 'mugLid', icon: '☕', title: 'Mug Lid', desc: 'No coffee spills.', price: 500},
    {id: 'adBlock', icon: '🛑', title: 'AdBlocker Pro', desc: 'Blocks Boss Popups.', price: 900},
    {id: 'powerBank', icon: '⚡', title: 'Power Bank', desc: 'Blocks Low Battery.', price: 850},
    {id: 'wrench', icon: '🔧', title: 'Toolkit', desc: 'Blocks Keyboard Jams.', price: 750},
    {id: 'antivirus', icon: '🛡️', title: 'Antivirus Pro', desc: 'Blocks Malware.', price: 950}
];

const DEFAULT_UPGRADES = { keyboard:false, ethernet:false, treats:false, lawyer:false, energy:false, mugLid:false, adBlock:false, powerBank:false, wrench:false, antivirus:false };

// ===================== TESTING VARIABLES =====================
const DEBUG_FORCE_HAZARD = null;
const DEBUG_STARTING_CASH = 0;
const DEBUG_STARTING_RANK = 0;
const DEBUG_GOD_MODE = false;
// ===================== END TESTING VARIABLES =================

const STARTING_CASH = DEBUG_STARTING_CASH;
const STARTING_RANK = DEBUG_STARTING_RANK;
