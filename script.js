const canvas = document.getElementById('canvas-fx');
const ctx = canvas.getContext('2d');
let currentEffect = 'none';
let frame = 0;
let dbData = {};

// Cargar datos desde el JSON local
async function loadData() {
    try {
        const response = await fetch('data.json');
        dbData = await response.json();
        engine.init();
    } catch (e) { console.error("Error cargando JSON", e); }
}

const engine = {
    init() { this.render(); draw(); },
    render() {
        const alu = parseInt(document.getElementById('alumnes').value) || 1;
        const m2 = parseInt(document.getElementById('m2').value) || 1;
        const display = document.getElementById('display');

        display.innerHTML = dbData.indicadores.map(item => {
            let valorFinal = item.valor_base;
            if(item.unidad.includes('/alu')) valorFinal = item.valor_base * alu;
            if(item.unidad.includes('/m²')) valorFinal = item.valor_base * m2;

            return `
                <div class="kpi-card" onmouseenter="currentEffect='${item.tipo}'" onmouseleave="currentEffect='none'">
                    <h3>${item.titulo}</h3>
                    <div class="val">${Math.round(valorFinal).toLocaleString()}</div>
                    <small>${item.unidad}</small>
                </div>`;
        }).join('');
    }
};

// ... (Aquí pegas las funciones de dibujo draw() que usamos anteriormente) ...

document.getElementById('alumnes').addEventListener('input', () => engine.render());
document.getElementById('m2').addEventListener('input', () => engine.render());
window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
canvas.width = window.innerWidth; canvas.height = window.innerHeight;

loadData(); // Iniciar carga
