const canvas = document.getElementById('canvas-fx');
const ctx = canvas.getContext('2d');
let currentEffect = 'none';
let frame = 0;
let dbData = {};

async function loadData() {
    try {
        const response = await fetch('data.json');
        dbData = await response.json();
        engine.init();
    } catch (e) { console.error("Error carregant el JSON real", e); }
}

const engine = {
    init() {
        document.getElementById('main-logo').innerHTML = `ITB <span class="neon-text">LEAKS</span>`;
        this.render();
        draw();
    },

    render() {
        const display = document.getElementById('display');
        const dades = dbData.indicadors_calculats;

        display.innerHTML = dbData.config_efectes.map(item => `
            <div class="kpi-card" 
                 onmouseenter="currentEffect='${item.tipus}'" 
                 onmouseleave="currentEffect='none'">
                <h3>${item.titol}</h3>
                <div class="val">${dades[item.clau].toLocaleString()}</div>
                <small>${item.u}</small>
            </div>
        `).join('');
    }
};

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;

    if (currentEffect === 'energy') {
        ctx.shadowBlur = 30; ctx.shadowColor = '#00ffcc'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
        for(let j=0; j<2; j++){
            ctx.beginPath();
            let x = Math.random() * canvas.width;
            ctx.moveTo(x, 0);
            for(let i=0; i<10; i++) {
                x += (Math.random()-0.5)*150;
                ctx.lineTo(x, (canvas.height/10)*i);
            }
            ctx.stroke();
        }
        ctx.shadowBlur = 0;
    } 
    
    else if (currentEffect === 'ice') {
        // EFECTE CONGELACIÓ (Basat en la teva petició de Calefacció)
        let iceGrad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width);
        iceGrad.addColorStop(0.4, 'transparent');
        iceGrad.addColorStop(1, 'rgba(200, 240, 255, 0.6)');
        ctx.fillStyle = iceGrad;
        ctx.fillRect(0,0,canvas.width, canvas.height);

        ctx.fillStyle = "white";
        for(let i=0; i<80; i++) {
            let x = (Math.sin(i + frame*0.01) * canvas.width + (i * 100)) % canvas.width;
            let y = (frame * (2 + (i%3))) % canvas.height;
            ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI*2); ctx.fill();
        }
    }

    else if (currentEffect === 'paper') {
        // LOGO GRAN I LENT (Per a les factures)
        ctx.font = "80px Arial";
        for(let i=0; i<6; i++){
            let y = (frame * 0.4 + i*250) % (canvas.height + 100);
            let x = (i * 300) % canvas.width;
            ctx.fillStyle = "rgba(255,255,255,0.1)";
            ctx.save(); ctx.translate(x, y); ctx.rotate(frame * 0.005);
            ctx.fillText("📄", 0, 0); ctx.restore();
        }
    }

    else if (currentEffect === 'clean') {
        // BURBBUJES (Per als mòbils/neteja)
        ctx.strokeStyle = "rgba(0, 255, 204, 0.3)";
        for(let i=0; i<20; i++) {
            let x = (i * 150 + Math.sin(frame*0.02 + i)*50) % canvas.width;
            let y = canvas.height - ((frame * 2 + i*100) % (canvas.height + 100));
            ctx.beginPath(); ctx.arc(x, y, 15, 0, Math.PI*2); ctx.stroke();
        }
    }

    requestAnimationFrame(draw);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

loadData();
