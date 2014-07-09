function escribirJSON(path) {

	if (path != null){
		var myJsonString;
		var pathJSON = new Array();
		var newArray = new Array();
		for (i=0;i<path.length-1;i++){
			if (path[i].fila < path[i+1].fila)
				newArray.push(2);
			if (path[i].fila > path[i+1].fila)
				newArray.push(4);
			if (path[i].columna < path[i+1].columna)
				newArray.push(1);
			if (path[i].columna > path[i+1].columna)
				newArray.push(3);
			pathJSON.push(path[i].id);
		}
		if (path[path.length-2].fila < path[path.length-1].fila)
			newArray.push(2);
		if (path[path.length-2].fila > path[path.length-1].fila)
			newArray.push(4);
		if (path[path.length-2].columna < path[path.length-1].columna)
			newArray.push(1);
		if (path[path.length-2].columna > path[path.length-1].columna)
			newArray.push(3);

		for (i=newArray.length-1;i>0;i--){
			newArray[i] = newArray[i-1];
		}

		console.log("Array ");
		console.log(newArray);
	
		arrayTransformer = new Array();				
		arrayTransformer.push(newArray[i]);

		for (i=0;i<newArray.length-1;i++){
			ok = true;
			if (newArray[i]==1)
				switch(newArray[i+1]){	
					case 2:
						arrayTransformer.push(10);break;
					case 4:
						arrayTransformer.push(5);break;
					default:
						ok = false;}
			else if (newArray[i]==2)
				switch(newArray[i+1]){	
					case 1:
						arrayTransformer.push(7);break;
					case 3:
						arrayTransformer.push(12);break;
					default:
						ok = false;}
			else if (newArray[i]==3)
				switch(newArray[i+1]){	
					case 2:
						arrayTransformer.push(9);break;
					case 4:
						arrayTransformer.push(6);break;
					default:
						ok = false;}
			else if (newArray[i]==4)
				switch(newArray[i+1]){	
					case 1:
						arrayTransformer.push(8);break;
					case 3:
						arrayTransformer.push(11);break;
					default:
						ok = false;}
			if (!ok){
				arrayTransformer.push(newArray[i]);
			}
		}
		arrayTransformer.push(newArray[newArray.length-1]);

		pathJSON.push(path[i].id);
		myJsonString = JSON.parse(JSON.stringify(pathJSON));	
		console.log("Array por id");
		console.log(myJsonString);
		console.log("Array transformado");
		console.log(arrayTransformer);
		//console.log("Obstacles");
		//console.log(aMap.arrayObstacles);
	}
}
