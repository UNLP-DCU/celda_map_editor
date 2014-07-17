var Celda = function(id, columna, fila)
{
    this.id = id;
    this.columna = columna;
    this.fila = fila;
    this.tipo = "normal";

    this.esObstaculo = function(){
        return this.tipo === "obstaculo";
    };
    
    this.__proto__.typeOf = function(){
        if(this.esObstaculo())
            return 0;
        else
            return 1;
    };
    
    this.__proto__.valueOf = function(){
        if(this.esObstaculo())
            return 0;
        else
            return 1;
    };
};

var Mapa = function(largo, alto, tamanio_pasos)
{
    this.nombre = "Sin nombre";
    this.tamanio_pasos = tamanio_pasos;
    this.largo = largo;
    this.alto = alto;
    this.cant_celdas_largo = largo;
    this.cant_celdas_alto = alto;
    this.tamanio_lado = 32 * tamanio_pasos;
    this.espacio_entre_celdas = 2;
    this.color_propio = '#DDD';
    this.color_camino = '#7EE';
    this.color_obstaculo = '#E77';
    this.color_largada = '#8E7';
    this.color_llegada = '#87E';
    this.celda_largada = null;
    this.celda_llegada = null;
    this.celdas = new Array();
    this.camino = new Array();
    this.mode = null;
    this.orientacion_inicio = null;
    this.array_direcciones = "";
    this.array_transformado = "";
    this.array_obstaculos = "";

    this.crearCeldas = function(){
        var id = 0;
        for(i = 0; i < this.cant_celdas_alto; i++){
            this.celdas[i] = new Array();
            for(j = 0; j < this.cant_celdas_largo; j++){
                this.celdas[i][j] = new Celda(id++, j, i);
            }
        }
    }
    
    this.resetear = function(){
        for(i = 0; i < this.cant_celdas_alto; i++){
			this.celdas[i] = new Array();
            for(j = 0; j < this.cant_celdas_largo; j++){
                this.celdas[i][j] = null;
            }
        }
        this.celda_largada = this.celda_llegada = null;
        this.camino = new Array();
        this.orientacion_inicio = null;
        this.array_direcciones = "";
        this.array_transformado = "";
        this.array_obstaculos = "";
        this.crearCeldas();
        this.dibujarMapa();
    };
    
    this.cambiarLargo = function(largo){
        var largo_viejo = this.cant_celdas_largo;
        this.largo = largo;
        this.calcularMedidas();
        if(this.cant_celdas_largo < largo_viejo){ //Si saco columnas
            for(var i = 0; i < this.cant_celdas_alto; i++)
                for(var j = this.cant_celdas_largo; j > largo_viejo; j--)
                    this.celdas[i][j] = null;
        }else if(this.cant_celdas_largo > largo_viejo){ //Si agrego columnas
            for(var i = 0; i < this.cant_celdas_alto; i++)
                for(var j = largo_viejo; j < this.cant_celdas_largo; j++)
                    this.celdas[i][j] = new Celda(this.celdas[i][j - 1].id + this.cant_celdas_alto, j, i);
        }
        
        this.dibujarMapa();
    }
    
    this.cambiarAlto = function(alto){
        
        var alto_viejo = this.cant_celdas_alto;
        console.log("Alto viuejo: " + alto_viejo + " alto nuevo: " + alto);
        this.alto = alto;
        this.calcularMedidas();
        if(this.cant_celdas_alto > alto_viejo){ //Si agrego filas
            var id = this.celdas[alto_viejo - 1][this.cant_celdas_largo - 1].id;
            console.log("id: " + id);
            for(var i = alto_viejo; i < this.cant_celdas_alto; i++){
                this.celdas[i] = new Array();
                for(var j = 0; j < this.cant_celdas_largo; j++)
                    this.celdas[i][j] = new Celda(++id, j, i);
            }
        }else if(this.cant_celdas_alto < alto_viejo){ //Si saco filas
            for(var i = this.cant_celdas_alto; i < alto_viejo; i++)
                this.celdas[i] = null;
        }
        
        this.dibujarMapa();
    }
    
    this.cambiarTamanioPasos = function(tamanio){
        this.tamanio_pasos = tamanio;
        this.dibujarMapa();
    }
    
    this.calcularMedidas = function(){
        this.cant_celdas_alto = Math.ceil(this.alto / this.tamanio_pasos);
        this.cant_celdas_largo = Math.ceil(this.largo / this.tamanio_pasos);
        this.tamanio_lado = 32 * this.tamanio_pasos;
    }
    
    this.dibujarMapa = function(){
        this.calcularMedidas();
        jQuery("#mapa > canvas").remove();
        this.canvas = jQuery('<canvas width="' + this.cant_celdas_largo * (this.tamanio_lado + this.espacio_entre_celdas) + 'px" height="' + this.cant_celdas_alto * (this.tamanio_lado + this.espacio_entre_celdas) + 'px"></canvas>');
        this.context = this.canvas[0].getContext('2d');
        this.canvas.appendTo(jQuery('#mapa'));
        for(i = 0; i < this.cant_celdas_alto; i++){
            for(j = 0; j < this.cant_celdas_largo; j++){
                this.dibujarCelda(this.celdas[i][j]);
            }
        }
        
        // CONTROLA EL EVENTO DE CLICK EN EL CANVAS
        this.canvas.on('click', function(event)
        {
          celda = mapa.getCeldaPorPosicion(event.offsetX, event.offsetY);

              if (mapa.getMode() == "end") {
                    mapa.definirLlegada(celda)
                    return;
              }
              if (mapa.getMode() == "start") {
                    mapa.definirLargada(celda);
                    return;
              }
              if (mapa.getMode() == "manual") {
                    aMap.selectManualCell(aCell.id);	
                    return;
              }
              if (mapa.getMode() == "obstacles") {
                    mapa.agregarObstaculo(celda);
                    return;
              }	 

        });
    };
    
    this.toString = function(){
        var ret = "";
        
        for(i = 0; i < this.cant_celdas_alto; i++){
            ret += "[ ";
            for(j = 0; j < this.cant_celdas_largo; j++){
                if(this.celdas[i][j].esObstaculo())
                    ret += "0 ";
                else
                    ret += "1 ";
            }
            ret += "],\n";
        }
        
        return ret.slice(0, -2);
    }
    
    
    this.grafoAdaptado = function(){
        var ret = new Array();
        
        for(i = 0; i < this.cant_celdas_alto; i++){
            var fila = new Array();
            for(j = 0; j < this.cant_celdas_largo; j++){
                if(this.celdas[i][j].esObstaculo())
                    fila.push(0);
                else
                    fila.push(1);
            }
            ret.push(fila);
        }
        
        return ret;
    }
    
    this.resolver = function(){
        var graphDiagonal = new Graph(this.grafoAdaptado(), { diagonal: false });
        var start = graphDiagonal.grid[this.celda_largada.fila][this.celda_largada.columna];
        var end = graphDiagonal.grid[this.celda_llegada.fila][this.celda_llegada.columna];
        var resultWithDiagonals = astar.search(graphDiagonal, start, end);
        
        this.camino.push(this.celda_largada);
        for(var i = 0; i < resultWithDiagonals.length - 1; i++){
            this.celdas[resultWithDiagonals[i].x][resultWithDiagonals[i].y].tipo = "camino";
            this.dibujarCelda(this.celdas[resultWithDiagonals[i].x][resultWithDiagonals[i].y]);
            this.camino.push(this.celdas[resultWithDiagonals[i].x][resultWithDiagonals[i].y]);
        }
        
        return resultWithDiagonals;
    }
    
    this.dibujarCelda = function(celda){
        
        switch (celda.tipo) {
            case "normal":
                this.context.fillStyle = this.color_propio;
                break;
            case "largada":
                this.context.fillStyle = this.color_largada;
                break;
            case "llegada":
                this.context.fillStyle = this.color_llegada;
                break;
            case "obstaculo":
                this.context.fillStyle = this.color_obstaculo;
                break;
            case "camino":
                this.context.fillStyle = this.color_camino;
                break;
        }
        
        var desplazamiento_x = (this.tamanio_lado + this.espacio_entre_celdas) * celda.columna;
        var desplazamiento_y = (this.tamanio_lado + this.espacio_entre_celdas) * celda.fila;

        this.context.fillRect(desplazamiento_x, desplazamiento_y, this.tamanio_lado, this.tamanio_lado);
    }

    this.getCeldaPorPosicion = function(x, y)
    {
        return this.celdas[Math.floor(y / (this.espacio_entre_celdas + this.tamanio_lado))][Math.floor(x/(this.espacio_entre_celdas + this.tamanio_lado))];
    };

    this.definirLargada = function(celda)
    {
        celda.tipo = "largada";
        if (this.celda_largada !== null)
        {
            this.deseleccionar(this.celda_largada);
        }
        this.celda_largada = celda;
        this.dibujarCelda(celda);
    };

    this.definirLlegada = function(celda)
    {
        celda.tipo = "llegada";
        if (this.celda_llegada !== null)
        {
            this.deseleccionar(this.celda_llegada);
        }
        this.celda_llegada = celda;
        this.dibujarCelda(celda);
    };

    this.agregarObstaculo = function(celda)
    {
        celda.tipo = "obstaculo";
        this.dibujarCelda(celda);
    };

    this.deseleccionar = function(celda)
    {
        celda.tipo = "normal";
        this.dibujarCelda(celda);
    };

    this.getMode = function()
    {
            return this.mode;
    }

    this.setStart = function(){mapa.mode = "start";}
    this.setEnd = function(){mapa.mode = "end";}
    this.setObstacle = function(){mapa.mode = "obstacles";}

    this.procesarMetadatosCaminos = function () {

        if (this.camino !== null) {
            
            this.array_direcciones = new Array();
            this.array_transformado = new Array();
            this.array_obstaculos = new Array();
            
            for (i = 0; i < this.camino.length - 1; i++) {
                if (this.camino[i].fila < this.camino[i + 1].fila)
                    this.array_direcciones.push(2);
                if (this.camino[i].fila > this.camino[i + 1].fila)
                    this.array_direcciones.push(4);
                if (this.camino[i].columna < this.camino[i + 1].columna)
                    this.array_direcciones.push(1);
                if (this.camino[i].columna > this.camino[i + 1].columna)
                    this.array_direcciones.push(3);
            }

            this.array_transformado.push(this.array_direcciones[0]);

            for (i = 0; i < this.array_direcciones.length - 1; i++) {
                ok = true;
                if (this.array_direcciones[i] == 1)
                    switch (this.array_direcciones[i + 1]) {
                        case 2:
                            this.array_transformado.push(10);
                            break;
                        case 4:
                            this.array_transformado.push(5);
                            break;
                        default:
                            ok = false;
                    }
                else if (this.array_direcciones[i] == 2)
                    switch (this.array_direcciones[i + 1]) {
                        case 1:
                            this.array_transformado.push(7);
                            break;
                        case 3:
                            this.array_transformado.push(12);
                            break;
                        default:
                            ok = false;
                    }
                else if (this.array_direcciones[i] == 3)
                    switch (this.array_direcciones[i + 1]) {
                        case 2:
                            this.array_transformado.push(9);
                            break;
                        case 4:
                            this.array_transformado.push(6);
                            break;
                        default:
                            ok = false;
                    }
                else if (this.array_direcciones[i] == 4)
                    switch (this.array_direcciones[i + 1]) {
                        case 1:
                            this.array_transformado.push(8);
                            break;
                        case 3:
                            this.array_transformado.push(11);
                            break;
                        default:
                            ok = false;
                    }
                if (!ok) {
                    this.array_transformado.push(this.array_direcciones[i]);
                }
            }
            this.array_transformado.push(this.array_direcciones[this.array_direcciones.length - 1]);
            
        
            for(i = 0; i < this.cant_celdas_alto; i++){
                for(j = 0; j < this.cant_celdas_largo; j++){
                    if(this.celdas[i][j].esObstaculo()){
                        this.array_obstaculos.push(new Array(this.celdas[i][j].fila, this.celdas[i][j].columna));
                    }
                }
            }
            
            this.orientacion_inicio = this.array_direcciones[0];

        }
    }
    
    //ponele que el constructor...
    this.calcularMedidas();
    this.crearCeldas();
    this.dibujarMapa();
};
    
jQuery(document).ready(function(){
    
    mapa = new Mapa(jQuery("#largo").val(), jQuery("#alto").val(), jQuery("#tamanio_pasos").val());
});

var mapa;
/*
var peer2 = new Peer('celda_map_editor_peer_789', {key: 'ino3l998li60f6r', debug: 3});
    
//peer2 esta esperando que le manden algo.
//una peticion por ejemplo como un servidorcito 
peer2.on('connection', function(conn) {	  
  conn.on('data', function(data){		
        // Peer2 imprime lo q le envia peer
        console.log(data);
        //y manda un mensaje diferente, que serian los mapas
        conn.send("Qué querés? pan? \n El mapa te lo mando yo, wachín.");
  });
});

peer2.on('error', function(err) {
    peer2.destroy();
    alert("ERRORES EN PEER, se rompió todo. ABORTEN ABORTEEEEEEEEEEEEEEEEEENNNNNNNNNN"); 
});
*/
var peer2;
var errores = false;
function mandar_mapa(){
	
	//cuando se producen errores se llama a disconnect y el peer se destruye
	//es necesario re-crearlo para que funcionen las conexiones despues del disconnect
	if(peer2 == null || errores){
		peer2 = new Peer('celda_map_editor_peer258', {key: 'ino3l998li60f6r', debug: 3});
	}
	   	
    connection = peer2.connect('celda_app_peer654');
	
	peer2.on('error', function(err) { errores=true; peer2.destroy(); console.log("ERRORES EN PEER"); });
		
	connection.on('open', function(){
	
		mapa.procesarMetadatosCaminos();
		errores = false;
		
		//Este es el molde de json para la app
		//pisariamos los valores con los q queremos mandar
		var MAPAS = {
			"cantMapas":1,
			"mapas": [
			{
				"nombre":"Enviado",
				"alto":99,
				"ancho":99,
				"orientacion_inicio":1,			
				"recorrido": [1,1,1,10,7,1,1,1,1,1,10,2,2,2,2,2,2,2,2,2,7,1,1],
					"obstaculos": [[4,0], [7,5], [1,5], [0,6]],
					"inicioFila": 3,
					"inicioColumna": 1,
					"finFila": 11,
					"finColumna": 2
			}]
		};
		
		MAPAS.mapas[0].nombre = mapa.nombre;		
		MAPAS.mapas[0].alto = mapa.cant_celdas_alto;		
		MAPAS.mapas[0].ancho = mapa.cant_celdas_largo;		
		MAPAS.mapas[0].orientacion_inicio = mapa.orientacion_inicio;
				
		MAPAS.mapas[0].inicioFila = mapa.celda_largada.fila;
		MAPAS.mapas[0].inicioColumna = mapa.celda_largada.columna;		
		MAPAS.mapas[0].finFila = mapa.celda_llegada.fila;
		MAPAS.mapas[0].finColumna = mapa.celda_llegada.columna;
		
		//output.push(mapa.array_direcciones);
		//MAPAS.mapas[0].recorrido = mapa.array_direcciones;		
		MAPAS.mapas[0].recorrido = mapa.array_transformado;
				
		MAPAS.mapas[0].obstaculos = mapa.array_obstaculos;
		
		console.log(JSON.stringify(MAPAS));    
        //console.log("Output PeerJS:" + JSON.stringify(output));
        
		connection.send(MAPAS);		
    });
}

/* ToDo - BEGIN
 
 last update: 2014-07-10
 
 - Permitir borrar bloqueos.
 
 ToDo - END */
