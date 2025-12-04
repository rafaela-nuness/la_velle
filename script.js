


// ===== MENU MOBILE - VERSÃO MELHORADA =====
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    
    if (header && nav) {
        let menuToggle = document.querySelector('.menu-toggle');
        if (!menuToggle) {
            menuToggle = document.createElement('button');
            menuToggle.className = 'menu-toggle';
            menuToggle.innerHTML = '☰';
            menuToggle.setAttribute('aria-label', 'Menu');
            const logoContainer = header.querySelector('.logo-container');
            if (logoContainer) {
                logoContainer.insertAdjacentElement('afterend', menuToggle);
            } else {
                header.appendChild(menuToggle);
            }
        }

        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation(); //Impede que o clique no botão seja "passado adiante" e feche o menu por engano
            nav.classList.toggle('active');
            menuToggle.innerHTML = nav.classList.contains('active') ? '✕' : '☰';    //Se o menu estiver ativo, mostra ✕; se não estiver, mostra ☰
        });

        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                menuToggle.innerHTML = '☰';
            });
        });
        document.addEventListener('click', function(event) {
            const isClickInsideNav = nav.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            if (!isClickInsideNav && !isClickOnToggle && nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuToggle.innerHTML = '☰';
            }
        });
    }
});







// FORMATAÇÃO DE PREÇO
function formatarPreco(valor) {
    let partes = valor.toFixed(2).split('.');
    return "R$ " + partes[0] + ',' + partes[1];
}







// BANCO DE DADOS DE PRODUTOS
const produtos = [
    {nome:"Camiseta Básica",preco:49.90,imagem:"img/camiseta.jpg",categoria:"casual",tecido:["medio"],tipo:"blusa"},
    {nome:"Calça Jeans",preco:129.90,imagem:"img/calcajeans.png",categoria:"casual",tecido:["escuro"],tipo:"calça"},
    {nome:"Moletom Casual",preco:89.90,imagem:"img/moletomcasual.png",categoria:"trabalho",tecido:["claro"],tipo:"blusa"},
    {nome:"Saia Romântica",preco:79.90,imagem:"img/saia.png",categoria:"romantico",tecido:["medio"],tipo:"calça"},
    {nome:"Blusa Social",preco:69.90,imagem:"img/blusasocial.png",categoria:"trabalho",tecido:["medio"],tipo:"blusa"},
    {nome:"Vestido Noite",preco:159.90,imagem:"img/vestidonoite.png",categoria:"noite",tecido:["claro"],tipo:"vestido"},
    {nome:"Calça Social",preco:139.90,imagem:"img/calcasocial.png",categoria:"trabalho",tecido:["medio"],tipo:"calça"},
    {nome:"Body",preco:69.50,imagem:"img/body.png",categoria:"romantico",tecido:["claro"],tipo:"blusa"},
    {nome:"Blusa de Festa",preco:89.90,imagem:"img/blusadefesta.jpg",categoria:"noite",tecido:["medio"],tipo:"blusa"},
    {nome:"Shorts Casual",preco:59.90,imagem:"img/shortsCasual.jpg",categoria:"casual",tecido:["medio"],tipo:"calça"},
    {nome:"Saia Longa",preco:99.90,imagem:"img/saialonga.png",categoria:"romantico",tecido:["escuro"],tipo:"calça"},
    {nome:"Calça Elegante",preco:149.90,imagem:"img/calcaelegante.png",categoria:"noite",tecido:["medio"],tipo:"calça"}
];







// SELEÇÃO DE ELEMENTOS DO DOM
const produtosContainer = document.querySelector(".products-list");
const selectTecido = document.getElementById("filtro-pele");
const selectBlusa = document.getElementById("select-blusa");
const lookSugestao = document.getElementById("saida-look");
const busca = document.getElementById("campo-busca");
const botoesEstilo = document.querySelectorAll(".btn-estilo");
const listaCarrinho = document.getElementById("lista-carrinho");
const totalSpan = document.getElementById("total");
const btnLimpar = document.getElementById("btn-limpar");
const btnFinalizar = document.getElementById("btn-finalizar");






// CARRINHO DE COMPRAS
let carrinho = [];
let total = 0;
let contadorPedidos = 0;


function gerarCodigoPedido() {
    contadorPedidos++;
    return "LV-" + String(contadorPedidos).padStart(6, '0');   // padStart coloca zeros na frente até o código ter o tamanho desejado
}


function atualizarCarrinho() {
    if (!listaCarrinho || !totalSpan) return;
    listaCarrinho.innerHTML = "";
    if (carrinho.length === 0) {
        listaCarrinho.innerHTML = '<li class="carrinho-vazio">Seu carrinho está vazio</li>';
        totalSpan.textContent = "0,00";
        return;
    }
    carrinho.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${item.nome} – ${formatarPreco(item.preco)}</span>
        <button class='remover' data-index='${index}'> ✕ </button>`;
        listaCarrinho.appendChild(li);
    });
    totalSpan.textContent = formatarPreco(total).replace("R$ ", "");
    document.querySelectorAll(".remover").forEach(btn => {
        btn.addEventListener("click", () => removerDoCarrinho(parseInt(btn.dataset.index)));
    });
}



function adicionarAoCarrinho(produto) {
    carrinho.push(produto);
    total += produto.preco;
    atualizarCarrinho();
}


function removerDoCarrinho(index) {
    total -= carrinho[index].preco;
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

if (btnLimpar) {
    btnLimpar.addEventListener("click", () => {
        if (carrinho.length && confirm("Deseja realmente limpar o carrinho?")) {
            carrinho = [];
            total = 0;
            atualizarCarrinho();
        }
    });
}









// FINALIZAR COMPRA COM ENDEREÇO E PAGAMENTO
if (btnFinalizar) {
    btnFinalizar.addEventListener("click", () => {
        if (carrinho.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

        const endereco = prompt("Digite seu endereço de entrega:");
        if (!endereco || endereco.trim() === "") {
            alert("Você precisa informar o endereço de entrega.");
            return;
        }
        const formasPagamento = ["Pix", "Cartão de Crédito", "Boleto"];
        let formaPagamento = prompt("Qual a forma de pagamento? (Pix, Cartão de Crédito, Boleto)");
        if (!formaPagamento || !formasPagamento.map(f=>f.toLowerCase()).includes(formaPagamento.trim().toLowerCase())) {
            alert("Escolha uma forma de pagamento válida: Pix, Cartão de Crédito, ou Boleto.");
            return;
        }


        formaPagamento = formaPagamento.charAt(0).toUpperCase() + formaPagamento.slice(1).toLowerCase();   //charAt(0) → pega a 1ª letra
        let codigoPedido = gerarCodigoPedido();
        let dataAtual = new Date().toLocaleDateString("pt-BR");   //formata para o padrão brasileiro (dia/mês/ano)
        let itensTexto = carrinho.map(item=>`${item.nome} - ${formatarPreco(item.preco)}`).join('\n');
        let confirmacao = (`COMPRA FINALIZADA!\n\nCódigo do Pedido: ${codigoPedido}\nData: ${dataAtual}\nEndereço: ${endereco}\nPagamento: ${formaPagamento}\n\nItens do pedido:\n${itensTexto}\n\nTotal: ${formatarPreco(total)}\n\nGuarde este código para acompanhar seu pedido!`);
        alert(confirmacao);

        let mensagem = `Olá! Gostaria de finalizar meu pedido:\n\nCódigo: ${codigoPedido}\nData: ${dataAtual}\nEndereço: ${endereco}\nPagamento: ${formaPagamento}\n\n` +
            carrinho.map(item=>`- ${item.nome}: ${formatarPreco(item.preco)}`).join('\n') +
            `\n\nTotal: ${formatarPreco(total)}`;

        let whatsappURL = "https://wa.me/5500000000000?text=" + encodeURIComponent(mensagem);
        window.open(whatsappURL, "_blank");
        carrinho = [];
        total = 0;
        atualizarCarrinho();
    });
}









// RENDERIZAÇÃO DE PRODUTOS
function renderizarProdutos(lista) {
    if (!produtosContainer) return;
    produtosContainer.innerHTML = "";
    if (lista.length === 0) {
        produtosContainer.innerHTML = '<div class="no-results">Nenhum produto encontrado</div>';
        return;
    }

    lista.forEach(produto => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        card.innerHTML = `
            <div class='product-image'><img src='${produto.imagem}' alt='${produto.nome}' style='width:100%;height:100%;object-fit:cover;'></div>
            <div class='product-info'>
            <h3>${produto.nome}</h3>
            <p class='product-price'>${formatarPreco(produto.preco)}</p>
            <button class='product-button add-to-cart' data-nome='${produto.nome}' data-preco='${produto.preco}'> Adicionar ao Carrinho</button>
            </div>`;
        produtosContainer.appendChild(card);
    });

    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", () => {
            const nome = btn.dataset.nome;
            const produto = produtos.find(p => p.nome === nome);
            adicionarAoCarrinho(produto);
            btn.textContent = "✓ Adicionado!";
            btn.style.background = "var(--color-2)";
            btn.style.color = "white";

            setTimeout(() => {      //// setTimeout espera um tempo e depois executa o código
                btn.textContent = " Adicionar ao Carrinho";
                btn.style.background = "";
                btn.style.color = "";
            }, 1000);
        });
    });
}









// Inicialização e filtros
if (produtosContainer) renderizarProdutos(produtos);
if (botoesEstilo.length > 0) {
    botoesEstilo.forEach(btn => {
        btn.addEventListener("click", () => {
            botoesEstilo.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const tipo = btn.dataset.estilo;
            if (selectTecido) selectTecido.value = "todas";
            if (busca) busca.value = "";
            if (tipo === "todos") renderizarProdutos(produtos);
            else renderizarProdutos(produtos.filter(p => p.categoria === tipo));
        });
    });
}
if (selectTecido) {
    selectTecido.addEventListener("change", () => {
        const tom = selectTecido.value;
        if (busca) busca.value = "";
        if (tom === "todas") renderizarProdutos(produtos);
        else renderizarProdutos(produtos.filter(p => p.tecido.includes(tom)));
    });
}







// MONTAR LOOK AUTOMÁTICO
function preencherSelectBlusas() {
    if (!selectBlusa) return;
    selectBlusa.innerHTML = "<option value=''>Selecione uma blusa</option>";
    produtos.filter(p => p.tipo === "blusa").forEach(blusa => {
        const op = document.createElement("option");
        op.value = blusa.nome;
        op.textContent = `${blusa.nome} - ${formatarPreco(blusa.preco)}`;
        selectBlusa.appendChild(op);
    });
}

if (selectBlusa && lookSugestao) {
    preencherSelectBlusas();
    selectBlusa.addEventListener("change", () => {
        const nomeBlusa = selectBlusa.value;
        lookSugestao.innerHTML = "";
        if (nomeBlusa === "") {
            lookSugestao.innerHTML = '<p style="color: #999; text-align: center; padding: 2rem;">Selecione uma blusa para ver sugestões de look </p>';
            return;
        }


        const blusaSelecionada = produtos.find(p => p.nome === nomeBlusa);
        const calcas = produtos.filter(p => p.tipo === "calça" && p.categoria === blusaSelecionada.categoria);
        
        if (calcas.length > 0) {
            lookSugestao.innerHTML = '<h4> Sugestões de peças para combinar:</h4>';
            calcas.forEach(calca => {
                const lookCard = document.createElement("div");
                lookCard.classList.add("look-card");
                lookCard.style.marginBottom = "1rem";
                lookCard.innerHTML = `
                    <div class='look-card-image'><img src='${calca.imagem}' alt='${calca.nome}' style='width: 100%; height: 100%; object-fit: cover; border-radius: 12px;'></div>
                    <div class='look-card-info'><h5>${calca.nome}</h5>
                    <p>${formatarPreco(calca.preco)}</p>
                    <p style='color: #666; font-size: 0.9rem; font-weight: 400; margin-top: 0.5rem;'>Estilo: ${calca.categoria.charAt(0).toUpperCase() + calca.categoria.slice(1)}</p>
                    </div>`;
                lookSugestao.appendChild(lookCard);
            });

            const totalLook = blusaSelecionada.preco + calcas[0].preco;
            const totalDiv = document.createElement("div");
            totalDiv.style.cssText = "margin-top: 2rem; padding: 1.5rem; background: var(--color-2); color: white; border-radius: 12px; text-align: center;";
            


            // Botão “Adicionar Look Completo”
            const addLookBtn = document.createElement("button");
            addLookBtn.textContent = " Adicionar Look Completo";
            addLookBtn.style.cssText = `
                margin-top: 1rem;
                padding: 0.8rem 1.5rem;
                background: #ffffff;
                color: var(--color-2);
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                width: 100%;
                font-size: 0.95rem;
            `;
            addLookBtn.onmouseover = () => {
                addLookBtn.style.transform = "scale(1.05)";
                addLookBtn.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
            };
            addLookBtn.onmouseout = () => {
                addLookBtn.style.transform = "scale(1)";
                addLookBtn.style.boxShadow = "none";
            };

            addLookBtn.addEventListener("click", () => {
                adicionarAoCarrinho(blusaSelecionada);
                adicionarAoCarrinho(calcas[0]);
                alert(" Look completo adicionado ao carrinho!");
                selectBlusa.value = "";
                lookSugestao.innerHTML = '<p style="color: #999; text-align: center; padding: 2rem;">Selecione uma blusa para ver sugestões de look </p>';
            });
            
            totalDiv.innerHTML = `<h4 style='margin-bottom: 0.5rem; color: white;'> Look Completo</h4>
                                  <p style='font-size: 1.5rem; font-weight: 600; color: white;'>${formatarPreco(totalLook)}</p>`;
            totalDiv.appendChild(addLookBtn);
            lookSugestao.appendChild(totalDiv);

        } else {
            lookSugestao.innerHTML = '<p style="color: #999; text-align: center; padding: 2rem;">Ops! Não encontramos peças para combinar com essa blusa no momento </p>';
        }
    });
    lookSugestao.innerHTML = '<p style="color: #999; text-align: center; padding: 2rem;">Selecione uma blusa para ver sugestões de look </p>';
}








// BUSCA
if (busca) {
    busca.addEventListener("input", () => {
        const valor = busca.value.toLowerCase().trim();
        if (selectTecido) selectTecido.value = "todas";
        botoesEstilo.forEach(b => b.classList.remove("active"));
        if (botoesEstilo[0]) botoesEstilo[0].classList.add("active");
        if (valor === "") renderizarProdutos(produtos);
        else renderizarProdutos(produtos.filter(p => p.nome.toLowerCase().includes(valor) || p.categoria.toLowerCase().includes(valor)));
    });
}







// CONTROLE DO CARRINHO COM SCROLL

(function() {
    let ultimoScroll = 0;
    const carrinho = document.querySelector('.carrinho');

    if (!carrinho) return;

    window.addEventListener("scroll", () => {
        const scrollAtual = window.scrollY;  //quanto a página já foi rolada para baixo, em pixels.
        //O valor aumenta quando você desce

        // Rolando para baixo → esconder carrinho
        if (scrollAtual > ultimoScroll && scrollAtual > 100) {
            carrinho.classList.add("hidden");
        }
        // Rolando para cima → mostrar carrinho
        else {
            carrinho.classList.remove("hidden");
        }

        ultimoScroll = scrollAtual; // atualiza o último scroll
    });
})();







// QUEM SOMOS - Menu mobile para pagina sobre
function toggleMenu() {
    const navbar = document.getElementById('navbar');
    if(navbar) navbar.classList.toggle('active');
}
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        const navbar = document.getElementById('navbar');
        if(navbar) navbar.classList.remove('active');
    });
});
document.addEventListener('click', (e) => {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    if (navbar && menuToggle && !navbar.contains(e.target) && !menuToggle.contains(e.target)) {
        navbar.classList.remove('active');
    }
});
