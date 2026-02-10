let currentAnswer = 0;
let pocongHP = 10;
let userInput = "";
let selectedOp = "+";
let selectedLevel = "mudah";

function setOp(op, btn) {
    selectedOp = op;
    document.querySelectorAll('#op-select .btn-sel').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function setLevel(lv, btn) {
    selectedLevel = lv;
    document.querySelectorAll('#lv-select .btn-sel').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function startGame() {
    document.getElementById('selection-screen').style.display = 'none';
    pocongHP = 10;
    document.getElementById('hp-bar').style.width = "100%";
    generateSoal();
}

function generateSoal() {
    let a, b, c, op;
    let max = selectedLevel === "mudah" ? 10 : selectedLevel === "sedang" ? 50 : 100;
    
    op = selectedOp === "campur" ? ["+", "-", "x", ":"][Math.floor(Math.random()*4)] : selectedOp;

    if (op === "+") {
        a = Math.floor(Math.random() * max) + 1;
        b = Math.floor(Math.random() * max) + 1;
        currentAnswer = a + b;
        displaySoal(`${a} + ${b}`);
    } 
    else if (op === "-") {
        a = Math.floor(Math.random() * max) + (max/2);
        b = Math.floor(Math.random() * a) + 1;
        currentAnswer = a - b;
        displaySoal(`${a} - ${b}`);
    } 
    else if (op === "x") {
        let maxMult = selectedLevel === "mudah" ? 5 : selectedLevel === "sedang" ? 12 : 20;
        a = Math.floor(Math.random() * maxMult) + 1;
        b = Math.floor(Math.random() * maxMult) + 1;
        currentAnswer = a * b;
        displaySoal(`${a} x ${b}`);
    } 
    else if (op === ":") {
        let maxDiv = selectedLevel === "mudah" ? 5 : selectedLevel === "sedang" ? 12 : 20;
        b = Math.floor(Math.random() * maxDiv) + 1;
        currentAnswer = Math.floor(Math.random() * maxDiv) + 1;
        a = b * currentAnswer; // Menjamin hasil bulat
        displaySoal(`${a} : ${b}`);
    }

    if (selectedOp === "campur" && selectedLevel !== "mudah") {
        // Logika tambahan untuk 3 angka pada level sedang/ahli
        generateCampuran(selectedLevel);
    }
}

function generateCampuran(lv) {
    let a = Math.floor(Math.random() * 10) + 1;
    let b = Math.floor(Math.random() * 10) + 1;
    let c = Math.floor(Math.random() * 5) + 1;
    // Contoh: (a + b) x c
    currentAnswer = (a + b) * c;
    displaySoal(`(${a} + ${b}) x ${c}`);
}

function displaySoal(txt) {
    document.getElementById('soal-display').innerText = txt + " = ?";
    userInput = "";
    updateDisplay();
}

// Fungsi press, del, updateDisplay tetap sama seperti sebelumnya
function press(num) {
    if(userInput.length < 7) userInput += num;
    updateDisplay();
}

function del() {
    userInput = userInput.slice(0, -1);
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('input-display').innerText = userInput;
}

function check() {
    if (parseInt(userInput) === currentAnswer) {
        throwStone();
    } else {
        const ui = document.getElementById('ui-box');
        ui.style.background = "#ffcccc";
        setTimeout(() => ui.style.background = "#eef2f5", 300);
        userInput = "";
        updateDisplay();
    }
}

function throwStone() {
    const projContainer = document.getElementById('projectiles');
    const batu = document.createElement('div');
    batu.className = 'batu';
    batu.innerText = '🪨'; // Ganti dengan <img src="assets/images/Batu.png"> jika ada
    batu.style.left = '15%';
    batu.style.bottom = '20%';
    projContainer.appendChild(batu);

    setTimeout(() => {
        batu.style.transform = 'translate(70vw, -150px)';
    }, 50);

    setTimeout(() => {
        batu.remove();
        hitPocong();
    }, 600);
}

function hitPocong() {
    const pocong = document.getElementById('pocong');
    pocongHP--;
    
    pocong.classList.add('burn');
    setTimeout(() => pocong.classList.remove('burn'), 500);

    document.getElementById('hp-bar').style.width = (pocongHP * 10) + "%";

    if (pocongHP <= 0) {
        document.getElementById('win-overlay').style.display = 'flex';
    } else {
        generateSoal();
    }
}