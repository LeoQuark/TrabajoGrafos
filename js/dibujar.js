var nodes = null;
var edges = null;
var network = null;

var vertices = [];
var aristas_from  = [];
var aristas_to = [];
var peso = []
var mAdyacencia = []
var mCaminos = []

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

    function buscarPeso(columna,fila){
      for(let i=0; i<(aristas_from.length);i++){
        if(columna===aristas_from[i] && fila===aristas_to[i]){
          return 1;
        }
       }
    }

    function MatrizDePeso(){ 
      var mPeso = [] ;
      var aux = []; // columnas
      for(let i=0; i<vertices.length;i++){
        for(let j=0; j<vertices.length;j++){
          if(buscarPeso(vertices[i],vertices[j])===1){
            aux.push( peso[j][2] );
          }
          else{
            aux.push(0);
          }    
        }
        mPeso[i]=aux;
        aux=[];
      }
      return mPeso;
      // MatrizCaminos(mAdyacencia);
    }

    
    function item_FlujoMaximo(){
      //llamo a los input de entrada y salida
      const entrada = document.querySelector("#fm_Entrada").value;
      const salida = document.querySelector("#fm_Salida").value;
      var mAdyacencia = MatrizAdyacencia();
      var p_inicial = peso , capacidad = [] , aristas = [] , aux = [];
      var grafo_aux = {};
      for(let i=0 ; i<p_inicial.length ; i++){
        capacidad[i]=0;
        aux.push(aristas_to[i]);
        aux.push(aristas_from[i]);
        aristas.push(aux);
      }
      var matrizpeso = MatrizDePeso();
      console.log(peso);
      console.log(matrizpeso);  
    }

    
    
    
    

    


