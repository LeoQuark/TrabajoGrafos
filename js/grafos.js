$( document ).ready(function(){

    $('#inputArista').click(function(e){
        e.preventDefault();
        var bloque_padre = '<div class="row mx-2" id="nArista"></div>';
        for(let i=1 ; i<$('#vertices').val() ; i++){
            if($('#tipoGrafo').val() == 'Etiquetado' ){
                var bloque_hijo = `<div class="col-4 my-2">Arista e${i}</div><div class="col-4"><input type="text" class="form-control" placeholder="formato: V A" name="arista${i}" id="arista_e${i}"></div><div class="col-2"><input class="form-control" placeholder="peso" id="peso_e${i}"></div><div class="col-2"><button class="btn btn-danger" id="delete_e${i}">x</button></div>`;
                $('#nArista').append(bloque_hijo);
            }else{
                var bloque_hijo = `<div class="col-4 my-2">Arista e${i}</div><div class="col-6"><input type="text" class="form-control" placeholder="formato: V A" name="arista${i}" id="arista_e${i}"></div><div class="col-2"><button class="btn btn-danger" id="delete_e${i}">x</button></div>`;
                $('#nArista').append(bloque_hijo);
            }
        }
        $('#listadoAristas').append(bloque_padre); 
    });

    

    const listaAristas=[];
    const listaPesos=[];

    $('#inputGrafo').click(function(e){
        e.preventDefault();
        for(let i=1 ; i<$('#vertices').val(); i++){
            const valor = $(`#arista_e${i}`).val();
            const valorPeso = $(`#peso_e${i}`).val();
            listaAristas.push(valor.toString().split(","));
            listaPesos.push(valorPeso);
        }
    });
    function crearGrafo(){
        const Grafo = {
            grafo : $('#tipoGrafo').val(),
            vertices : $('#vertices').val(),
            allAristas : listaAristas,
            peso: listaPesos
        }
    }
    

    
    

});