var nodes = null;
var edges = null;
var network = null;

var vertices = [];
var aristas_from  = [];
var aristas_to = [];
var peso = []
var mAdyacencia = []
var mCaminos = []
var a_desde = [];
var a_hacia = [];
var contador = 1;

// randomly create some nodes and edges
var data = getScaleFreeNetwork(25);
var seed = 2;
var defaultLocal = navigator.language;
var select = document.getElementById('locale');

function destroy() {
  if (network !== null) {
    network.destroy();
    network = null;
  }
}

function draw() {
  destroy();
  nodes = [];
  edges = [];
  // create a network
  var container = document.getElementById('resultado');
  var options = {
    layout: {randomSeed:seed}, // just to make sure the layout is the same when the locale is changed
    locale: document.getElementById('locale').value,
    manipulation: {
      addNode: function (data, callback) {
      // filling in the popup DOM elements
        document.getElementById('node-operation').innerHTML = "Agregar Vértice";
        editNode(data, clearNodePopUp, callback);
      },
      editNode: function (data, callback) {
        // filling in the popup DOM elements
        document.getElementById('node-operation').innerHTML = "Editar Vértice";
        editNode(data, cancelNodeEdit, callback);
      },
      addEdge: function (data, callback) {
        if (data.from == data.to) {
          var r = confirm(`
            ¿ Deseas conectar el vértice a sí mismo ? 
            pd: Crearás un bucle !
          `);
          if (r != true) {
            callback(null);
            return;
          }
        }
        var tipoGrafo = document.querySelector("#tipoGrafo").value;
        if(tipoGrafo === 'Dirigido'){
          var options = {
            edges:{
              arrows: 'to',
            }
          }
          network.setOptions(options);
        }
        document.getElementById('edge-operation').innerHTML = "Agregar Arista";
        editEdgeWithoutDrag(data, callback);
      },
      editEdge: {
        editWithoutDrag: function(data, callback) {
              document.getElementById('edge-operation').innerHTML = "Editar Arista";
              editEdgeWithoutDrag(data,callback);
            }
          }
          
        }
      };
      network = new vis.Network(container, data, options);
      
    }

    function editNode(data, cancelAction, callback) {
      document.getElementById('node-label').value = data.label;
      document.getElementById('node-saveButton').onclick = saveNodeData.bind(this, data, callback);
      document.getElementById('node-cancelButton').onclick = cancelAction.bind(this, callback);
      document.getElementById('node-popUp').style.display = 'block';
    }

    // Callback passed as parameter is ignored
    function clearNodePopUp() {
      document.getElementById('node-saveButton').onclick = null;
      document.getElementById('node-cancelButton').onclick = null;
      document.getElementById('node-popUp').style.display = 'none';
    }

    function cancelNodeEdit(callback) {
      clearNodePopUp();
      callback(null);
    }

    function saveNodeData(data, callback) {
      data.id = document.getElementById('node-id').value;
      data.label = document.getElementById('node-id').value;
      vertices.push(data.id);
      clearNodePopUp();
      callback(data);
    }

    function editEdgeWithoutDrag(data, callback) {
      // filling in the popup DOM elements
      // document.getElementById('edge-label').value = data.label;
      document.getElementById('edge-saveButton').onclick = saveEdgeData.bind(this, data, callback);
      document.getElementById('edge-cancelButton').onclick = cancelEdgeEdit.bind(this,callback);
      document.getElementById('edge-popUp').style.display = 'block';
    }

    function clearEdgePopUp() {
      document.getElementById('edge-saveButton').onclick = null;
      document.getElementById('edge-cancelButton').onclick = null;
      document.getElementById('edge-popUp').style.display = 'none';
    }

    function cancelEdgeEdit(callback) {
      clearEdgePopUp();
      callback(null);
    }

    function saveEdgeData(data, callback) {
      if (typeof data.to === 'object')
        data.to = data.to.id;
       
      if (typeof data.from === 'object')
        data.from = data.from.id;
  
      data.label = document.getElementById('edge-label').value;
      aristas_from.push(data.from);
      aristas_to.push(data.to);
      // peso.push(data.label);
      var aux=[];
      aux.push(data.from , data.to , data.label);
      peso.push(aux);
      clearEdgePopUp();
      callback(data);
    }

    function init() {
      setDefaultLocale();
      draw();
    }

    //a. matriz de caminos y grafo conexa o no
    function buscar(columna,fila){
      var tipoGrafo = document.querySelector("#tipoGrafo").value;
      for(let i=0; i<(aristas_from.length);i++){
        if(tipoGrafo === 'Dirigido'){
          if(columna===aristas_from[i] && fila===aristas_to[i])
              return 1;
        }else{
          if(columna===aristas_from[i] && fila===aristas_to[i] || columna===aristas_to[i] &&  fila===aristas_from[i])
            return 1;
        }
        }
    }
  
    function MatrizAdyacencia(){
      var mAdyacencia = []
      var aux = []; // columnas
      for(let i=0; i<vertices.length;i++){
        for(let j=0; j<vertices.length;j++){
          if(buscar(vertices[i],vertices[j])===1){
            aux.push(1);
          }
          else{
            aux.push(0);
          }   
        }
        mAdyacencia[i]=aux;
        aux=[];
      }
      return mAdyacencia;
      // MatrizCaminos(mAdyacencia);
    }

    function multiplicarMatriz(matriz1, matriz2,matrizF){
      var suma=0, maux = []; //
      for(let i=0; i<vertices.length;i++){ //avanza por las filas de la matriz1
        for(let j=0; j<vertices.length;j++){ //avanza por las columnas de las matriz2
          for(let k=0; k<vertices.length;k++){ 
              suma+=matriz1[i][k] * matriz2[j][k];
          }
        maux.push(suma);
        suma=0;
        }
      matrizF[i]=maux;
      maux=[];
      }
    }

    function sumarMatrices(matriz1, matriz2, matrizF){
      var maux=[];
      for(let i=0; i<vertices.length;i++){
        for(let j=0; j<vertices.length;j++){
          maux.push(matriz1[i][j]+matriz2[i][j]);
        }
        matrizF[i]=maux;
        maux=[];
      }
    }

    function Conexo(matriz){
      var  cont=0;
      for(let i=0; i<vertices.length;i++){
        for(let j=0; j<vertices.length;j++){
          if(matriz[i][j]===0){
            cont++;
          }
        } 
      }
      if(cont===0)
        return true;
      else
        return false;
    }

    function MatrizCaminos(mAdyacencia){
      var mCaminos = [], mMultiplicada=[], mSuma=[]=mAdyacencia ,aux = mAdyacencia;
      for(let i=0; i<((vertices.length)-1);i++){
        multiplicarMatriz(mAdyacencia,aux,mMultiplicada);
      }
      sumarMatrices(mMultiplicada,mSuma,mCaminos);
      aux=mMultiplicada;
      // Conexo(mCaminos);
      return mCaminos;
    }

    //// EULERIANO ////
    function gradopar(matriz,vertices){  //debe ser conexo 
      var par=0;                                 // todas las aristas de grado par
      for(let i=0; i<vertices.length;i++){
        for(let j=0; j<vertices.length;j++){
        var suma= suma + matriz[i][j];
        if (suma%2 == 0){
          par++;}
        }}
        console.log(suma);
      if (par===matriz.length)
        return true;
      else
        return false;
    }

    function euleriano(Conexo, gradopar){
      if (Conexo===true && gradopar===true ){
        return true;
      }
      else
        return false;
    }
    /*
    function camino_euleriano(euleriano){
      if(euleriano == true){
      var camino = []
        for(let i=0; i<vertices.length;i++){
          for(let j=0; j<vertices.length;j++){
            while(buscar(vertices[i],vertices[j])===1){
              camino.push(vertices[i]);}
            j
          }
      }}
      }
    */
      //// HAMILTONIANO ////
      
    function grado(mAdyacencia){ ///mostrará los grados de cada arista
      var listagrado = [];
      for(let i=0; i<vertices.length;i++){
        for(let j=0; j<vertices.length;j++){
        var suma=0;  
        var suma= suma + arista[i];
        listagrado.push(suma);
        } 
        }
      return listagrado;
    }
    function dirac(vertices, listagrado){ // para que se cumpla, deben haber mas de 3 vertices
      var b=0;                            // el grado de todos los vertices debe ser >= (n/2) 
      if(vertices.length>=3){
        for(let i=0;i<listagrado.length; i++){
          if(listagrado[i] < (vertice/2))
            return 0;
          else
            b++;
          }}
      else
        return 0;    
    }
    function ore(listagrado,vertice){   ///sumar vertices adyacentes y que el resultado sea >= n
      if(vertices>=3){
        if((listagrado[0]+listagrado[2] )>= (vertice/2))
          return 0; 
        else  
          return 1;
        }      
    }

    function grado_uno(listagrado){
        for(let i=0;i<listagrado.length;i++){
          if(listagrado[i]===1)
          return 0
        }
    }
    function hamiltoniano(dirac,ore, conexo, ){    // si se cumple ore o dirac es hamiltoniano 
      if (conexo===true && dirac==0 ||conexo===true && ore==0 ){   // vertices tiene que tener grado mayor a 1
        console.log("Si es Hamiltoniano");
        return true;
        }
      else{
        console.log("No es Hamiltoniano");
        return false; }

    }

          //FIN




    

    /*---------------------------------------------------------------------------------------------------
                                    Funciones para el item de flujo maximo
    -----------------------------------------------------------------------------------------------------
     */
    function buscarPeso(columna,fila){
      for(let i=0; i<aristas_from.length ;i++){
        if(columna===aristas_from[i] && fila===aristas_to[i])
          return peso[i];
      }
    }

    function MatrizDePeso(){ 
      var mPeso = [];
      var aux = []; // columnas
      for(let i=0; i<vertices.length;i++){
        for(let j=0; j<vertices.length;j++){
          if(buscar(vertices[i],vertices[j])===1){
            aux.push(buscarPeso(vertices[i],vertices[j]));
          }
          else{
            aux.push(0);
          }    
        }
        mPeso[i]=aux;
        aux=[];
      }
      return mPeso;
    }

    function bfs(matrizR,s,t,parent){
      var visitado = [],cola = [];
      //arreglo que marca si todos los vértices son o no visitados
      for(let i=0; i<vertices.length ; i++){
        visitado[i]=false;
      }
      //la "cola" almacena el vertice de origen y si es visitado o no
      cola.push(s);
      visitado[s]=true;
      parent[s]= -1;
      //algoritmo "Breadth-first search"
      while(cola.length != 0){
        var aux = cola.shift();
        for(let i=0; i<vertices.length; i++){
          if(visitado[i]==false && matrizR[aux][i]>0){
            cola.push(i);
            parent[i]=aux;
            visitado[i]=true;
          }
        }
      }
      //true si el vertice destino es encontrado
      return (visitado[t] == true);
      
    }

    //algoritmo FordFulkerson, retorna el flujo maximo
    function algoritmoFlujoMaximo(matriz,s,t){
      var matrizResidual=matriz;
      console.log(matrizResidual);
      //arreglo que almacena las rutas
      var parent = new Array(vertices.length);
      var flujo=0 , aux ,v;
    
      //aumentar el flujo mientras exista un camino
      while(bfs(matrizResidual,s,t,parent)){
        //encuentra la capacidad minima residual de las aristas
        var flujoMax = Number.MAX_VALUE;
        for(var v=t; v!=s; v = parent[v]){
          aux = parent[v];
          flujoMax = Math.min(flujoMax, matrizResidual[aux][v]);
        }
        //actualiza la capacidad residual de las aristas 
        for(v=t; v!=s; v=parent[v]){
          aux = parent[v];
          matrizResidual[aux][v] -= flujoMax;
          matrizResidual[v][aux] += flujoMax;
        }
        console.log(parent);
        flujo += flujoMax;
      }
      return flujo;
    }

    /*---------------------------------------------------------------------------------------------------
                                    funciones para el arbol generador minimo (prim o kruskal)
    -----------------------------------------------------------------------------------------------------
     */
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
      // console.log(a_desde);
      // console.log(a_hacia);
      // console.log(pesoMinimo);
    }

    
    /*---------------------------------------------------------------------------------------------------
                                    Funcion quue dibuja matrices
    -----------------------------------------------------------------------------------------------------
     */
    
    function dibujarMAtriz(matriz){
      //creo los elementos y llamo a la tabla del html
      var tabla_padre = document.createElement('table');
      var fila = document.createElement('tr');
      var primero = document.createElement('td');
      primero.textContent = "-";
      primero.style.backgroundColor="#cfd8dc";
      primero.style.textAlign="center";
      primero.style.width="40px";
      primero.style.height="40px";
      fila.appendChild(primero);
      //for para agregar los valores de la primera fila
      for(let i=0 ; i<vertices.length; i++){
        var p_fila = document.createElement('td');
        p_fila.style.width="40px";
        p_fila.style.height="40px";
        p_fila.style.textAlign="center";
        p_fila.style.backgroundColor="#cfd8dc";
        p_fila.textContent = vertices[i];
        fila.appendChild(p_fila);
      }
      tabla_padre.appendChild(fila);

      for(let k=0; k<matriz.length ;k++){
        //se agrega el nombre de los vertices (en la primera columna)
        var o_filas = document.createElement('tr');
        var nombre = document.createElement('td');
        nombre.style.width="40px";
        nombre.style.height="40px";
        nombre.style.backgroundColor="#cfd8dc";
        nombre.style.textAlign="center";
        nombre.textContent = vertices[k];
        o_filas.appendChild(nombre);

        for(let j=0; j<matriz.length ;j++){
          //se agregan los datos contenidos en la matriz
          var datos = document.createElement('td');
          datos.style.width="40px";
          datos.style.height="40px";
          datos.style.textAlign="center";
          datos.textContent = matriz[k][j];
          o_filas.appendChild(datos); 
        }
        tabla_padre.appendChild(o_filas);
      }
      return tabla_padre;
    }


    /*---------------------------------------------------------------------------------------------------
                                    funciones para el item 2
    -----------------------------------------------------------------------------------------------------
     */

    function item_MatrizCamino(){
      const boton = document.querySelector("#item1");
      //dibuja la matriz de adyacencia
      const padreAdy= document.querySelector("#matrizAdy");
      var matriz = MatrizAdyacencia();
      padreAdy.appendChild(dibujarMAtriz(matriz));
      //dibuja la matriz de caminos
      var MAdyacencia= MatrizAdyacencia()
      const padreCam = document.querySelector("#matrizCam");
      matriz_c = MatrizCaminos(MAdyacencia, mCaminos);
      padreCam.appendChild(dibujarMAtriz(matriz_c));
      //es o no conexo
      const esConexo = document.querySelector("#esConexo");
      var es_conexo = Conexo(matriz_c);
      if(es_conexo)
        esConexo.textContent = "es Conexo";
      else
        esConexo.textContent = "no es Conexo";
      boton.disabled= true;
    }



    function item_CaminoCorto(){
      //llamo a los input de entrada y salida
      const entrada_cc = document.querySelector("#inputEntrada");
      const salida_cc = document.querySelector("#inputSalida");

    }

    function item_euleriano(){
      const boton = document.querySelector("#item3");
      const esEu = document.querySelector("#esEu");
      var eu = euleriano(Conexo,gradopar);
      if(eu)
        esEu.textContent = "Es Euleriano";
      else
        esEu.textContent = "No es Euleriano";
      //Hamiltoniano
      const esHam = document.querySelector("#esHam");
      var ham = hamiltoniano(dirac,ore,Conexo);
      if(ham)
        esHam.textContent = "Es Hamiltoniano";
      else
        esHam.textContent = "No es Hamiltoniano";

    }

    

    function item_FlujoMaximo(){
      //llamo a los input de entrada y salida
      const boton4 = document.querySelector("#item4");
      const entrada = document.querySelector("#fm_Entrada").value;
      const salida = document.querySelector("#fm_Salida").value;
      var s,t;
      s = vertices.indexOf(entrada);
      t = vertices.indexOf(salida);
      var matrizpeso = MatrizDePeso();
      var flujo_max = algoritmoFlujoMaximo(matrizpeso,s,t);
      const output = document.querySelector("#salida_FlujoMaximo");
      output.textContent = flujo_max;
      boton4.disabled=true;
    }

    function item_ArbolGenerado(){
      const boton5 = document.querySelector("#item5");
      var algoritmo_krukal = Kruskal();

      console.log(Kruskal());
    }
   

    

    
    

    
    
    
    

    


