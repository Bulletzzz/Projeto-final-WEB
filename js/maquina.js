const divmaquinas = document.getElementById('inputsnovamaq')
const btnnovamaq = document.getElementById('novamaq')
const preco = document.getElementById('preco')

class produto { //Construção da classe dos produtos
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

class maquina{
    constructor(nome,modelo,prec,local,img,data) {
        this.nome = nome;
        this.prec = prec;
        this.modelo = modelo;
        this.local = local
        this.img = img;
        this.data = data;
    }
}

//Parte do codigo que pega os dados que estão salvos no localstorage.
const prodsdados = localStorage.getItem('produtos');
let produtos = [];

const maqsdados = localStorage.getItem('maquinas');
let maquinas = [];

if (maqsdados) {
  const arrayBruto = JSON.parse(maqsdados);
  maquinas = arrayBruto.map(obj => new maquina(obj.nome, obj.modelo, obj.prec,obj.local, obj.img,obj.data));
}

if (prodsdados) {
  const arrayBruto = JSON.parse(prodsdados);
  produtos = arrayBruto.map(obj => new produto(obj.img, obj.nm, obj.prc,obj.cat, obj.fabricantev, obj.descricaov, obj.modelo, obj.status, obj.excluido));
}

const maquinasel = document.getElementById('maquinasel')

produtos.forEach(maquina => {
    if(maquina.status == 'Inativo'){

    }else{
    const maqopcao = document.createElement('option');
            maqopcao.value = maquina.nm;
            maqopcao.textContent = maquina.nm;
            maquinasel.appendChild(maqopcao);
        }
});

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

const novamaq = document.getElementById('novamaq')

novamaq.addEventListener('click',function(){
    divmaquinas.style.display = 'flex'
    divmaquinas.style.opacity = '1'
    divmaquinas.style.height = 'auto'
})

const erromsg = document.getElementById('erromsg')
const nome = document.getElementById('nome')
const local = document.getElementById('local')
const data = document.getElementById('data')

const salvar = document.getElementById('salvar')

salvar.addEventListener('click',function(){
    if(nome.value === "" || preco.value === "" || maquinasel.value === "" || local.value === ""){
        erromsg.style.display = 'block';
    }
    else{
        let imagem = produtos.find(p => p.nm == maquinasel.value)
        imagem = imagem.img
        const maq = new maquina(nome.value,maquinasel.value,preco.value,local.value,imagem,data.value)
        maquinas.push(maq)
        console.log(maquinas)
    divmaquinas.style.display = 'none'
    divmaquinas.style.opacity = '0'
    divmaquinas.style.height = '0px'}
    localStorage.setItem('maquinas', JSON.stringify(maquinas));
    constroigrid()
})

const divdemaqs = document.getElementById('entidades4')


function constroigrid(){
    divdemaqs.innerHTML=''
    maquinas.forEach(m => {
        let novadiv = document.createElement("div");
        novadiv.className = 'maquinabonita'
        novadiv.innerHTML = `   <div class="maquinabonita2">
                                    <img src="${m.img}" alt="">
                                    <p class="editarmaquinabtn">⋮</p>
                                </div>
                                <h1>${m.nome}</h1>
                                <p>Modelo: ${m.modelo}</p>
                                <p>Data de instalação: ${m.data}</p>
                                <p>Aluguel: ${m.prec}</p>
                                <span class="status">Ativo</span></td>`;
        divdemaqs.appendChild(novadiv)
    });
}

constroigrid()