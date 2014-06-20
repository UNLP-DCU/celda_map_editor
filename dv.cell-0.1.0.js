var dvCell = function(id, x, y, map, tipo)
{
    this.id = id;
    this.side = map.cellSide;
    this.row = Math.floor(y / this.side);
    this.column = Math.floor(x / this.side);
    this.x = this.column * this.side;
    this.y = this.row * this.side;
    this.type = typeof tipo !== 'undefined' ? "normala" : tipo;

    this.draw = function()
    {
        switch (this.type) {
            case "normal":
                map.context.fillStyle = '#DDD';
                break;
            case "largada":
                map.context.fillStyle = '#8E7';
                break;
            case "llegada":
                map.context.fillStyle = '#87E';
                break;
            case "obstaculo":
                map.context.fillStyle = '#7EE';
                break;
        }

        map.context.fillRect(this.x + 1, this.y + 1, this.side - 2, this.side - 2);
    };
};

var dvMap = function()
{
    this.cant_celdas_largo = 10;
    this.cant_celdas_alto = 10;
    this.cellSide = 25;
    this.obstacles = null;
    this.startCell = null;
    this.endCell = null;
    this.intervalo_dibujo_path = 200;

    this.canvas = jQuery('<canvas width="' + this.cant_celdas_largo * this.cellSide + 'px" height="' + this.cant_celdas_alto * this.cellSide + 'px"></canvas>');
    this.context = this.canvas[0].getContext('2d');

    this.isObstacle = function(id)
    {
        return this.getObstacles()[id];
    };

    this.getObstacles = function()
    {
        if (this.obstacles === null)
        {
            this.obstacles = new Array();

            for (i = 0; i < this.countCells(); i++)
            {
                this.obstacles.push(false);
            }
        }

        return this.obstacles;
    };

    this.addObstacle = function(aCell)
    {
        this.getObstacles()[aCell.id] = true;

        this.obstacleMode();

        aCell.draw();
    };

    this.countCells = function()
    {
        return this.cant_celdas_largo * this.cant_celdas_alto;
    };

    this.width = function()
    {
        return this.cant_celdas_largo * this.cellSide;
    };

    this.height = function()
    {
        return this.cant_celdas_alto * this.cellSide;
    };

    this.drawMode = function()
    {
        this.context.fillStyle = '#dddddd';
    };

    this.selectStartCellMode = function()
    {
        this.context.fillStyle = '#88ee77';
    };

    this.selectEndCellMode = function()
    {
        this.context.fillStyle = '#8877ee';
    };

    this.resolveMode = function()
    {
        this.context.fillStyle = '#77ddee';
    };

    this.obstacleMode = function()
    {
        this.context.fillStyle = '#ee7777';
    };

    this.resolve = function()
    {
        if ((this.startCell === null) || (this.endCell === null))
        {
            return false;
        }

        this.resolveMode();
        queuedBy = this.buildPath(this.startCell, this.endCell);

        if (queuedBy[this.endCell.id] === -1)
        {
            alert('No path!');
        }
        else
        {
            path = new Array();

            cell = queuedBy[this.endCell.id];

            while (cell.id !== this.startCell.id)
            {
                path.push(cell);

                cell = queuedBy[cell.id];
            }

            path = path.reverse();

            i = 0;

            window.setInterval(function()
            {
                if (i < path.length)
                {
                    path[i].draw();

                    i++;
                }
                else
                {
                    window.setInterval(null);
                }
            }, this.intervalo_dibujo_path);
            return path;
        }
    };

    this.buildPath = function(startCell, endCell)
    {
        queue = new Array();
        visited = new Array();
        queuedBy = new Array();

        for (i = 0; i < this.countCells(); i++)
        {
            visited.push(false);
            queuedBy.push(-1);
        }

        queue.push(startCell);

        while (queue.length > 0)
        {
            cell = queue.shift();

            if (cell.id === endCell.id)
            {
                //console.log(queuedBy);
                return queuedBy;
            }

            neighbours = this.getNeighbours(cell);

            for (i = 0; i < neighbours.length; i++)
            {
                neighbour = neighbours[i];

                if (!visited[neighbour.id] && !this.isObstacle(neighbour.id))
                {
                    visited[neighbour.id] = true;

                    queuedBy[neighbour.id] = cell;

                    queue.push(neighbour);

                }
            }
        }

        return queuedBy;
    };

    this.getNeighbours = function(aCell)
    {
        aux = new Array();

        // Top-left
        //aux.push(this.getCellByRowCol(aCell.row - 1, aCell.column - 1));

        // Top
        aux.push(this.getCellByRowCol(aCell.row - 1, aCell.column));

        // Top-right
        //aux.push(this.getCellByRowCol(aCell.row - 1, aCell.column + 1));

        // Right
        aux.push(this.getCellByRowCol(aCell.row, aCell.column + 1));

        // Bottom-right
        //aux.push(this.getCellByRowCol(aCell.row + 1, aCell.column + 1));

        // Bottom
        aux.push(this.getCellByRowCol(aCell.row + 1, aCell.column));

        // Bottom-left
        //aux.push(this.getCellByRowCol(aCell.row + 1, aCell.column - 1));

        // Left
        aux.push(this.getCellByRowCol(aCell.row, aCell.column - 1));

        var neighbours = new Array();

        for (i = 0; i < aux.length; i++)
        {
            if (aux[i] !== null)
            {
                neighbours.push(aux[i]);
            }
        }

        return neighbours;
    };

    this.unselect = function(aCell)
    {
        this.drawMode();

        aCell.draw();
    };

    this.getCellById = function(id)
    {
        x = (id % this.cant_celdas_largo) * this.cellSide;
        //TODO Aca si cant_celdas_largo se cambia por cant_celdas_alto se genera el bug que fue corregido.
        y = Math.floor(id / this.cant_celdas_largo) * this.cellSide;
        //console.log("->" + x);
        return new dvCell(id, x, y, this);
    };

    this.getCellByPosition = function(x, y)
    {
        row = Math.floor(y / this.cellSide);
        column = Math.floor(x / this.cellSide);

        if ((column < 0) || (row < 0) || (column >= this.cant_celdas_largo) || (row >= this.cant_celdas_largo))
        {
            return null;
        }

        id = (row * this.cant_celdas_largo) + column;

        return new dvCell(id, column * this.cellSide, row * this.cellSide, this);
    };

    this.getCellByRowCol = function(row, column)
    {
        if ((row < 0) || (column < 0) || (row > (this.cant_celdas_largo - 1)) || (column > (this.cant_celdas_alto - 1)))
        {
            return null;
        }

        id = (row * this.cant_celdas_largo) + column;

        return new dvCell(id, column * this.cellSide, row * this.cellSide, this);
    };

    this.draw = function()
    {
        this.drawMode();

        for (i = 0; i < this.countCells(); i++)
        {
            this.getCellById(i).draw();
        }
    };

    this.selectStartCell = function(id)
    {
        if (this.startCell !== null)
        {
            this.unselect(this.startCell);
        }

        this.selectStartCellMode();

        this.startCell = this.getCellById(id);
        this.startCell.draw();
    };

    this.selectEndCell = function(id)
    {
        if (this.endCell !== null)
        {
            this.unselect(this.endCell);
        }

        this.selectEndCellMode();

        this.endCell = this.getCellById(id);
        this.endCell.draw();
    };

    this.selectObstacleCell = function(id)
    {
        this.addObstacle(aCell);
    };

    this.appendTo = function(container)
    {
        this.canvas.appendTo(container);

        resolveButton = jQuery('<div><button>Construir camino!</button></div>');
        var path;
        var myJsonString;
        var pathJSON = new Array();
        var newArray = new Array();
        resolveButton.on('click', function(event)
        {
            //Si ya construi un camino
            if (path != null) {
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
            }
            //Sino construyo el camino
            else {
                event.preventDefault();

                path = aMap.resolve();

            }
        });

        resolveButton.appendTo(container);

    };

    this.canvas.on('click', function(event) {

        if (event.button === 2) { //si es el click derecho
            aCell = aMap.getCellByPosition(event.offsetX, event.offsetY);
            aMap.borrarCelda(aCell.id);
        } else {
            if (event.altKey) {

                aCell = aMap.getCellByPosition(event.offsetX, event.offsetY);
                aMap.selectEndCell(aCell.id);

            } else if (event.ctrlKey) {

                aCell = aMap.getCellByPosition(event.offsetX, event.offsetY);
                aMap.selectStartCell(aCell.id);

            } else if (event.shiftKey) {

                aCell = aMap.getCellByPosition(event.offsetX, event.offsetY);
                aMap.selectObstacleCell(aCell.id);

            }
            ;
        }
    });

    //desactivar menu contextual al hacer click derecho sobre el mapa
    this.canvas.on('contextmenu', function(event) {
        return false;
    });

    this.canvas.on('dblclick', function(event) {
        aCell = aMap.getCellByPosition(event.offsetX, event.offsetY);
        aMap.selectEndCell(aCell.id);
    });

    this.canvas.on('mousemove', function(event)
    {
        if (event.shiftKey)
        {
            aCell = aMap.getCellByPosition(event.offsetX, event.offsetY);
            aMap.selectObstacleCell(aCell.id);
        }
    });

    jQuery('body').keydown(function(event)
    {
        if (event.keyCode === 83)
        {
            result = aMap.resolve();
        }
    });
};

var aMap;

jQuery(document).ready(function()
{
    aMap = new dvMap();

    aMap.appendTo(jQuery('#mapa'));

    aMap.draw();

});

/* ToDo - BEGIN
 
 last update: 2014-06-20
 
 - Permitir mapas rectangulares, hay un bug al generarlo.
 -> Ahora genera rectangulares, pero en rutas esquinadas no encuentra path.
 - Agregar costos a los movimientos, para que el recorrido sea el óptimo.
 - Permitir borrar bloqueos.
 - Agregar mayor autonomía a las celdas.
 
 ToDo - END */
