const model = require('./model');  //array y funciones
const {log, biglog, colorize, errorlog}= require("./out");//colorear
const process = require('process');


//Funcion help: muestra los posibles comandos
exports.helpCmd = rl => {
 	console.log("Posibles comandos");
    console.log("h|help - Ayuda");
    console.log("list - Lista de todas las preguntas");
    console.log("show <id> - Muestra la pregunta y la respuesta del quiz inidicado");
    console.log("add - Añadir un nuevo quiz");
    console.log("delete <id> - Elimina el quiz indicado ")
    console.log("edit <id> - Edita el quiz indicado");
    console.log("test <id> - Probar el quiz indicado");
    console.log("p|play - Jugar aleatoriamente");
    console.log("credits - Créditos");
    console.log("q|quit - Salir del programa");
    rl.prompt(); 
};

//Funcion list
exports.listCmd = rl => {

    model.getAll().forEach((quiz, id) => {
      log(`[${colorize(id, 'magenta')}]: ${quiz.question}`);
    }); 
    rl.prompt();
};



//Funcion show
exports.showCmd = (rl, id) => {

    if (typeof id === "undefined"){
  		errorlog("El parámetro id no es valido.");
    }else {
  	  try{
  		   const quiz =model.getByIndex(id);
  		   log(`[${colorize(id, 'blue')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
  	  } catch(error){
  		  console.log(error.message);
  	  }
    }
  	
  
    
  rl.prompt();
};


//Funcion add
exports.addCmd =rl => {
	rl.question(colorize('Introduce una nueva pregunta:' , 'red'), question => {
		rl.question(colorize('Introduce la respuesta' , 'red'), answer => {
			model.add(question, answer);
			log(`${colorize('Se ha añadido', 'blue')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
			rl.prompt();
    });
	});

};


//Funcion delete
exports.deleteCmd =(rl, id) => {

	   if (typeof id === "undefined"){
  		  errorlog('Falta el parámetro id.');
      }else {
  	      try{
  		      model.deleteByIndex(id);
  	      } catch(error){
  		      errorlog(error.message);
  	      }
      }


    rl.prompt();
};

//Funcion edit
exports.editCmd = (rl, id) => {

    if (typeof id === "undefined"){
  		 errorlog('Falta el parámetro id.');
  		
    }
  
     else {
  	  try{
  	  	 const quiz = model.getByIndex(id);
            
         process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
            
         rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {
                
              process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);
  		 
		     rl.question(colorize('Introduce la respuesta' , 'red'), answer => {
			     model.update(question, answer);
			     log(`Se ha cambiado el quiz ${colorize(id,'blue')} por: ${question} ${colorize('=>', 'magenta')}  ${answer}`);
  		        rl.prompt();
  		        });
  	        });
        } catch (error){
    	   errorlog(error.message);
    	  rl.prompt();
        }
    }  
  
};


//Funcion test
exports.testCmd =(rl, id)=> {

	if (typeof id === "undefined"){
  		 errorlog('El parámetro id no es valido.');
  		rl.prompt();
    }
  
    else {
    	 try{ 
    	 	const quiz =model.getByIndex(id);	//obtiene la pregunta correspondiente
    	 	rl.question(colorize(quiz.question  + '? ', 'red'), respuesta=> {
    	 		if(respuesta.toLowerCase().trim() === quiz.answer.toLocaleLowerCase().trim()){
    	 			log('Su respuesta es correcta.');
                    biglog('Correcta', 'green');

                }else{
                	log('Su respuesta es incorrecta.');
                    biglog('Incorrecta', 'red');
 					          
                }
                rl.prompt();
    	       	});

    	 
        } catch (error){
    	   errorlog(error.message);
    	  rl.prompt();
        }
    }  

};

   
  



//Funcion play
exports.playCmd = rl=> {
    var i=0;
    let puntuacion =0; //numero de acierto que llevamos
    let PorResolver = new Array(model.count()); //array con las preguntas que quedan
     
    for(i=0; i< model.count(); i++){ //meter los id's
    	PorResolver[i] = i;
    }

    const playOne = () =>{

     if(PorResolver.length === 0){
     	 log(`No hay nada más que preguntar.`);
          log(`Fin del juego. Aciertos: ${puntuacion}`);
          biglog(puntuacion, 'magenta');
     	 rl.prompt();
   
     }else{

    	  let id= Math.floor(Math.random()*(PorResolver.length-1));//id aleatorio
    	  let quiz=model.getByIndex(PorResolver[id]);
    	  PorResolver.splice(id, 1); //eliminar ese del array auxilair
         

          rl.question(colorize(quiz.question  + '? ', 'red'), respuesta=> {
    	      if(respuesta.toLowerCase().trim() === quiz.answer.toLocaleLowerCase().trim()){
    	 	      puntuacion++;
    	 		  log(`CORRECTO. - Lleva ${puntuacion}  aciertos` );
                  playOne();

                }else{
                	log('INCORRECTO.');
                    log(`Fin del juego. Aciertos: ${puntuacion} `);
                    biglog(puntuacion, 'magenta');
                	 
                    
                }
                rl.prompt();
            });
        }
       
    }
    playOne();
};
 
//Funcion credits
exports.creditsCmd = rl => {
	console.log('Autores de la práctica:');
    console.log("Nuria Parra Valverde");
    rl.prompt();
};

//Funcion quit
exports.quitCmd = rl => {

   rl.close();
   rl.prompt();
};
