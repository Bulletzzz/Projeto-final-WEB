class produto {
    constructor(img,nm,prc,cat,fabricantev,descricaov,modelo,status,excluido) {
        this.img = img;
        this.nm = nm;
        this.prc = prc;
        this.cat = cat;
        this.fabricantev = fabricantev;
        this.descricaov = descricaov;
        this.modelo = modelo;
        this.status = status;
        this.excluido = excluido;
    }
}

const prodsdados = localStorage.getItem('produtos');
const catdados = localStorage.getItem('categorias');
let produtos = [];
let categorias = [];

if (prodsdados) {
  const arrayBruto = JSON.parse(prodsdados);
  produtos = arrayBruto.map(obj => new produto(obj.img, obj.nm, obj.prc,obj.cat, obj.fabricantev, obj.descricaov, obj.modelo, obj.status, obj.excluido));
}

if (catdados){
    categorias = JSON.parse(catdados);
    
}

let img = null;
const btnexlcuirent = document.getElementById("excluir")
const input = document.getElementById('imageInput');
const botaoimg = document.getElementById('imglabel');
const preview = document.getElementById('preview');
const fechar = document.getElementById('fechar');
const prodnovo = document.getElementById('backgroundbox');
const btnnovoprod = document.getElementById('novoprod');
const numerodemaquinas = document.getElementById("numerodemaquinas");
const btncategorias = document.getElementById("categoriasbtn");
const categoriasbox = document.getElementById("categoriasbox");
const Nomecat = document.getElementById("Nomecat");
const msgmodelo = document.getElementById("msgmodelo")

    input.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (teste) {
            const base64 = teste.target.result;
            preview.src = base64;
            preview.style.display = 'block';
            botaoimg.textContent = 'Trocar imagem';
            img = base64;
      };
    });

const nome = document.getElementById('nome')
const preco = document.getElementById('preco')
const fabricante = document.getElementById('fabricante')
const descricao = document.getElementById('descricao')
const categoriaprod = document.getElementById('categoria')
const enviar = document.getElementById('enviar')
const modeloobj = document.getElementById('modelo')

enviar.addEventListener('click', function() {
    if (!validar()) {
        return; 
    }
    const modelov = modeloobj.value
    const cat = categoriaprod.value
    const nomev = nome.value
    const fabricantev = fabricante.value
    const descricaov = descricao.value
    const precov = preco.value
    let statusv = "";
    if(btnstatus.classList.contains('statusativo')){
        statusv = 'Ativo'
    } else {
        statusv = 'Inativo'}
    if(editarmaq !== null){
        produtos[Number(editarmaq)-1].nm = nomev
        produtos[Number(editarmaq)-1].prc = precov
        produtos[Number(editarmaq)-1].cat = cat
        produtos[Number(editarmaq)-1].fabricantev = fabricantev
        produtos[Number(editarmaq)-1].modelo = modelov
        produtos[Number(editarmaq)-1].descricaov = descricaov
        produtos[Number(editarmaq)-1].img = img
        produtos[Number(editarmaq)-1].status = statusv
        prodnovo.classList.remove("ativo");
        editarmaq = null;
    } else {
        if(img == null){
            img = "maquinagenerica.png"
        }
    const prod = new produto(img,nomev,precov,cat,fabricantev,descricaov,modelov,statusv,false)
    produtos.push(prod)}
    localStorage.setItem('produtos', JSON.stringify(produtos));
    nome.value = "";preco.value = "";fabricante.value = "";descricao.value = "";categoriaprod.value = "";modeloobj.value = "";input.value ="";preview.src = "";img = null;
    btnstatus.className = "statusativo"
    btnstatus.textContent = "Ativo"
    AtualizarProds();
    console.log(produtos)
    botoeseditar()
})

console.log(produtos)

fechar.addEventListener('click', function(){
    prodnovo.classList.remove("ativo");
    editarmaq = null;
    nome.value = "";preco.value = "";fabricante.value = "";descricao.value = "";categoriaprod.value = "";modeloobj.value = "";input.value ="";preview.src = "";img = null;
    document.querySelectorAll('.invalido').forEach(input => input.classList.remove('invalido'));
    document.querySelectorAll('.mensagem-erro').forEach(msg => {
        msg.textContent = '';
        msg.classList.remove('visivel');
    });
    btnstatus.className = "statusativo"
    btnstatus.textContent = "Ativo"
    btnexlcuirent.style.display = "none";
    btnexlcuirent.textContent = "Excluir"
    cliques = 0;
})

btnnovoprod.addEventListener('click', function(){
    prodnovo.classList.add("ativo");
    msgmodelo.textContent = "Crie modelo novo"
})

btncategorias.addEventListener('click', function(){
    categoriasbox.classList.add("ativo");
})

const fechar2 = document.getElementById("fechar2")

fechar2.addEventListener('click', function(){
    categoriasbox.classList.remove("ativo");
})

const entidades = document.getElementById('entidades');
function AtualizarProds() {
    let qntprods = produtos.length;
    entidades.innerHTML = "";
while(qntprods > 0) {
    if(produtos[qntprods-1].excluido == true){
        console.log("bernardo")
        qntprods -= 1;
    }else{
    const caixaproduto = document.createElement("tr");
    caixaproduto.id = qntprods
    caixaproduto.innerHTML = `  <td><img src="${produtos[qntprods-1].img}" alt="">${produtos[qntprods-1].nm}</td>
                                <td class="categoria">${produtos[qntprods-1].modelo}</td>
                                <td>${produtos[qntprods-1].fabricantev}</td>
                                <td>${produtos[qntprods-1].cat}</td>
                                <td>${produtos[qntprods-1].prc}</td>
                                <td><span class="status">${produtos[qntprods-1].status}</span></td>
                                <td class="tresponto">⋮</td>`

    const trespontoscoluna = caixaproduto.querySelector('.status');

            if (produtos[qntprods-1].status === 'Inativo') {
                trespontoscoluna.classList.add('inativo');
                console.log("bisteca")
            } else {
                trespontoscoluna.classList.remove('inativo');
            }

    entidades.appendChild(caixaproduto)
    qntprods -= 1;
    let maquinasVal = produtos.filter(produto => produto.excluido === false);
    numerodemaquinas.innerText = `${maquinasVal.length}`
    }
}
}

let maquinasVal = produtos.filter(produto => produto.excluido === false);
if(maquinasVal.length > 0){
    AtualizarProds();
}
else {
    numerodemaquinas.innerText = `0`
}
preco.addEventListener("input", function () {
  let valor = this.value;
  valor = valor.replace(",", ".");
  valor = valor.replace(/[^0-9.]/g, "");
  const partes = valor.split('.');
  if (partes.length > 2) {
    valor = partes[0] + "." + partes.slice(1).join("");
  }
  this.value = valor;
});

const tabelacat = document.getElementById("tabcategorias")

const btnsalvarcat = document.getElementById("salvarcat")
const msgerro = document.getElementById("msgerro")
let IdEdicaocat = null;

btnsalvarcat.addEventListener('click',function(){
    if(Nomecat.value === ""){
        msgerro.innerText = "É necessário preencher um nome"
    } else {
    msgerro.innerText = ""
    if(IdEdicaocat !== null){
        categorias[IdEdicaocat - 1] = Nomecat.value;
        IdEdicaocat = null;
        btnsalvarcat.textContent = "Salvar";
        localStorage.setItem('categorias', JSON.stringify(categorias));
        Nomecat.value = "";
        Atualizarcat();
    }
    else {
    categorias.push(Nomecat.value);
    Nomecat.value = "";
    localStorage.setItem('categorias', JSON.stringify(categorias));
    Atualizarcat();
    }}
})

const selecionarcat = document.getElementById('categoria');
function Atualizarcat() {
    tabelacat.innerHTML = "";
    for (let i = categorias.length; i > 0; i--) {
        if(categorias[i-1].includes("(Excluido)")){
        }
        else {
        const novacat = document.createElement("tr");
        novacat.id = `${i}`;
        novacat.className = "categoriarow";
        novacat.innerHTML = `<td>${categorias[i - 1]}</td>
                             <td><i class="fa-solid fa-pen-to-square"></i></td>
                             <td><i class="fa-solid fa-trash"></i></td>`;
        const iconeEditar = novacat.querySelector('.fa-pen-to-square');
        const iconeExcluir = novacat.querySelector('.fa-trash');
        iconeEditar.addEventListener('click', () => {
            Nomecat.value = `${categorias[novacat.id-1]}`
            IdEdicaocat = novacat.id;
            btnsalvarcat.textContent = "Atualizar"
        });
        
        iconeExcluir.addEventListener('click', () => {
            categorias[novacat.id-1] = `${categorias[novacat.id-1]}(Excluido)`
            localStorage.setItem('categorias', JSON.stringify(categorias));
            Nomecat.value = "";
            Atualizarcat();
        });
        
        tabelacat.appendChild(novacat);

            selecionarcat.innerHTML = `<option value="" disabled selected>Selecione uma categoria*</option>`;
            categorias.forEach(categoria => {
            if(categoria.includes("(Excluido)")){
                }
            else {
            const catopcao = document.createElement('option');
            catopcao.value = categoria;
            catopcao.textContent = categoria;
            selecionarcat.appendChild(catopcao);}
});
    }
    }
}

Atualizarcat();

const editarprod = document.querySelectorAll('.tresponto');
let editarmaq = null;

function botoeseditar(){
    entidades.addEventListener('click', function(event) {
    const botaoClicado = event.target.closest('.tresponto');
    if (!botaoClicado) {
        return;
    }
    const linhaDoProduto = botaoClicado.closest('tr');
    editarmaq = linhaDoProduto.id;
    prodnovo.classList.add("ativo");
    nome.value = produtos[editarmaq - 1].nm;
    msgmodelo.textContent = `Editando ${produtos[editarmaq - 1].nm}`;
    preco.value = produtos[editarmaq - 1].prc;
    fabricante.value = produtos[editarmaq - 1].fabricantev;
    descricao.value = produtos[editarmaq - 1].descricaov;
    categoriaprod.value = produtos[editarmaq - 1].cat;
    modeloobj.value = produtos[editarmaq - 1].modelo;
    img = produtos[Number(editarmaq)-1].img
    preview.src = produtos[Number(editarmaq)-1].img
    btnexlcuirent.style.display = "block";
    preview.style.display = 'block';
    if(produtos[Number(editarmaq)-1].status == "Inativo"){
        console.log("pao com banana")
        btnstatus.className = "statusinativo"
        btnstatus.textContent = "Inativo"
    }
    else if(produtos[Number(editarmaq)-1].status == "Ativo"){
        btnstatus.className = "statusativo"
        btnstatus.textContent = "Ativo"
    }
});
}

let cliques = 0;
btnexlcuirent.addEventListener('click' ,function(){
    cliques +=1;
    btnexlcuirent.textContent = "Confirmar"
    if(cliques == 2){
    produtos[Number(editarmaq)-1].excluido = true;
    localStorage.setItem('produtos', JSON.stringify(produtos));
    AtualizarProds()
    cliques = 0;

    prodnovo.classList.remove("ativo");
    editarmaq = null;
    nome.value = "";preco.value = "";fabricante.value = "";descricao.value = "";categoriaprod.value = "";modeloobj.value = "";input.value ="";preview.src = "";img = null;
    document.querySelectorAll('.invalido').forEach(input => input.classList.remove('invalido'));
    document.querySelectorAll('.mensagem-erro').forEach(msg => {
        msg.textContent = '';
        msg.classList.remove('visivel');
    });
    btnstatus.className = "statusativo"
    btnstatus.textContent = "Ativo"
    btnexlcuirent.style.display = "none";
    btnexlcuirent.textContent = "Excluir"

    }
})

botoeseditar()

function validar() {
    let formulario = true;
    document.querySelectorAll('.invalido').forEach(input => input.classList.remove('invalido'));
    document.querySelectorAll('.mensagem-erro').forEach(msg => {
        msg.textContent = '';
        msg.classList.remove('visivel');
    });
    const campos = [
        { input: nome, mensagem: 'O campo Nome é obrigatório.' },
        { input: preco, mensagem: 'O campo Custo é obrigatório.' },
        { input: fabricante, mensagem: 'O campo Fabricante é obrigatório.' },
        { input: categoriaprod, mensagem: 'O campo Categoria é obrigatório.' },
        { input: modeloobj, mensagem: 'O campo Modelo é obrigatório.' }
    ];
    campos.forEach(campo => {
        if (campo.input.value.trim() === '') {
            formulario = false;
            campo.input.classList.add('invalido');
            const erro = campo.input.nextElementSibling;
            if (erro.classList.contains('mensagem-erro')) {
                erro.textContent = campo.mensagem;
                erro.classList.add('visivel');
            }
        }
    });
    return formulario;
}

const btnstatus = document.getElementById("statusbtn")
btnstatus.addEventListener('click', function(){
    if(btnstatus.classList.contains('statusativo')){
        btnstatus.className = "statusinativo"
        btnstatus.textContent = "Inativo"
    }
    else if(btnstatus.classList.contains('statusinativo')){
        btnstatus.className = "statusativo"
        btnstatus.textContent = "Ativo"
    }
})

console.log(categorias,produtos)

const btninfo = document.getElementById('infobtn1')
const infobox = document.getElementById('infobox')

btninfo.addEventListener('mouseover',function(){
    console.log('bernardao')
    infobox.style.visibility = 'visible'
    infobox.style.opacity = '1'
})

btninfo.addEventListener('mouseout',function(){
    infobox.style.visibility = 'hidden'
    infobox.style.opacity = '0'
})