// ==========================================
// 1. DADOS E MEMÓRIA (LOCALSTORAGE)
// ==========================================

let produtos = JSON.parse(localStorage.getItem('agita_produtos')) || [
    { nome: "Açaí 300ml", preco: 12.00, imagem: "img/300ml.png" },
    { nome: "Açaí 500ml", preco: 15.00, imagem: "img/500ml.png" }
];

let cremesDisponiveis = JSON.parse(localStorage.getItem('agita_cremes')) || [
    "Creme de Pistache", "Creme de Paçoca", "Creme de Amendoim", 
    "Ovomaltine", "Ninho", "Ninho com Nutella", 
    "Maracujá", "Maracujá com Nutella", "Morango com Nutella", "Nutella"
];

let pedido = {
    tamanho: "",
    precoBase: 0,
    cremes: [],
    batida: "Nenhuma",
    precoTotal: 0
};

// ==========================================
// 2. INICIALIZAÇÃO
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    renderizarTamanhos();
    renderizarCremes();
});

// ==========================================
// 3. RENDERIZAÇÃO DO SITE (CLIENTE)
// ==========================================

function renderizarTamanhos() {
    const container = document.getElementById('tamanho-list');
    if (!container) return;
    container.innerHTML = "";
    produtos.forEach(prod => {
        const btn = document.createElement('button');
        btn.className = 'opt-tamanho';
        btn.innerHTML = `
            <img src="${prod.imagem}" alt="${prod.nome}" class="img-produto">
            <div class="info-produto">
                <strong>${prod.nome}</strong><br>
                <span class="preco-base">R$ ${prod.preco.toFixed(2).replace('.', ',')}</span>
            </div>
        `;
        btn.onclick = () => {
            document.querySelectorAll('.opt-tamanho').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            pedido.tamanho = prod.nome;
            pedido.precoBase = prod.preco;
            recalcularTotal();
        };
        container.appendChild(btn);
    });
}

function renderizarCremes() {
    const container = document.getElementById('cremes-list');
    if (!container) return;
    container.innerHTML = "";
    cremesDisponiveis.forEach(creme => {
        const div = document.createElement('div');
        div.className = 'checkbox-wrapper';
        
        let precoTexto = "";
        const nomeLimpo = creme.toLowerCase().trim();
        
        if (nomeLimpo === "nutella") {
            precoTexto = '<span style="background:#ff5e00; color:white; padding:2px 6px; border-radius:4px; font-size:10px; margin-left:5px;">(+R$3)</span>';
        } else if (nomeLimpo.includes("nutella")) {
            precoTexto = '<span style="background:#666; color:white; padding:2px 6px; border-radius:4px; font-size:10px; margin-left:5px;">(+R$2)</span>';
        }

        div.innerHTML = `
            <input type="checkbox" id="item-${creme.replace(/\s+/g, '')}" value="${creme}" onchange="gerenciarCremes(this)">
            <label for="item-${creme.replace(/\s+/g, '')}">${creme} ${precoTexto}</label>
        `;
        container.appendChild(div);
    });
}

function gerenciarCremes(checkbox) {
    if (checkbox.checked) {
        pedido.cremes.push(checkbox.value);
    } else {
        pedido.cremes = pedido.cremes.filter(item => item !== checkbox.value);
    }
    recalcularTotal();
}

function recalcularTotal() {
    let total = pedido.precoBase;
    if (pedido.precoBase !== 0) {
        pedido.cremes.forEach(creme => {
            const nomeCreme = creme.trim().toLowerCase();
            if (nomeCreme === "nutella") total += 3.00;
            else if (nomeCreme.includes("nutella")) total += 2.00;
        });
        pedido.precoTotal = total;
    }
    atualizarResumo();
}

function atualizarResumo() {
    const display = document.getElementById('display-order');
    if (!display) return;
    if (!pedido.tamanho) {
        display.innerHTML = "Escolha o tamanho do seu açaí...";
        return;
    }
    const listaCremes = pedido.cremes.length > 0 ? pedido.cremes.join(", ") : "Nenhum";
    display.innerHTML = `
        <div class="resumo-intern">
            <p><strong>Tamanho:</strong> ${pedido.tamanho}</p>
            <p><strong>Cremes:</strong> ${listaCremes}</p>
            <p><strong>Batida:</strong> ${pedido.batida}</p>
            <hr>
            <h3 class="total-pedido">Total: R$ ${pedido.precoTotal.toFixed(2).replace('.', ',')}</h3>
        </div>
    `;
}

function setBatida(sabor, elemento) {
    document.querySelectorAll('.opt-batida').forEach(b => b.classList.remove('active'));
    elemento.classList.add('active');
    pedido.batida = sabor;
    atualizarResumo();
}

// ==========================================
// 4. PAINEL ADMIN COM DESIGN "COM VIDA"
// ==========================================

function abrirAdmin() {
    let senha = prompt("Digite a senha do Agita Lane:");
    if (senha === "6853") {
        document.getElementById('admin-panel').style.display = 'flex';
        renderizarListaExclusao();
    } else {
        alert("Senha incorreta!");
    }
}

function fecharAdmin() {
    document.getElementById('admin-panel').style.display = 'none';
}

function renderizarListaExclusao() {
    const listaTamanhos = document.getElementById('lista-exclusao-tamanhos');
    const listaCremes = document.getElementById('lista-exclusao-cremes');

    // Estilo dos cartões (Cards)
    const cardStyle = `
        display:flex; 
        justify-content:space-between; 
        align-items:center; 
        margin-bottom:10px; 
        background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
        padding: 12px; 
        border-radius: 8px; 
        border-left: 5px solid #6a0dad; 
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;

    const btnDeleteStyle = `
        background: #ff4d4d; 
        color: white; 
        border: none; 
        padding: 6px 10px; 
        border-radius: 5px; 
        cursor: pointer; 
        font-weight: bold;
        transition: 0.3s;
    `;

    if (listaTamanhos) {
        listaTamanhos.innerHTML = "<h5 style='color:#6a0dad; margin:20px 0 10px 0; border-bottom: 2px solid #6a0dad;'>🥤 Gerenciar Tamanhos</h5>";
        produtos.forEach((p, index) => {
            listaTamanhos.innerHTML += `
                <div style="${cardStyle}">
                    <span style="color:#333; font-weight:bold;">${p.nome}</span>
                    <button onclick="removerTamanho(${index})" style="${btnDeleteStyle}">🗑️ Apagar</button>
                </div>`;
        });
    }

    if (listaCremes) {
        listaCremes.innerHTML = "<h5 style='color:#6a0dad; margin:20px 0 10px 0; border-bottom: 2px solid #6a0dad;'>🍦 Gerenciar Cremes</h5>";
        cremesDisponiveis.forEach((c, index) => {
            listaCremes.innerHTML += `
                <div style="${cardStyle}">
                    <span style="color:#333; font-weight:bold;">${c}</span>
                    <button onclick="removerCreme(${index})" style="${btnDeleteStyle}">🗑️ Apagar</button>
                </div>`;
        });
    }
}

function adicionarNovoTamanho() {
    const nome = document.getElementById('new-prod-name-admin').value;
    const preco = parseFloat(document.getElementById('new-prod-price-admin').value);
    const img = document.getElementById('new-prod-img-admin').value || "img/300ml.png";

    if (nome && !isNaN(preco)) {
        produtos.push({ nome: nome, preco: preco, imagem: img });
        localStorage.setItem('agita_produtos', JSON.stringify(produtos));
        renderizarTamanhos(); 
        renderizarListaExclusao();
        alert("✅ Produto adicionado com sucesso!");
        document.getElementById('new-prod-name-admin').value = "";
        document.getElementById('new-prod-price-admin').value = "";
    } else {
        alert("❌ Preencha os campos corretamente!");
    }
}

function removerTamanho(index) {
    if (confirm("Tem certeza que deseja apagar este item?")) {
        produtos.splice(index, 1);
        localStorage.setItem('agita_produtos', JSON.stringify(produtos));
        renderizarTamanhos();
        renderizarListaExclusao();
    }
}

function adicionarNovoCreme() {
    const nome = document.getElementById('new-creme-name-admin').value;
    if (nome) {
        cremesDisponiveis.push(nome);
        localStorage.setItem('agita_cremes', JSON.stringify(cremesDisponiveis));
        renderizarCremes();
        renderizarListaExclusao();
        alert("✅ Novo creme adicionado!");
        document.getElementById('new-creme-name-admin').value = "";
    } else {
        alert("❌ Digite o nome do creme!");
    }
}

function removerCreme(index) {
    if (confirm("Deseja remover este creme da lista?")) {
        cremesDisponiveis.splice(index, 1);
        localStorage.setItem('agita_cremes', JSON.stringify(cremesDisponiveis));
        renderizarCremes();
        renderizarListaExclusao();
    }
}

// ==========================================
// 5. FINALIZAÇÃO WHATSAPP
// ==========================================

function finalizeOrder() {
    try {
        const btn = document.querySelector('.btn-floating-whatsapp');
        const nome = document.getElementById('nome-cliente')?.value.trim();
        const endereco = document.getElementById('endereco-cliente')?.value.trim();
        const pagamento = document.getElementById('metodo-pagamento')?.value;

        if (!pedido.tamanho) { alert("⚠️ Escolha o tamanho do açaí!"); return; }
        if (!nome || !endereco) { alert("⚠️ Preencha Nome e Endereço!"); return; }

        const originalBtnHtml = btn.innerHTML;
        btn.innerHTML = "<span>🚀 Enviando...</span>";
        btn.style.pointerEvents = "none";

        const cremesEscolhidos = pedido.cremes.length > 0 ? pedido.cremes.join(", ") : "Nenhum";
        const totalTexto = `R$ ${pedido.precoTotal.toFixed(2).replace('.', ',')}`;

        let msg = `*NOVO PEDIDO - AGITA LANE* 🍦%0A`;
        msg += `👤 *CLIENTE:* ${nome}%0A`;
        msg += `📍 *ENTREGA:* ${endereco}%0A`;
        msg += `💳 *PAGAMENTO:* ${pagamento}%0A`;
        msg += `━━━━━━━━━━━━━━━━━━━━%0A`;
        msg += `📦 *TAMANHO:* ${pedido.tamanho}%0A`;
        msg += `🥤 *BATIDA:* ${pedido.batida}%0A`;
        msg += `🍦 *CREMES:* ${cremesEscolhidos}%0A`;
        msg += `💰 *TOTAL: ${totalTexto}*`;

        setTimeout(() => {
            window.open(`https://wa.me/557583265854?text=${msg}`, '_blank');
            btn.innerHTML = originalBtnHtml;
            btn.style.pointerEvents = "auto";
        }, 800);

    } catch (e) { console.error(e); }
}