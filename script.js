// --- STATE GLOBAL ---
let gameMode = 1; // 1 atau 2 Player
let op = '+'; 
let level = 'mudah';
let ans1 = 0, ans2 = 0; 
let hp1 = 10, hp2 = 10;
let in1 = "", in2 = "";

// --- FUNGSI SELEKSI (Fix Tombol Aktif) ---
function setMode(m, b) { 
    gameMode = m; 
    document.querySelectorAll('#mode-select .btn-sel').forEach(btn => btn.classList.remove('active'));
    b.classList.add('active'); 
}

function setOp(o, b) { 
    op = o; 
    document.querySelectorAll('#op-select .btn-sel').forEach(btn => btn.classList.remove('active'));
    b.classList.add('active'); 
}

function setLevel(l, b) { 
    level = l; 
    document.querySelectorAll('#lv-select .btn-sel').forEach(btn => btn.classList.remove('active'));
    b.classList.add('active'); 
}

// --- LOGIKA MULAI GAME ---
function requestStart() {
    // Otomatis Full Screen untuk Panel 75"
    let el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();

    document.getElementById('selection-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'flex';
    
    // Reset HP dan Visual
    hp1 = 10; hp2 = 10;
    document.getElementById('hp-bar-1').style.width = "100%";
    document.getElementById('hp-bar-2').style.width = "100%";

    // Pengaturan Mode 2 Player
    if(gameMode === 2) {
        document.getElementById('card-2').style.visibility = 'visible';
        document.getElementById('label-target').innerText = "TIM B";
        document.getElementById('p2-char').innerHTML = '<img src="assets/images/hantu.png">';
    } else {
        document.getElementById('card-2').style.display = 'none';
        document.getElementById('label-target').innerText = "POCONG";
        document.getElementById('p2-char').innerHTML = '<img src="assets/images/hantu.png">';
    }

    gen(1); 
    if(gameMode === 2) gen(2);
}

// --- GENERATOR SOAL (Sesuai Tingkatan Kelas) ---
function gen(p) {
    let a, b, res;
    let max = (level === 'mudah') ? 10 : (level === 'sedang') ? 30 : 100;
    
    // Logika Operasi
    let currentOp = (op === 'campur') ? ['+', '-', 'x', ':'][Math.floor(Math.random()*4)] : op;

    if (currentOp === '+') {
        a = r(max); b = r(max); res = a + b;
    } else if (currentOp === '-') {
        a = r(max) + (max/2); b = r(a); res = a - b;
    } else if (currentOp === 'x') {
        let mx = (level === 'mudah') ? 5 : (level === 'sedang') ? 10 : 15;
        a = r(mx); b = r(mx); res = a * b;
    } else { // Pembagian bulat
        let md = (level === 'mudah') ? 5 : (level === 'sedang') ? 10 : 12;
        b = r(md) + 1; res = r(md); a = b * res;
    }

    // Tampilkan ke layar yang benar
    let sym = (currentOp === ':') ? '÷' : (currentOp === 'x') ? '×' : currentOp;
    document.getElementById('q' + p).innerText = `${a} ${sym} ${b}`;
    
    if(p === 1) { ans1 = res; in1 = ""; } 
    else { ans2 = res; in2 = ""; }
    updateIn(p);
}

function r(m) { return Math.floor(Math.random() * m) + 1; }

// --- INPUT & DISPLAY ---
function press(p, n) {
    if(p === 1) { if(in1.length < 5) in1 += n; } 
    else { if(in2.length < 5) in2 += n; }
    updateIn(p);
}

function del(p) {
    if(p === 1) in1 = in1.slice(0,-1); 
    else in2 = in2.slice(0,-1);
    updateIn(p);
}

function updateIn(p) {
    document.getElementById('in' + p).innerText = (p === 1 ? in1 : in2);
}

// --- VALIDASI JAWABAN ---
function check(p) {
    let userVal = (p === 1) ? in1 : in2;
    if(userVal === "") return;

    if (parseInt(userVal) === (p === 1 ? ans1 : ans2)) {
        throwBatu(p);
    } else {
        // Efek Salah
        let card = document.getElementById('card-' + p);
        card.style.borderColor = "red";
        setTimeout(() => card.style.borderColor = "rgba(255,255,255,0.15)", 300);
        if(p === 1) in1 = ""; else in2 = "";
        updateIn(p);
    }
}

// --- ANIMASI & HIT ---
function throwBatu(p) {
    const projContainer = document.getElementById('projectiles');
    const batu = document.createElement('div');
    batu.className = 'batu';
    batu.innerText = '🪨';
    batu.style.bottom = '20%';
    batu.style.left = (p === 1 ? '20%' : '75%');
    projContainer.appendChild(batu);

    // Animasi Parabola ke target
    setTimeout(() => {
        let targetPos = (p === 1) ? '55vw' : '-55vw';
        batu.style.transform = `translate(${targetPos}, -180px) rotate(720deg)`;
    }, 50);

    setTimeout(() => {
        batu.remove();
        hit(p);
    }, 600);
}

function hit(p) {
    if(p === 1) hp2--; else hp1--;
    
    // Efek Terbakar
    let target = document.getElementById(p === 1 ? 'p2-char' : 'p1-char');
    target.classList.add('burn');
    setTimeout(() => target.classList.remove('burn'), 600);

    // Update Bar
    document.getElementById('hp-bar-1').style.width = (hp1 * 10) + "%";
    document.getElementById('hp-bar-2').style.width = (hp2 * 10) + "%";

    if (hp1 <= 0 || hp2 <= 0) {
        document.getElementById('win-overlay').style.display = 'flex';
        document.getElementById('win-txt').innerText = (hp2 <= 0) ? "TIM A MENANG!" : "TIM B MENANG!";
    } else {
        gen(p);
    }
}
