
let carrinho =[]
const carrinhoSalvo = localStorage.getItem('carrinho')
if(carrinhoSalvo){
  carrinho = JSON.parse(carrinhoSalvo)
  renderizarCarrinho()
}

const btnMenu = document.querySelector('#btn-menu')
const gaveta = document.querySelector('#gaveta')
const overlay = document.querySelector('#overlay')
const btnFechar = document.querySelector('#btn-fechar')
const linkCarrinho = document.querySelector('#link-carrinho')
const carrinhoDrawer = document.querySelector('#carrinho-drawer')
const btnfecharCarrinho = document.querySelector('#btn-fechar-carrinho')
const btnFlutuante = document.querySelector('.btn-flutuante')

    btnMenu.addEventListener('click', function(){
      gaveta.classList.toggle('aberta')
      overlay.classList.toggle('ativo')
      btnFechar.classList.toggle('visivel')
})

    overlay.addEventListener('click', function(){
      gaveta.classList.remove('aberta')
      overlay.classList.remove('ativo')
      btnFechar.classList.remove('visivel') 
      carrinhoDrawer.classList.remove('aberto')
  })

   btnFechar.addEventListener('click', function(){
   gaveta.classList.remove('aberta')
   overlay.classList.remove('ativo')
   btnFechar.classList.remove('visivel')
})

   linkCarrinho.addEventListener('click', function(e){
     e.preventDefault()
     gaveta.classList.remove('aberta')
     carrinhoDrawer.classList.add('aberto')
     btnFechar.classList.remove('visivel')
   })

   btnFlutuante.addEventListener('click', function(){
    overlay.classList.add('ativo')
    carrinhoDrawer.classList.add('aberto')
   })

   btnfecharCarrinho.addEventListener('click', function(){
     carrinhoDrawer.classList.remove('aberto')
     overlay.classList.remove('ativo')
   })

   document.querySelector('#carrinho-itens').addEventListener('click', function(e){
    const id = e.target.dataset.id
      if(e.target.classList.contains('btn-mais')){
      const produto = carrinho.find(item => item.id == id)
      produto.quantidade++
      renderizarCarrinho()
      }
      if(e.target.classList.contains('btn-remover')){
       carrinho = carrinho.filter(item => item.id !== id)
       renderizarCarrinho()
      }
      if(e.target.classList.contains('btn-menos')){
        const produtoMenos = carrinho.find(item =>item.id == id)
        produtoMenos.quantidade--
        renderizarCarrinho()
      }
    })
   
function renderizarCarrinho(){
    const carrinhoItens = document.querySelector('#carrinho-itens')
    

    let html = ''

    carrinho.forEach(item =>{
        html += `
        <div class = 'carrinho-item'>
        <div class = 'produto'>${item.nome}</div>
        <div class = 'controles'>
        ${item.quantidade > 1
          ? ` <button class = 'btn-menos' data-id='${item.id}'>-</button>`
          : `<button class ='btn-remover' data-id = '${item.id}'>🗑</button>`
        }
        <span>${item.quantidade}</span>
        <button class = 'btn-mais' data-id='${item.id}'>+</button>
        </div>
        </div> 
        `
    })
        carrinhoItens.innerHTML = html
        document.querySelector('#total-carrinho').innerHTML = 'R$' + calcularTotal()

        localStorage.setItem('carrinho', JSON.stringify(carrinho))

      const carrinhoFlutuante = document.querySelector('#carrinho-flutuante')
      let totalItens = 0
      carrinho.forEach(item => totalItens += item.quantidade)
      if(totalItens > 0){
        carrinhoFlutuante.style.display ='block'
        document.querySelector('#contador-flutuante').innerHTML = totalItens
      }else{
        carrinhoFlutuante.style.display ='none'
      }
  }


document.querySelectorAll('.btn-adicionar').forEach(botao => {
    botao.addEventListener('click', function(){
    const id = this.dataset.id
    const nome = this.dataset.nome
    const preco = this.dataset.preco

    const produtoExistente = carrinho.find(item => item.id == id)

    if(produtoExistente){
        produtoExistente.quantidade++
        renderizarCarrinho()
    }else{
     carrinho.push({id, nome, preco, quantidade:1})
     renderizarCarrinho()
    }
    })
})

function calcularTotal(){
  let total = 0

  carrinho.forEach(item =>{
     total += item.preco* item.quantidade
  })
  return total
}