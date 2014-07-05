var aMap;
var dvCell = function(id, x, y, map)
{
	this.id = id;
	this.side = map.cellSide;
	this.row = Math.floor(y / this.side);
	this.column = Math.floor(x / this.side);
	this.x = this.column * this.side;
	this.y = this.row * this.side;

	this.draw = function()
	{
		map.context.fillRect(this.x + 1, this.y + 1, this.side - 2, this.side - 2);
	}
}

var dvMap = function()
{
	this.cellWidth = 10;
	this.cellHeight = 10;
	this.cellSide = 25;
	this.obstacles = null;
	this.startCell = null;
	this.endCell = null;	
	this.mode = null;
	this.mapCell = new Array();
	const countCells = this.cellWidth * this.cellHeight;
	const width = this.cellWidth * this.cellSide;
	const height = this.cellHeight * this.cellSide;
	const drawMode = '#dddddd';
	const selectStartCellMode = '#88ee77';
	const selectEndCellMode = '#8877ee';
	const resolveMode = '#77ddee';
	const obstacleMode = '#ee7777';

	// RESUELVE EL PATH
	this.resolve = function()
	{
		if ((this.startCell == null) || (this.endCell == null))
		{
			return false;
		}
		
		this.drawWithColour(resolveMode);

		queuedBy = this.buildPath(this.startCell, this.endCell);
	  
	  if (queuedBy[this.endCell.id] == -1)
	  {	
		  alert('No path!');
	  }
	  else
	  {
	    path = new Array();
	    
	    cell = queuedBy[this.endCell.id];
	    
	    while (cell.id != this.startCell.id)
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
	    }, 200); 		  
		return path;
	  }
	}
	
	this.buildPath = function(startCell, endCell)
	{
	  queue = new Array();
	  visited = new Array();
	  queuedBy = new Array();
	  
	  for (i = 0; i < countCells; i++)
	  {	
	    visited.push(false);
	    queuedBy.push(-1);
	  }

	  queue.push(startCell);
	  
	  while (queue.length > 0)
	  {
	    cell = queue.shift();
	    
	    if (cell.id == endCell.id)
	    {
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
	}
	
	this.getNeighbours = function(aCell)
	{
	  aux = new Array();
	  
	  // Top
	  aux.push(this.getCellByRowCol(aCell.row - 1, aCell.column));
	  
	  // Right
	  aux.push(this.getCellByRowCol(aCell.row, aCell.column + 1));
	  
	  // Bottom
	  aux.push(this.getCellByRowCol(aCell.row + 1, aCell.column));
	  
	  // Left
	  aux.push(this.getCellByRowCol(aCell.row, aCell.column - 1));
	  
	  var neighbours = new Array();
	  
	  for (i = 0; i < aux.length; i++)
	  {
	    if (aux[i] != null)
	    {
	      neighbours.push(aux[i]);
	    }
	  }

	  return neighbours;
	}
	
	this.unselect = function(aCell)
	{
		this.drawWithColour(drawMode);
		
		aCell.draw();
	}
	
	this.canvas = jQuery('<canvas width="' + width + 'px" height="' + height + 'px"></canvas>');
	this.context = this.canvas[0].getContext('2d');
	
	// DIBUJO EL MAPA
	this.draw = function()
	{
		this.drawWithColour(drawMode);
		for (i = 0; i < this.cellWidth ; i++){
			this.mapCell[i] = new Array(this.cellHeight);
		}
		for (i = 0; i < countCells ; i++){
			this.mapCell[i] = this.getCellById(i);
			this.mapCell[i].draw();
		}
	}

	// METODOS REFERIDOS A OBSTACULOS
	
	this.addObstacle = function(aCell)
	{
	  this.getObstacles()[aCell.id] = true;
	  
	  this.drawWithColour(obstacleMode);
	  
	  aCell.draw();
	}
	
	this.removeObstacle = function(aCell)
	{
	  this.getObstacles()[aCell.id] = false;

	  this.drawWithColour(drawMode);

	  aCell.draw();
	}
	
	this.drawWithColour = function(colour)
    {		
		this.context.fillStyle = colour;
	}

	// METODOS QUE PINTAN LAS CELDAS DE INICIO FIN Y OBSTACULOS
	this.selectStartCell = function(id)
	{
		if (this.startCell != null)
		{
			this.unselect(this.startCell);
		}
		
		this.drawWithColour(selectStartCellMode);
		this.startCell = this.mapCell[id];
		this.startCell.draw();
	}
	
	this.selectEndCell = function(id)
	{
		if (this.endCell != null)
		{
			this.unselect(this.endCell);
		}
				
		this.drawWithColour(selectEndCellMode);
		this.endCell = this.mapCell[id];	
		this.endCell.draw();
	}
	
	this.selectObstacleCell = function(id)
	{
		if (this.isObstacle(id))
		{
		    this.removeObstacle(aCell);
		} else {
			this.addObstacle(aCell);
		}
	}
	
	// ABRE TODOS LOS BOTONES NECESATRIOS
	this.appendTo = function(container)
	{
		this.canvas.appendTo(container);
		
		resolveButton = jQuery('<div><button>Construir camino!</button></div>');
		clearMap = jQuery('<div><button>Reiniciar mapa!</button></div>');
		startPoint = jQuery('<div><button>Marcar inicio</button></div>');
		endPoint = jQuery('<div><button>Marcar final!</button></div>');
		obstaclePoint = jQuery('<div><button>Colocar/Quitar obstaculo</button></div>');
		var path;
		var myJsonString;
		var pathJSON = new Array();
		var newArray = new Array();
		resolveButton.on('click', function(event)
		{
			//Si ya construi un camino
			if (path != null){
				for (i=0;i<path.length;i++)
					pathJSON.push(path[i].id)
				myJsonString = JSON.parse(JSON.stringify(pathJSON));		
				console.log("Array por id");
				console.log(myJsonString);
			}
			//Sino construyo el camino
			else {
				event.preventDefault();
				path = aMap.resolve();
			}
		});
		clearMap.on('click', function(event){
			path = null; queue = new Array(); visited = new Array();
			queuedBy = new Array(); pathJSON = new Array();
			newArray = new Array(); aMap.draw();
		});
		startPoint.on('click', function(event){aMap.mode = "start";});
		endPoint.on('click', function(event){aMap.mode = "end";});
		obstaclePoint.on('click', function(event){aMap.mode = "obstacles";});

		resolveButton.appendTo(container);
		clearMap.appendTo(container);
		startPoint.appendTo(container);
		endPoint.appendTo(container);
		obstaclePoint.appendTo(container);

	}

	// CONTROLA EL EVENTO DE CLICK EN EL CANVAS
	this.canvas.on('click', function(event)
	{
	  aCell = aMap.getCellByPosition(event.pageX, event.pageY);
	  	
	  if (aMap.getMode() == "end")
	  {
  		aMap.selectEndCell(aCell.id);
  		
  		return;
	  }
	  if (aMap.getMode() == "start")
	  {
		aMap.selectStartCell(aCell.id);	
  		
  		return;
	  }
	  if (aMap.getMode() == "obstacles")
	  {
  		aMap.selectObstacleCell(aCell.id);
  		
  		return;
	  }	 
	  
	});

	// HELPERS		
	this.getMode = function()
	{
		return this.mode;
	}

	this.isObstacle = function(id)
	{
	  return this.getObstacles()[id];
	}
	
	this.getObstacles = function()
	{	
	  if (this.obstacles == null)
	  {
	    this.obstacles = new Array();
	    
	    for (i = 0; i < countCells; i++)
	    {
	      this.obstacles.push(false);
	    }
	  }
	  return this.obstacles;
	}

	this.getCellById = function(id)
	{		
		x = (id % this.cellWidth) * this.cellSide;
		//TODO Aca si cellWidth se cambia por cellHeight se genera el bug que fue corregido.
		y = Math.floor(id / this.cellWidth) * this.cellSide;
		//console.log("->" + x);
		return new dvCell(id, x, y, this);
	}
	
	this.getCellByPosition = function(x, y)
	{	  
		row = Math.floor(y / this.cellSide);
		column = Math.floor(x / this.cellSide);
		
		if ((column < 0) || (row < 0) || (column >= this.cellWidth) || (row >= this.cellWidth)) {
		  return null;
		}		
		
		id = (row * this.cellWidth) + column;
		
		return this.mapCell[id];
	}
	
	this.getCellByRowCol = function(row, column)
	{
	  if ((row < 0) || (column < 0) || (row > (this.cellWidth - 1)) || (column > (this.cellHeight - 1))){
	    return null;
	  }
	  
		id = (row * this.cellWidth) + column;
		return this.mapCell[id];
	}
	
	jQuery('body').keydown(function(event)
	{	  
	  if (event.keyCode == 83)
	  {
		result = aMap.resolve();
	  }
	});
};

// INICIA EL MAPA
jQuery(document).ready(function()
{
	aMap = new dvMap();

	aMap.appendTo(jQuery('body'));

	aMap.draw();

});


/* ToDo - BEGIN

  last update: 20140604

- Permitir mapas rectangulares, hay un bug al generarlo.
	-> Ahora genera rectangulares, pero en rutas esquinadas no encuentra path.
- Acomodar la clase dvMap, quedó muy compleja.
- Tratar de sacar las variables globales, para que el código sea más independiente.
- Agregar costos a los movimientos, para que el recorrido sea el óptimo.
- Mejorar la combinación de teclas. OK
- Permitir reiniciar el mapa. OK
- Permitir borrar bloqueos. OK
- Agregar mayor autonomía a las celdas.

  ToDo - END */
