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
	
	this.isObstacle = function(id)
	{
	  return this.getObstacles()[id];
	}
	
	this.getObstacles = function()
	{	
	  if (this.obstacles == null)
	  {
	    this.obstacles = new Array();
	    
	    for (i = 0; i < this.countCells(); i++)
	    {
	      this.obstacles.push(false);
	    }
	  }
	  
	  return this.obstacles;
	}
	
	this.addObstacle = function(aCell)
	{
	  this.getObstacles()[aCell.id] = true;
	  
	  this.obstacleMode();
	  
	  aCell.draw();
	}
	
	this.countCells = function()
	{
		return this.cellWidth * this.cellHeight;
	}
	
	this.width = function()
	{
		return this.cellWidth * this.cellSide;
	}
	
	this.height = function()
	{
		return this.cellHeight * this.cellSide;
	}
	
	this.drawMode = function()
	{		
		this.context.fillStyle = '#dddddd';
	}
	
	this.selectStartCellMode = function()
	{	
		this.context.fillStyle = '#88ee77';
	}
	
	this.selectEndCellMode = function()
	{	
		this.context.fillStyle = '#8877ee';
	}
	
	this.resolveMode = function()
	{	
		this.context.fillStyle = '#77ddee';
	}
	
	this.obstacleMode = function()
	{
		this.context.fillStyle = '#ee7777';
	}
	
	this.resolve = function()
	{
		if ((this.startCell == null) || (this.endCell == null))
		{
			return false;
		}
		
		this.resolveMode();
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
	  
	  for (i = 0; i < this.countCells(); i++)
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
		  //console.log(queuedBy);
	      return queuedBy;;
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
	    if (aux[i] != null)
	    {
	      neighbours.push(aux[i]);
	    }
	  }

	  return neighbours;
	}
	
	this.unselect = function(aCell)
	{
		this.drawMode();
		
		aCell.draw();
	}
	
	this.startCell = null;
	this.endCell = null;	
	
	this.canvas = jQuery('<canvas width="' + this.width() + 'px" height="' + this.height() + 'px"></canvas>');
	this.context = this.canvas[0].getContext('2d');
	
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
		
		if ((column < 0) || (row < 0) || (column >= this.cellWidth) || (row >= this.cellWidth))
		{
		  return null;
		}		
		
		id = (row * this.cellWidth) + column;
		
		return new dvCell(id, column * this.cellSide, row * this.cellSide, this);
	}
	
	this.getCellByRowCol = function(row, column)
	{
	  if ((row < 0) || (column < 0) || (row > (this.cellWidth - 1)) || (column > (this.cellHeight - 1)))
	  {
	    return null;
	  }
	  
		id = (row * this.cellWidth) + column;
		
	  return new dvCell(id, column * this.cellSide, row * this.cellSide, this);
	}
	
	this.draw = function()
	{
		this.drawMode();
		
		for (i = 0; i < this.countCells() ; i++)
		{
			this.getCellById(i).draw();
		}
	}
	
	this.selectStartCell = function(id)
	{
		if (this.startCell != null)
		{
			this.unselect(this.startCell);
		}
		
		this.selectStartCellMode();
		
		this.startCell = this.getCellById(id);		
		this.startCell.draw();
	}
	
	this.selectEndCell = function(id)
	{
		if (this.endCell != null)
		{
			this.unselect(this.endCell);
		}
				
		this.selectEndCellMode();
		
		this.endCell = this.getCellById(id);		
		this.endCell.draw();
	}
	
	this.selectObstacleCell = function(id)
	{
		if (this.endCell != null)
		{
			this.unselect(this.endCell);
		}
		
		this.addObstacle(aCell);
	}
	
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
			if (path != null){
				for (i=0;i<path.length-1;i++){
					if (path[i].row < path[i+1].row)
						newArray.push(2);
					if (path[i].row > path[i+1].row)
						newArray.push(4);
					if (path[i].column < path[i+1].column)
						newArray.push(1);
					if (path[i].column > path[i+1].column)
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

	}

	this.canvas.on('click', function(event)
	{
		aCell = aMap.getCellByPosition(event.pageX, event.pageY);
		
	  if (event.ctrlKey)
	  {
  		aMap.selectEndCell(aCell.id);
  		
  		return;
	  }
	  
    aMap.selectStartCell(aCell.id);	
	});
	
	this.canvas.on('mousemove', function(event)
	{		
		aCell = aMap.getCellByPosition(event.pageX, event.pageY);
		
	  if (event.shiftKey)
	  {
  		aMap.selectObstacleCell(aCell.id);
  		
  		return;
	  }	 
	});
	
	jQuery('body').keydown(function(event)
	{	  
	  if (event.keyCode == 83)
	  {
		result = aMap.resolve();
	  }
	});
};

var aMap;

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
- Mejorar la combinación de teclas.
- Permitir reiniciar el mapa.
- Permitir borrar bloqueos.
- Agregar mayor autonomía a las celdas.

  ToDo - END */
