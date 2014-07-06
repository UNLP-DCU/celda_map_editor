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

var Mapa = function()
{
    this.cant_celdas_largo = 10;
    this.cant_celdas_alto = 10;
    this.tamanio_lado = 25;
    this.espacio_entre_celdas = 2;
    this.color_propio = '#DDD';
    this.color_camino = '#7EE';
    this.color_obstaculo = '#E77';
    this.color_largada = '#8E7';
    this.color_llegada = '#87E';
    this.celda_largada = null;
    this.celda_llegada = null;
    this.celdas = new Array();
    this.intervalo_dibujo_path = 200;
    this.camino = new Array();

    this.canvas = jQuery('<canvas width="' + this.cant_celdas_largo * (this.tamanio_lado + this.espacio_entre_celdas) + 'px" height="' + this.cant_celdas_alto * (this.tamanio_lado + this.espacio_entre_celdas) + 'px"></canvas>');
    this.context = this.canvas[0].getContext('2d');
    
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
        var graphDiagonal = new Graph(this.grafoAdaptado(), { diagonal: true });
        var start = graphDiagonal.grid[this.celda_largada.fila][this.celda_largada.columna];
        var end = graphDiagonal.grid[this.celda_llegada.fila][this.celda_llegada.columna];
        var resultWithDiagonals = astar.search(graphDiagonal, start, end);
        
        for(var i = 0; i < resultWithDiagonals.length; i++){
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
    
    this.resetear = function(){
        this.celda_largada = this.celda_llegada = null;
        for(i = 0; i < this.cant_celdas_alto; i++){
            for(j = 0; j < this.cant_celdas_largo; j++){
                this.celdas[i][j].tipo = "normal";
                this.dibujarCelda(this.celdas[i][j]);
            }
        }
        this.camino = new Array();
    };
    
    this.dibujarMapa = function(){
        var id = 0;
        for(i = 0; i < this.cant_celdas_alto; i++){
            this.celdas[i] = new Array();
            for(j = 0; j < this.cant_celdas_largo; j++){
                this.celdas[i][j] = new Celda(id++, j, i);
                this.dibujarCelda(this.celdas[i][j]);
            }
        }
    };

    this.getCeldaPorPosicion = function(x, y)
    {
        return this.celdas[Math.floor(y / (this.espacio_entre_celdas + this.tamanio_lado))][Math.floor(x / (this.espacio_entre_celdas + this.tamanio_lado))];
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

    this.escribirJSON = function(container)
    {
        var path;
        var myJsonString;
        var pathJSON = new Array();
        var newArray = new Array();

        if (path === null)
            path = this.resolve();

        for (i = 0; i < path.length - 1; i++) {
            if (path[i].row < path[i + 1].row)
                newArray.push(2);
            if (path[i].row > path[i + 1].row)
                newArray.push(4);
            if (path[i].column < path[i + 1].column)
                newArray.push(1);
            if (path[i].column > path[i + 1].column)
                newArray.push(3);
            pathJSON.push(path[i].id);
        }
        myJsonString = JSON.parse(JSON.stringify(pathJSON));
        console.log("Array por id");
        console.log(myJsonString);
        console.log("Array transformado");
        console.log(newArray);
        
    };

    this.canvas.on('click', function(event) {

        if (event.button === 2) { //si es el click derecho
            celda = mapa.getCeldaPorPosicion(event.offsetX, event.offsetY);
            mapa.borrarCelda(celda.id);
        } else {
            if (event.altKey) {

                celda = mapa.getCeldaPorPosicion(event.offsetX, event.offsetY);
                mapa.definirLlegada(celda);

            } else if (event.ctrlKey) {

                celda = mapa.getCeldaPorPosicion(event.offsetX, event.offsetY);
                mapa.definirLargada(celda);

            } else if (event.shiftKey) {

                celda = mapa.getCeldaPorPosicion(event.offsetX, event.offsetY);
                mapa.agregarObstaculo(celda);

            }
            ;
        }
    });

    //desactivar menu contextual al hacer click derecho sobre el mapa
    this.canvas.on('contextmenu', function(event) {
        return false;
    });

    this.canvas.on('dblclick', function(event) {
        celda = mapa.getCeldaPorPosicion(event.offsetX, event.offsetY);
        mapa.definirLlegada(celda)
    });

    this.canvas.on('mousemove', function(event)
    {
        if (event.shiftKey)
        {
            celda = mapa.getCeldaPorPosicion(event.offsetX, event.offsetY);
            mapa.agregarObstaculo(celda);
        }
    });

    jQuery('body').keydown(function(event)
    {
        if (event.keyCode === 83)
        {
            result = mapa.resolve();
        }
    });
};

var mapa;

jQuery(document).ready(function()
{
    mapa = new Mapa();

    mapa.canvas.appendTo(jQuery('#mapa'));

    mapa.dibujarMapa();

});

/* ToDo - BEGIN
 
 last update: 2014-06-20
 
 - Permitir mapas rectangulares, hay un bug al generarlo.
    -> Ahora genera rectangulares, pero en rutas esquinadas no encuentra path.
 - Agregar costos a los movimientos, para que el recorrido sea el óptimo.
 - Permitir borrar bloqueos.
 - Agregar mayor autonomía a las celdas. <--- ¿¿¿¿ Qué significa esto ????
 
 ToDo - END */
