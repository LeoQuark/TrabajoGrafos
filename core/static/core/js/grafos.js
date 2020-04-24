const padre = document.querySelector("#nArista");
const numVertices = document.querySelector("#vertices");
const arista = document.querySelector("#arista");
const inputArista = document.querySelector("#inputArista").addEventListener("click",totalArista);
const tipoGrafo = document.querySelector("#tipoGrafo");

function totalArista(e){
    e.preventDefault();
    
    for(let i=1 ; i<=arista.value ; i++){
        const div = document.createElement('div');
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        const label = document.createElement('label');
        const input = document.createElement('input');
        div.className="d-flex";
        div1.className="col-8 d-flex justify-content-end";
        label.className="pt-2";
        label.textContent=`Arista e${i}`;
        div2.className="col-4";
        input.className="form-control mx-2";
        input.id=`vertice_e${i}`;
        // input.setAttribute("type","number");
        input.setAttribute("placeholder","ej: 2 4");
        // input.setAttribute("min","1");
        div1.appendChild(label);
        div2.appendChild(input);
        div.appendChild(div1);
        div.appendChild(div2);
        padre.appendChild(div);
    }
}

    

const grafo = document.querySelector("#inputGrafo");
grafo.addEventListener('click',validar);
const listaAristas=[];

function validar(e){
    e.preventDefault();
    for(let i=1 ; i<=arista.value ; i++){
        const valor = document.querySelector(`#vertice_e${i}`);
        listaAristas.push(valor.value.toString().split(","));
    }
    var Constuir = {
        grafo : tipoGrafo.value,
        vertices : numVertices.value,
        aristas : arista.value,
        allAristas : listaAristas
    }
    var json = JSON.stringify(Constuir);
    
}



