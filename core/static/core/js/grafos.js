const padre = document.querySelector("#nArista");
const arista = document.querySelector("#arista");
const vertices = document.querySelector("#vertices");
const inputArista = document.querySelector("#inputArista").addEventListener("click",IngresarAristas);
    
var select = document.getElementById("tipoGrafo");
select.addEventListener('change',tipoGrafo);
    
function tipoGrafo(){
    var selectedOption = this.options[select.selectedIndex];
    console.log(selectedOption.value);
    };
    
    
function IngresarAristas(){
    document.querySelector("#inputArista").removeEventListener("click",IngresarAristas);
    const textArista = document.createElement('div');
    textArista.className="col-8";
    textArista.innerHTML="Aristas";
    padre.appendChild(textArista);
    console.log(vertices.value); //print vertices!!
    for(let i=1 ; i<vertices.value ; i++){
        const div = document.createElement('div');
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        const label = document.createElement('label');
        const input = document.createElement('input');
        const quit = document.createElement('button');
        div.className="row my-1";
        div1.className="col-6 d-flex justify-content-end";
        label.className="pt-2";
        quit.className = 'btn btn-danger mx-1.8';
        quit.innerText = '-';
        quit.id=`btnQuit_e${i}`;
        //label.textContent=`Arista ${i}`;
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
        div.appendChild(quit);
        padre.appendChild(div);
    }
}
/*
var id_botones = document.getElementsByClassName("btn btn-danger mx-1.8");
console.log(id_botones);
id_botones.onclick = function(){
 }

*/

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



