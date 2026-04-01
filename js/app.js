let carrinhoItens = [];

function carregarCarrinho() {
const carrinhoSalvo = localStorage.getItem("carrinho");
if (carrinhoSalvo) {
carrinhoItens = JSON.parse(carrinhoSalvo);
}
renderizarCarrinho();
}

document.addEventListener("DOMContentLoaded", () => {
carregarCarrinho();
});

const botaoFinalizar = document.getElementById("finalizar");
const contador = document.getElementById("contador");
const contadorMobile = document.getElementById("contador-mobile");
const toast = document.getElementById("toast");
const botaoCarrinho = document.getElementById("btn-carrinho");
const carrinho = document.getElementById("carrinho");

let quantidade = 0;
let total = 0;


// CARRINHO - DESKTOP

if (botaoCarrinho) {
botaoCarrinho.addEventListener("click", (e) => {
e.stopPropagation();
carrinho.classList.toggle("ativo");
});
}

// Fechar carrinho clicando fora
document.addEventListener("click", (e) => {
if (
!carrinho.contains(e.target) &&
(!botaoCarrinho || !botaoCarrinho.contains(e.target)) &&
(!document.getElementById("tab-carrinho") || !document.getElementById("tab-carrinho").contains(e.target))
) {
carrinho.classList.remove("ativo");
}
});


// TAB BAR MOBILE

const tabInicio = document.getElementById("tab-inicio");
const tabCardapio = document.getElementById("tab-cardapio");
const tabCarrinho = document.getElementById("tab-carrinho");
const tabContato = document.getElementById("tab-contato");
const tabBtns = document.querySelectorAll(".tab-btn");

function setTabAtivo(btnAtivo) {
tabBtns.forEach(b => b.classList.remove("ativo"));
btnAtivo.classList.add("ativo");
}

tabInicio.addEventListener("click", () => {
setTabAtivo(tabInicio);
carrinho.classList.remove("ativo");
window.scrollTo({ top: 0, behavior: "smooth" });
});

tabCardapio.addEventListener("click", () => {
setTabAtivo(tabCardapio);
carrinho.classList.remove("ativo");
const vitrine = document.getElementById("vitrine");
const alturaHeader = document.querySelector(".header-mobile")?.offsetHeight || 65;
const posicao = vitrine.getBoundingClientRect().top + window.scrollY - alturaHeader;
window.scrollTo({ top: posicao, behavior: "smooth" });
});

tabCarrinho.addEventListener("click", (e) => {
e.stopPropagation();
setTabAtivo(tabCarrinho);
carrinho.classList.toggle("ativo");
});

tabContato.addEventListener("click", () => {
setTabAtivo(tabContato);
const numero = "559999999999";
window.open(`https://wa.me/${numero}`, "_blank");
});

// NAVBAR DESKTOP

const btnInicio = document.getElementById("btn-inicio");
const btnCardapio = document.getElementById("btn-cardapio");
const btnContato = document.getElementById("btn-contato");

if (btnInicio) {
btnInicio.addEventListener("click", () => {
window.scrollTo({ top: 0, behavior: "smooth" });
});
}

if (btnCardapio) {
btnCardapio.addEventListener("click", () => {
const vitrine = document.getElementById("vitrine");
const alturaHeader = document.querySelector("header")?.offsetHeight || 90;
const posicao = vitrine.getBoundingClientRect().top + window.scrollY - alturaHeader;
window.scrollTo({ top: posicao, behavior: "smooth" });
});
}

if (btnContato) {
btnContato.addEventListener("click", () => {
const numero = "559999999999";
window.open(`https://wa.me/${numero}`, "_blank");
});
}

// BOTÕES ADD

const botoesAdd = document.querySelectorAll(".btn-add");
const listaCarrinho = document.getElementById("lista-carrinho");
const totalElemento = document.getElementById("total");

botoesAdd.forEach(botao => {
botao.addEventListener("click", () => {
const card = botao.closest(".card");
const nome = card.querySelector("h4").innerText;
const precoTexto = card.querySelector(".preco").innerText;
const preco = parseFloat(precoTexto.replace("R$", "").replace(",", "."));


    const itemExistente = carrinhoItens.find(item => item.nome === nome);
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinhoItens.push({ nome, preco, quantidade: 1 });
    }

    salvarCarrinho();
    renderizarCarrinho();

    toast.classList.add("ativo");
    setTimeout(() => {
        toast.classList.remove("ativo");
    }, 2000);
});


});

// FINALIZAR PEDIDO

botaoFinalizar.addEventListener("click", () => {
if (carrinhoItens.length === 0) {
alert("Seu carrinho está vazio!");
return;
}


let mensagem = "🍔 *Pedido:*\n\n";
carrinhoItens.forEach(item => {
    mensagem += `- ${item.nome} x${item.quantidade} (R$ ${(item.preco * item.quantidade).toFixed(2)})\n`;
});
mensagem += `\n💰 *Total: R$ ${total.toFixed(2)}*`;

const numero = "559999999999";
const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
window.open(url, "_blank");


});

// RENDERIZAR CARRINHO

function renderizarCarrinho() {
listaCarrinho.innerHTML = "";
total = 0;
quantidade = 0;

carrinhoItens.forEach(item => {
    const li = document.createElement("li");

    total += item.preco * item.quantidade;
    quantidade += item.quantidade;

    const texto = document.createElement("span");
    texto.innerHTML = `${item.nome} <strong>x${item.quantidade}</strong>`;

    const btnMais = document.createElement("button");
    btnMais.innerText = "+";
    btnMais.addEventListener("click", (e) => {
        e.stopPropagation();
        item.quantidade++;
        salvarCarrinho();
        renderizarCarrinho();
    });

    const btnMenos = document.createElement("button");
    btnMenos.innerText = "-";
    btnMenos.addEventListener("click", (e) => {
        e.stopPropagation();
        item.quantidade--;
        if (item.quantidade <= 0) {
            carrinhoItens = carrinhoItens.filter(i => i !== item);
        }
        salvarCarrinho();
        renderizarCarrinho();
    });

    const btnRemover = document.createElement("button");
    btnRemover.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    btnRemover.addEventListener("click", (e) => {
        e.stopPropagation();
        carrinhoItens = carrinhoItens.filter(i => i !== item);
        salvarCarrinho();
        renderizarCarrinho();
    });

    const controles = document.createElement("div");
    controles.style.display = "flex";
    controles.style.alignItems = "center";
    controles.appendChild(btnMais);
    controles.appendChild(btnMenos);
    controles.appendChild(btnRemover);

    li.appendChild(texto);
    li.appendChild(controles);
    listaCarrinho.appendChild(li);
});

totalElemento.innerText = total.toFixed(2);

// Atualiza contador desktop
if (contador) {
    contador.innerText = quantidade;
    if (quantidade > 0) {
        contador.classList.add("ativo");
    } else {
        contador.classList.remove("ativo");
    }
}

// Atualiza contador mobile
if (contadorMobile) {
    contadorMobile.innerText = quantidade;
    if (quantidade > 0) {
        contadorMobile.classList.add("ativo");
    } else {
        contadorMobile.classList.remove("ativo");
    }
}


}

function salvarCarrinho() {
localStorage.setItem("carrinho", JSON.stringify(carrinhoItens));
}

window.addEventListener("load", carregarCarrinho);

// FILTRO CATEGORIAS

const botoesCategoria = document.querySelectorAll(".categoria-item");
const cards = document.querySelectorAll(".card");

botoesCategoria.forEach(botao => {
botao.addEventListener("click", () => {
botoesCategoria.forEach(b => b.classList.remove("ativo"));
botao.classList.add("ativo");

    const categoriaSelecionada = botao.dataset.categoria;

    cards.forEach(card => {
        if (
            categoriaSelecionada === "todos" ||
            card.dataset.categoria === categoriaSelecionada
        ) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
});

});