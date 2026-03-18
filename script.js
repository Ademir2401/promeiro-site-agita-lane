// ==========================================
// 1. DADOS E MEMÓRIA (LOCALSTORAGE)
// ==========================================

// Tenta carregar os dados salvos; se não houver, usa os padrões
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
// 3. RENDERIZAÇÃO
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
        
        // Se for só Nutella, mostra +R$3. Se for mistura, mostra +R$2.
        if (nomeLimpo === "nutella") {
            precoTexto = '<span class="aviso-nutella" style="background:#ff5e00; color:white; padding:2px 6px; border-radius:4px; font-size:10px; margin-left:5px;">(+R$3)</span>';
        } else if (nomeLimpo.includes("nutella")) {
            precoTexto = '<span class="aviso-nutella" style="background:#666; color:white; padding:2px 6px; border-radius:4px; font-size:10px; margin-left:5px;">(+R$2)</span>';
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
    
    if (pedido.precoBase === 0) {
        pedido.precoTotal = 0;
    } else {
        pedido.cremes.forEach(creme => {
            const nomeCreme = creme.trim().toLowerCase();
            
            if (nomeCreme === "nutella") {
                total += 3.00; // Regra dos 3 reais
            } else if (nomeCreme.includes("nutella")) {
                total += 2.00; // Regra dos 2 reais para misturas
            }
        });
        pedido.precoTotal = total;
    }
    atualizarResumo(); // Esta linha faz o resumo aparecer!
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
// 4. PAINEL ADMIN E SALVAMENTO
// ==========================================

function abrirAdmin() {
    let senha = prompt("Digite a senha do Agita Lane:");
    if (senha === "6853") {
        document.getElementById('admin-panel').style.display = 'flex';
    } else {
        alert("Senha incorreta!");
    }
}

function fecharAdmin() {
    document.getElementById('admin-panel').style.display = 'none';
}

function adicionarNovoTamanho() {
    const nome = document.getElementById('new-prod-name-admin').value;
    const preco = parseFloat(document.getElementById('new-prod-price-admin').value);
    const img = document.getElementById('new-prod-img-admin').value || "img/garrafa de 300ml.png";

    if (nome && !isNaN(preco)) {
        produtos.push({ nome: nome, preco: preco, imagem: img });
        // SALVA NA MEMÓRIA DO NAVEGADOR
        localStorage.setItem('agita_produtos', JSON.stringify(produtos));
        renderizarTamanhos(); 
        alert("Produto salvo!");
        fecharAdmin();
    } else {
        alert("Preencha corretamente!");
    }
}

function adicionarNovoCreme() {
    const nome = document.getElementById('new-creme-name-admin').value;
    if (nome) {
        cremesDisponiveis.push(nome);
        // SALVA NA MEMÓRIA DO NAVEGADOR
        localStorage.setItem('agita_cremes', JSON.stringify(cremesDisponiveis));
        renderizarCremes();
        alert("Creme salvo!");
        fecharAdmin();
    } else {
        alert("Digite o nome!");
    }
}

// ==========================================
// 5. FINALIZAÇÃO (DETALHADO NO WHATSAPP)
// ==========================================



// Função para remover um creme
function removerCreme(index) {
    if (confirm("Tem certeza que deseja remover este creme?")) {
        cremesDisponiveis.splice(index, 1); // Remove o item da lista
        localStorage.setItem('agita_cremes', JSON.stringify(cremesDisponiveis)); // Atualiza a memória
        renderizarCremes(); // Atualiza a tela principal
        abrirAdmin(); // Atualiza a lista dentro do painel
    }
}

// Vamos atualizar a função abrirAdmin para ela mostrar a lista de exclusão
function abrirAdmin() {
    let senha = prompt("Digite a senha do Agita Lane:");
    if (senha === "6853") {
        const painel = document.getElementById('admin-panel');
        painel.style.display = 'flex';
        
        // Criar uma área de gerenciamento dentro do painel
        const listaTamanhos = document.getElementById('lista-exclusao-tamanhos');
        const listaCremes = document.getElementById('lista-exclusao-cremes');
        
        // Listar tamanhos para apagar
        listaTamanhos.innerHTML = "<h5>Gerenciar Tamanhos:</h5>";
        produtos.forEach((p, index) => {
            listaTamanhos.innerHTML += `<div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <span>${p.nome}</span>
                <button onclick="removerTamanho(${index})" style="color:red; border:none; background:none; cursor:pointer;">[X]</button>
            </div>`;
        });

        // Listar cremes para apagar
        listaCremes.innerHTML = "<h5>Gerenciar Cremes:</h5>";
        cremesDisponiveis.forEach((c, index) => {
            listaCremes.innerHTML += `<div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <span>${c}</span>
                <button onclick="removerCreme(${index})" style="color:red; border:none; background:none; cursor:pointer;">[X]</button>
            </div>`;
        });
    } else {
        alert("Senha incorreta!");
    }
}

function finalizeOrder() {
    try {
        // 1. Captura os elementos básicos
        const btn = document.querySelector('.btn-floating-whatsapp');
        const nome = document.getElementById('nome-cliente')?.value.trim();
        const endereco = document.getElementById('endereco-cliente')?.value.trim();
        const pagamento = document.getElementById('metodo-pagamento')?.value;

        // 2. Validações de segurança
        if (!pedido.tamanho) {
            alert("⚠️ Por favor, escolha o tamanho do seu açaí!");
            return;
        }
        if (!nome || !endereco) {
            alert("⚠️ Por favor, preencha o Nome e o Endereço!");
            return;
        }

        // 3. EFEITO VISUAL (🚀 Enviando...)
        const conteudoOriginal = btn.innerHTML;
        btn.innerHTML = "<span>🚀 Enviando...</span>";
        btn.style.pointerEvents = "none";
        btn.style.opacity = "0.8";

        // 4. PREPARA OS DADOS DO PEDIDO
        const cremesEscolhidos = pedido.cremes.length > 0 ? pedido.cremes.join(", ") : "Nenhum";
        const totalTexto = `R$ ${pedido.precoTotal.toFixed(2).replace('.', ',')}`;

        // 5. MONTA A MENSAGEM COMPLETA
        let msg = `*NOVO PEDIDO - AGITA LANE* 🍦%0A`;
        msg += `━━━━━━━━━━━━━━━━━━━━%0A`;
        msg += `👤 *CLIENTE:* ${nome}%0A`;
        msg += `📍 *ENTREGA:* ${endereco}%0A`;
        msg += `💳 *PAGAMENTO:* ${pagamento}%0A`;
        msg += `━━━━━━━━━━━━━━━━━━━━%0A`;
        msg += `📦 *TAMANHO:* ${pedido.tamanho}%0A`;
        msg += `🥤 *BATIDA:* ${pedido.batida}%0A`;
        msg += `🍦 *CREMES:* ${cremesEscolhidos}%0A`;
        msg += `━━━━━━━━━━━━━━━━━━━━%0A`;
        msg += `💰 *TOTAL: ${totalTexto}*%0A`;

        // 6. DISPARO PARA O WHATSAPP
        const meuNumero = "557583265854"; 
        const urlFinal = `https://wa.me/${meuNumero}?text=${msg}`;

        setTimeout(() => {
            window.open(urlFinal, '_blank');
            
            // Volta o botão ao normal
            btn.innerHTML = conteudoOriginal;
            btn.style.pointerEvents = "auto";
            btn.style.opacity = "1";
        }, 800);

    } catch (error) {
        console.error("Erro ao finalizar:", error);
        alert("Ocorreu um erro ao montar o pedido.");
    }
}


