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

const msgerro = document.getElementById('erromsg')

const prodsdados = localStorage.getItem('produtos');
let produtos = [];

if (prodsdados) {
  const arrayBruto = JSON.parse(prodsdados);
  produtos = arrayBruto.map(obj => new produto(obj.img, obj.nm, obj.prc,obj.cat, obj.fabricantev, obj.descricaov, obj.modelo, obj.status, obj.excluido));
}

console.log(produtos)
const selecionarprod = document.getElementById('maquinasel')
produtos.forEach(maquina => {
    console.log(maquina.status)
    if(maquina.status == 'Inativo'){

    }else{
    const maqopcao = document.createElement('option');
            maqopcao.value = maquina.nm;
            maqopcao.textContent = maquina.nm;
            selecionarprod.appendChild(maqopcao);
        }
});

const inputdata = document.getElementById('datainv')
const inputmaq = document.getElementById('maquinasel')
const inputqnt = document.getElementById('qntmaquinas')

inputqnt.addEventListener('input', function(){
    inputqnt.value = inputqnt.value.replace(".","")
    inputqnt.value = inputqnt.value.replace(",","")
})

const btnenviarinv = document.getElementById('enviarinv')

let inventarios = {}
if(localStorage.getItem('inventarios')){
    inventarios = JSON.parse(localStorage.getItem('inventarios'))
    console.log(inventarios)
}

btnenviarinv.addEventListener('click', function() {
    let vdata = inputdata.value;
    let vmaq = inputmaq.value;
    let vqnt = inputqnt.value;
    if(vdata == "" || vmaq == "" || vqnt == ""){
        msgerro.innerText = 'É preciso preencher todos os campos para enviar!'
        msgerro.style.display = 'block'
    }
    else {
    inventarios[vdata] = {'nome': vmaq, 'qnt':vqnt}
    console.log(inventarios)
    localStorage.setItem('inventarios',JSON.stringify(inventarios))
    inputmaq.value = '';
    inputdata.value = '';
    inputqnt.value = '';
    msgerro.innerText = 'Inventário registrado com sucesso!'
    msgerro.style.color = 'royalblue'
    msgerro.style.display = 'block'
    setTimeout(() => {
        msgerro.style.display = 'none'
        msgerro.innerText = 'É preciso preencher todos os campos para enviar!'
        msgerro.style.color = 'red'
    }, 5000);
    }
});

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

