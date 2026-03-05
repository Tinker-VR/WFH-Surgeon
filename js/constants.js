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
    gold: '#FFD54F', gray: '#9E9E9E'
};

const ARROWS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const ARROW_SYM = { ArrowUp: '⇧', ArrowDown: '⇩', ArrowLeft: '⇦', ArrowRight: '⇨' };

const PROCEDURES = ["9/11 Memorial Rhinoplasty", "Epstein's Autopsy Redo", "Gender Reveal C-Section", "Thoughts & Prayers Bypass", "School Shooting Bullet Removal", "Fentanyl Taste Test", "Trump's Brain Scan (404)", "COVID Lab Leak Patch Job", "Student Loan Lobotomy", "Diddy's Back Surgery", "TikTok Attention Span Implant", "Florida Man Face Reconstruction"];
const PATIENTS = ["O.J. Simpson", "Jeffrey Epstein", "The Zodiac Killer", "Ted Cruz (Totally Human)", "Your Mom's OnlyFans", "A Literal War Criminal", "CEO Who Fired 10,000", "Anti-Vaxxer Karen", "Flat Earth Mike", "That Kid Who Ate Tide Pods", "An Unpaid Intern", "Baby Named X AE A-12"];

const CHEEKY_ADS = [
    { headline: 'HOT SINGLES IN YOUR O.R.', sub: 'Nurses HATE this one weird trick!', cta: 'SWIPE RIGHT NOW', color: '#E91E63', bg: '#FCE4EC' },
    { headline: 'CONGRATULATIONS!!!', sub: 'You are the 1,000,000th malpractice suit!', cta: 'CLAIM $1,000,000', color: '#FF6F00', bg: '#FFF8E1' },
    { headline: 'ENLARGE YOUR... TOOLKIT', sub: 'Big Pharma HATES this one weird scalpel', cta: 'BUY NOW (-99%)', color: '#1565C0', bg: '#E3F2FD' },
    { headline: 'LOSE 50 LBS IN 5 MINUTES', sub: '(We just remove your organs)', cta: 'DOCTORS HATE HIM', color: '#2E7D32', bg: '#E8F5E9' },
    { headline: 'YOUR PC HAS 47 VIRUSES', sub: 'Just like your patient lmao', cta: 'DOWNLOAD NOW!!!', color: '#D32F2F', bg: '#FFEBEE' },
    { headline: 'MEDICAL DEGREE (NO EXAM)', sub: 'Print your diploma from home! 100% legit!', cta: 'ENROLL TODAY', color: '#7B1FA2', bg: '#F3E5F5' },
    { headline: 'BITCOIN SURGERY TOKENS', sub: 'Turn organs into crypto! Not a scam!', cta: 'INVEST NOW!!!', color: '#F57C00', bg: '#FFF3E0' },
    { headline: 'SUE YOUR SURGEON TODAY', sub: 'Free consultation! We never lose!', cta: 'CALL 1-800-OOPS', color: '#C62828', bg: '#FFCDD2' },
];

const STORE_ITEMS = [
    {id: 'heart_restore', icon: '❤️', title: 'Black Market Organ', desc: 'Restores 1 lost heart.', price: 2000, consumable: true},
    {id: 'lawyer', icon: '💼', title: 'Ambulance Chaser', desc: '+1 extra heart capacity.', price: 1500},
    {id: 'energy_anes', icon: '💉', title: 'Liquid Courage IV', desc: '40% slower anesthesia drain.', price: 1200},
    {id: 'energy_time', icon: '⚡', title: 'Monster Energy Drip', desc: '+40% sequence time.', price: 1000},
    {id: 'ethernet', icon: '🔌', title: 'Ethernet Cable', desc: 'No Wi-Fi disconnects.', price: 800},
    {id: 'treats', icon: '🐟', title: 'Cat Treats', desc: 'Distracts the cat.', price: 600},
    {id: 'mugLid', icon: '☕', title: 'Mug Lid', desc: 'No coffee spills.', price: 500},
    {id: 'adBlock', icon: '🛑', title: 'AdBlocker Pro', desc: 'Blocks popup ads.', price: 900},
    {id: 'powerBank', icon: '🔋', title: 'Power Bank', desc: 'Blocks low battery.', price: 850},
    {id: 'gamerKB', icon: '⌨️', title: 'Razer DeathBoard 9000', desc: 'No keyboard jams.', price: 750},
    {id: 'antivirus', icon: '🛡️', title: 'ICE Agent', desc: 'Deports viruses.', price: 950}
];

const DEFAULT_UPGRADES = { energy_anes:false, energy_time:false, ethernet:false, treats:false, lawyer:false, mugLid:false, adBlock:false, powerBank:false, gamerKB:false, antivirus:false };

// Debug variables are defined in index.html for easy access

const STARTING_CASH = DEBUG_STARTING_CASH;
const STARTING_RANK = DEBUG_STARTING_RANK;
