// ======================================
// LÓGICA DO SITE
// ======================================

// O seu arquivo de configurações está no "config.js"

const $ = (sel) => document.querySelector(sel);
function pad(n){ return n.toString().padStart(2, '0'); }

// ===== CONTADOR =====
function diffDetailed(from, to){
    const start = dayjs(from);
    const end = dayjs(to);

    const years = end.diff(start, 'year');
    const months = end.diff(start.add(years, 'year'), 'month');
    const days = end.diff(start.add(years, 'year').add(months, 'month'), 'day');
    const hours = end.diff(start.add(years, 'year').add(months, 'month').add(days, 'day'), 'hour');
    const minutes = end.diff(start.add(years, 'year').add(months, 'month').add(days, 'day').add(hours, 'hour'), 'minute');
    const seconds = end.diff(start.add(years, 'year').add(months, 'month').add(days, 'day').add(hours, 'hour').add(minutes, 'minute'), 'second');

    return { years, months, days, hours, minutes, seconds };
}

function updateCounter(){
    const now = new Date();
    const d = diffDetailed(CONFIG.startDate, now);
    $('#years').textContent = d.years;
    $('#months').textContent = d.months;
    $('#days').textContent = d.days;
    $('#hours').textContent = d.hours;
    $('#minutes').textContent = d.minutes;
    $('#seconds').textContent = d.seconds;
}

// ===== INICIALIZAÇÃO ESTÁTICA =====
function initStatic(){
    $('#sinceDate').textContent = new Date(CONFIG.startDate).toLocaleDateString('pt-BR');
    $('#names').textContent = CONFIG.names;
    $('#message').textContent = CONFIG.message;
    $('#songTitle').textContent = CONFIG.songTitle;
    $('#songArtist').textContent = CONFIG.songArtist;
    $('#albumArt').src = CONFIG.albumArt;

    const audio = $('#audio');
    const playBtn = $('#playBtn');
    const progress = $('#progress');
    const cur = $('#currentTime');
    const dur = $('#duration');

    if (CONFIG.audioSrc) audio.src = CONFIG.audioSrc;

    audio.addEventListener('loadedmetadata', () => {
        dur.textContent = `${Math.floor(audio.duration/60)}:${pad(Math.floor(audio.duration%60))}`;
    });

    setTimeout(()=>{
        if (!audio.duration || isNaN(audio.duration)) {
            const t = CONFIG.targetDuration || 210;
            dur.textContent = `${Math.floor(t/60)}:${pad(Math.floor(t%60))}`;
        }
    }, 1500);

    playBtn.addEventListener('click', () => {
        if (audio.paused) { audio.play(); playBtn.textContent = '⏸'; }
        else { audio.pause(); playBtn.textContent = '▶'; }
    });

    audio.addEventListener('timeupdate', () => {
        const current = audio.currentTime;
        const total = audio.duration || (CONFIG.targetDuration || 210);
        const pct = (current / total) * 100;
        progress.style.width = `${pct}%`;
        cur.textContent = `${Math.floor(current/60)}:${pad(Math.floor(current%60))}`;
    });
}

// ===== CORAÇÕES =====
function criarCoracao() {
    const coracao = document.createElement("div");
    coracao.classList.add("heart");
    coracao.innerText = "🤎";
    coracao.style.left = Math.random() * 100 + "vw";
    coracao.style.animationDuration = (4 + Math.random() * 3) + "s";
    document.body.appendChild(coracao);

    setTimeout(() => {
        coracao.remove();
    }, 5000);
}
setInterval(criarCoracao, 800);

// ===== CARROSSEL COM FADE E FOTOS VARIÁVEIS =====
let fotosValidas = [];
let carregadas = 0;

// Carrega apenas as fotos que existem
CONFIG.photos.forEach(src => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
        fotosValidas.push(src);
        carregadas++;
        if (fotosValidas.length === 1) {
            carouselImage.src = src; // mostra primeira foto
            carouselImage.style.opacity = 1; // garante visibilidade
        }
    };
    img.onerror = () => { carregadas++; };
});

const carouselImage = document.getElementById("carouselImage");
let current = 0;

function nextImage() {
    if (fotosValidas.length < 2) return; // não troca se tiver só 1 foto

    carouselImage.style.opacity = 0; // fade out
    setTimeout(() => {
        current = (current + 1) % fotosValidas.length;
        carouselImage.src = fotosValidas[current];
        carouselImage.style.opacity = 1; // fade in
    }, 500); // metade da duração do fade
}

setInterval(nextImage, 4000);

// ===== EXECUÇÃO =====
initStatic();
updateCounter();
setInterval(updateCounter, 1000);