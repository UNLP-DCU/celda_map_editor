// github FOR WINDOWS
var miCanvas = (function (){

	var contexto, funcionDeDibujoPrivada, cargarValoresPrivada, pintarPrivada, height, width;
	width = 2;
	height = 2;
	
	funcionDeDibujoPrivada = function(){
		//Recibimos el elemento canvas
		var elemento = document.getElementById('micanvas');
		//Comprobación sobre si encontramos un elemento
		//y podemos extraer su contexto con getContext(), que indica compatibilidad con canvas
		if (elemento && elemento.getContext) {
		   //Accedo al contexto de '2d' de este canvas, necesario para dibujar
		   contexto = elemento.getContext('2d');
		   if (contexto) {
			  //Si tengo el contexto 2d es que todo ha ido bien y puedo empezar a dibujar 
			  contexto.strokeStyle = '#000000';
			  pintarPrivada();
		   }
		}
	}
	
	//GENERA LA MATRIZ DE RECTÁCGILOS
	pintarPrivada = function(){
		contexto.canvas.width  = width * 50;
		contexto.canvas.height = height * 50;
		for (i=0; i<height; i++){
			for (j=0; j<width; j++){
				//esto genera solo el contorno del rectángulo
				contexto.strokeRect(j*50,i*50,50,50);
			}
		}
	}
	
	cargarValoresPrivada = function(){
		width = document.getElementById('width').value;
		height = document.getElementById('height').value;
		pintarPrivada();
		console.log("111");
	}
	
	return{
		//renombre público a una función privada
		funcionDeDibujo: funcionDeDibujoPrivada,
		cargarValores: cargarValoresPrivada,
		getWitdh: width * 50,
		getHeight: height * 50,
	}
})();	
