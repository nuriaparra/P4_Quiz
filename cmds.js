const model = require('./model');  //array y funciones
const {log, biglog, colorize}= require("./out");//colorear



//Funcion help: muestra los posibles comandos
exports.funcionhelp = rl => {
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
exports.funcionlist = rl => {

    model.getAll().forEach((quiz, id) => {
      console.log(`[${colorize(id, 'magenta')}]: ${quiz.question}`);
    }); 
    

   rl.prompt();
};



//Funcion show
exports.funcionshow = (rl, id) => {

    if (typeof id === "undefined"){
  		log(`El valor id no es válido`);
    }else {
  	  try{
  		   const quiz =model.getByIndex(id);
  		   console.log(`[${colorize(id, 'blue')}]: ${quiz.question}  ${quiz.answer}`);
  	    } catch(error){
  		  console.log(error.message);
  	   }
    }
  	
  
    
  rl.prompt();
};


//Funcion add
exports.funcionadd =rl => {
	rl.question(colorize('Introduce una nueva pregunta:' , 'red'), question => {
		rl.question(colorize('Introduce la respuesta' , 'red'), answer => {
			model.add(question, answer);
			console.log(`${colorize('Se ha añadido', 'blue')}: ${question}  ${answer}`);
			rl.prompt();
        });
	});

};


//Funcion delete
exports.funciondelete =(rl, id) => {

	   if (typeof id === "undefined"){
  		 log(`El valor id no es válido`);
        }else {
  	      try{
  		       model.deleteByIndex(id);
  	      } catch(error){
  		     console.log(error.message);
  	      }
        }


    rl.prompt();
};

//Funcion edit
exports.funcionedit = (rl, id) => {

    if (typeof id === "undefined"){
  		log(`El valor id no es válido`);
  		rl.prompt();
    }
  
     else {
  	  try{
  		  rl.question(colorize('Introduce una nueva pregunta:' , 'red'), question => {
		     rl.question(colorize('Introduce la respuesta' , 'red'), answer => {
			     model.update(question, answer);
			     console.log(`Se ha cambiado el quiz ${colorize(id,'blue')} por: ${question}  ${answer}`);
  		         rl.prompt();
  		        });
  	        });
        } catch (error){
    	  console.log(error.message);
    	  rl.prompt();
        }
    }  

};


//Funcion test
exports.funciontest =(rl, id)=> {

	if (typeof id === "undefined"){
  		log(`El valor id no es válido`);
  		rl.prompt();
    }
  
    else {
    	 try{ 
    	 	const quiz =model.getByIndex(id);	//obtiene la pregunta correspondiente
    	 	rl.question(colorize(quiz.question, 'red'), respuesta=> {
    	 		if(respuesta.toLowerCase().trim() === quiz.answer){
    	 			biglog("CORRECTO", 'green');

                }else{
                	biglog("INCORRECTO", 'red');

                }
             rl.prompt();
    	 	});
        } catch (error){
    	  console.log(error.message);
    	  rl.prompt();
        }
    }  

};

   
  



//Funcion play
exports.funcionplay = rl=> {
    var i=0;
    let puntuacion =0; //numero de acierto que llevamos
    let PorResolver = []; //array con las preguntas que quedan
     
    for(i=0; i< model.count(); i++){ //meter los id's
    	PorResolver[i] = i;
    }

    const playOne = () =>{

     if(PorResolver.length === 0){
     	 console.log('No quedan pregunta por resolver');
     	 rl.prompt();
   
     }else{

    	  let id= Math.round(Math.random()*(PorResolver.length-1));//id aleatorio
    	  let quiz=model.getByIndex(PorResolver[id]);
    	  PorResolver.splice(id, 1); //eliminar ese del array auxilair
         

          rl.question(colorize(quiz.question, 'red'), respuesta=> {
    	      if(respuesta.toLowerCase().trim() === quiz.answer){
    	 	      puntuacion++;
    	 		  console.log(`CORRECTO. Llevas  ${colorize(puntuacion, 'green')} aciertos` );
                  playOne();

                }else{
                	console.log(`INCORRECTO. Juego terminado con  ${colorize(puntuacion, 'red')} aciertos` );
                    rl.prompt();
                }
            });
        }
    }
    playOne();
};
 
//Funcion credits
exports.funcioncredits = rl => {

    console.log("NURIA Parra Valverde");
    rl.prompt();
};

//Funcion quit
exports.funcionquit = rl => {

   rl.close();
   rl.prompt();
};
