/*--------------------------------------------------------------------------------------------------------------*/
/*Variables a utilizar (Colocarlas juntos con las otras en archivo dibujar.js)*/

var vertices = [];
var aristas_from  = [];
var aristas_to = [];
var peso = [];
var a_desde = [];
var a_hacia = [];
var contador = 1;

/*------------------------------------------------------------------------------------------------------------------------*/
/* Funciones que manejan y re-estructuran los datos de los Grafos (para grafos etiquetados) */


//Función que convierte String a Integer (Necesario para el ordenamiento de los Pesos de las Aristas)
function stringAInt(){
  for (var i = 0; i < peso.length; i++ ){
    var aux = peso[i];
    aux = parseInt(peso[i], 10);
    peso[i] = aux;
  }
}

//Función que "ordena" las aristas (complementa a la función stringAInt)
function order(){
  for(var i = 0; i < peso.length ; i++){
    if (aristas_from[i] > aristas_to[i]){
      var aux = aristas_from[i];
      aristas_from[i] = aristas_to[i];
      aristas_to[i] = aux;
    }
  }
    /*console.log(aristas_from);
    console.log(aristas_to);
    console.log(peso);*/
}

//Función que ordena de manera ascendiente los pesos de las Aristas (necesita a la función stringAInt para un correcto desempeño)
function bubble(){
  var len = peso.length;    
  for (var i = 0; i < len ; i++) {
    for(var j = 0 ; j < len - i - 1; j++){
      if (peso[j] > peso[j + 1]){
        var temp = peso[j];
        var temp2 = aristas_from[j];
        var temp3 = aristas_to[j];
        peso[j] = peso[j+1];
        aristas_from[j] = aristas_from[j+1];
        aristas_to[j] = aristas_to[j+1];
        peso[j+1] = temp;
        aristas_from[j+1] = temp2;
        aristas_to[j+1] = temp3;
      }
    }
  }
    /*console.log(aristas_from);
    console.log(aristas_to);
    console.log(peso);*/
}

/*------------------------------------------------------------------------------------------------------------------*/
/* Función algoritmo Kruskal que modifica un Grafo Conexo Simple con Aristas de Peso 0 o Etiquetado a un Árbol Mínimo*/
function Kruskal (){
  var pesoMinimo = 0;
  stringAInt();
  order();
  bubble();
  for (var i = 0; i<peso.length;i++){   
  if ((a_desde.includes(aristas_to[i], 0) == false) && (a_hacia.includes(aristas_from[i], 0) == false)){
    if (aristas_from[i] != aristas_from[i+1]){
      a_desde.push(aristas_from[i]);
      a_hacia.push(aristas_to[i]);
      contador++;
      pesoMinimo=pesoMinimo+peso[i];
    }
  }else if((a_desde.includes(aristas_from[i], 0) == false) && (a_hacia.includes(aristas_to[i], 0) == false)){
    if (aristas_from[i] != aristas_from[i+1]){
      a_desde.push(aristas_from[i]);
      a_hacia.push(aristas_to[i]);
      contador++;
      pesoMinimo=pesoMinimo+peso[i];
    }
  }else if((a_hacia.includes(aristas_from[i], 0) == false) && (a_hacia.includes(aristas_to[i], 0) == false)){
    if (aristas_from[i] != aristas_from[i+1]){
      a_desde.push(aristas_from[i]);
      a_hacia.push(aristas_to[i]);
      contador++;
      pesoMinimo=pesoMinimo+peso[i];
    }
  }else if((a_desde.includes(aristas_from[i], 0) == false) && (a_desde.includes(aristas_to[i], 0) == false)){
    if (aristas_from[i] != aristas_from[i+1]){
      a_desde.push(aristas_from[i]);
      a_hacia.push(aristas_to[i]);
      contador++;
      pesoMinimo=pesoMinimo+peso[i];
    }
  }
    if (contador == vertices.length){
      break;
    }
  }
  console.log(a_desde);
  console.log(a_hacia);
  console.log(pesoMinimo);
}


function show(){
  Kruskal();
}