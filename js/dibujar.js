var nodes = null;
var edges = null;
var network = null;

var vertices = [];
var aristas_from  = [];
var aristas_to = [];
var peso = []
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
          var r = confirm("Do you want to connect the node to itself?");
          if (r != true) {
            callback(null);
            return;
          }
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
      document.getElementById('edge-label').value = data.label;
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
      peso.push(data.label);
      clearEdgePopUp();
      callback(data);
    }

    function init() {
      setDefaultLocale();
      draw();
    }

    //a. matriz de caminos y grafo conexa o no
    function buscar(columna,fila){
      for(let i=0; i<(aristas_from.length);i++){
        if(columna===aristas_from[i] && fila===aristas_to[i] || columna===aristas_to[i] && fila===aristas_from[i]){
          return 1;
        }
       }
    }
    var mAdyacencia = []; //filas
    function MatrizAdyacencia(mAdyacencia){
      
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
      // console.log(mAdyacencia);
      // MatrizCaminos(mAdyacencia);
      return mAdyacencia;
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
      if(cont===0){
        console.log("El grafo no es conexo");
      }
      else{
        console.log("El grafo es conexo");
      }
    }

    function MatrizCaminos(mAdyacencia){
      var mCaminos=[], mMultiplicada=[], mSuma=[]=mAdyacencia ,aux = mAdyacencia;
 
      for(let i=0; i<((vertices.length)-1);i++){
        multiplicarMatriz(mAdyacencia,aux,mMultiplicada);
      }
      sumarMatrices(mMultiplicada,mSuma,mCaminos);
      aux=mMultiplicada;
      // console.log(mCaminos);
      // Conexo(mCaminos);
      return mCaminos;
    }
    //Camino mas corto para dos nodos, mostrando la duracion y la ruta de dicho camino
    function CaminoCorto(){
      console.log("mmm")

    }

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

    function show(){
      // console.log(vertices);
      // console.log(aristas_from);
      // console.log(aristas_to);
      // console.log(peso)
      
      //dibuja la matriz de adyacencia
      const padreAdy= document.querySelector("#matrizAdy");
      var matriz = MatrizAdyacencia(mAdyacencia);
      padreAdy.appendChild(dibujarMAtriz(matriz));

      

    }
    function show2(){
      //dibuja la matriz de caminos
      const padreCam = document.querySelector("#matrizCam");
      var matriz_cam = MatrizCaminos(mAdyacencia);
      padreCam.appendChild(dibujarMAtriz(matriz_cam));
    }
    
    

    


