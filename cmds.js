const {models} = require('./model');  //array y funciones
const {log, biglog, colorize, errorlog}= require("./out");//colorear
const process = require('process');
const Sequelize=require('sequelize');//para usar las promesas de sequelize


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

  models.quiz.findAll() //Todos los quizzes
  .then(quizzes =>{//coges loq quizzes, en cada vuelta te pasan uno y lo muestras
    quizzes.forEach(quiz =>{
      log(`[${colorize(quiz.id, 'magenta')}]: ${quiz.question}`);

    });
  })
  .catch(error=>{
    errorlog(error.message);
  })

  .then(() =>{//pase lo que pase saco el prompt
    rl.prompt();

  });
} ;


//PROMESA AUXILIAR QUE TE DICE SI EL ID QUE TE PASAN ES VALIDO O NO 
const ValidateId= id => {
  return new Sequelize.Promise ((resolve, reject) =>{
    if(typeof id=== "undefined"){
      reject(new Error (`Falta el parametro <id>.`));
  
    }else {
      id=parseInt(id);//convierte lo que te pasan en un numero
      if(Number.isNaN(id)){//np lo ha podido hacer
        reject(new Error (`El valor del parametro <id> no es un numero.`));
      }else {
        resolve(id);
      }
    }
  });
};


//FUNCION QUE TRANSFORMA LA LLAMADA A RL.QUESTION A UNA PROMESA 
const makeQuestion=(rl, text) =>{
  return new Sequelize.Promise((resolve, reject)=>{
    rl.question(colorize(text, 'red'), answer=>{
      resolve(answer.trim());
    });
  });
};

//Funcion show
exports.showCmd = (rl, id) => {
  ValidateId(id) //confirma que es una id valido
  .then(id =>models.quiz.findById(id))  //busca el quiz correspondiente
  .then(quiz=>{//toma como parametro ese quiz
    if(!quiz){
      throw new Error (`No existe el quiz asociado a este id=${id}.`);
    }else {
     log(`[${colorize(quiz.id, 'blue')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
    } 
  })

  .catch(error =>{
    errorlog(error.message);
  })  
  .then(()=>{
    rl.prompt();
  });
};


//Funcion add
exports.addCmd =rl => {
  makeQuestion(rl, 'Introduzca una pregunta:')
  .then(question=>{//Recibe como parametro la pregunta generada en la promesa
    return makeQuestion(rl, 'Introduzca la respuesta')
    .then(answer=>{//recibe como parametro la respuesta generada en la promesa
      return{ question:question, answer:answer};
     
    });
  })

  .then((quiz)=>{
    return models.quiz.create(quiz);//añade el quiz al modelo de datos con la funcion create de la base de datos
  })  
  .then((quiz)=>{
     log(`${colorize('Se ha añadido', 'blue')}: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.vhanswer}`);

  })
  .catch(Sequelize.ValidatetionError, error=>{
    errorlog('El quiz no es valido');
    error.errors.forEach(({message})=> errorlog(message)); //saca todos los errores que hay
  })
  .catch(error=>{ //Error de otro tipo
    errorlog(error.message);
  })
  .then(()=>{
    rl.prompt();

  });
  
};




//Funcion delete
exports.deleteCmd =(rl, id) => {

 ValidateId(id)//me da el id
 .then(id=>models.quiz.destroy({where: {id}})) //destruye el elemento que tiene como id el id
 .catch(error=>{ //Error de otro tipo
    errorlog(error.message);
  })
  .then(()=>{
    rl.prompt();

  });
};

//Funcion edit
exports.editCmd = (rl, id) => {
  ValidateId(id)
  .then(id=>models.quiz.findById(id))//devuelve el quiz 
  .then(quiz=>{
    if(!quiz){
      throw new Error(`No existe un quiz asociadoal id= ${id}.`);
    }
    process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
    return makeQuestion(rl, 'Introduzca una pregunta:')
    .then(question=>{
     process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);
     return makeQuestion(rl, 'Introduzca la respuesta')
     .then(answer=>{
       quiz.question=question;
       quiz.answer=answer;//recibe como parametro la respuesta generada en la promesa
       return quiz;//Retorna un quiz 
      });
    });
  })
  .then(quiz=> {
    return quiz.save();
  })
  .then(quiz=>{

  log(`Se ha cambiado el quiz ${colorize(id,'blue')} por: ${question} ${colorize('=>', 'magenta')}  ${answer}`);
  })

  .catch(Sequelize.ValidatetionError, error=>{
    errorlog('El quiz no es valido');
    error.errors.forEach(({message})=> errorlog(message)); //saca todos los errores que hay
  })
  .catch(error=>{ //Error de otro tipo
    errorlog(error.message);
  })
  .then(()=>{
    rl.prompt();

  });
  
};




//Funcion test
 exports.testCmd = (rl, id) => {
       if(typeof id ==="undefined"){
        errorlog (`El parametro id no es valido.`);
        rl.prompt();
       }else{
        let pregunta;
        models.quiz.findById(id)
        .then(quiz => {
          pregunta=quiz;
        })
        .then(()=>{
        makeQuestion(rl,pregunta.question)
        .then(answer => {
          answer= answer.toLowerCase().trim();
          if (answer === pregunta.answer.toLowerCase().trim()){                   
            log(` \bcorrecto `);
            rl.prompt();
          }else{
            log(` \bincorrect`);
            rl.prompt();         
          }
        });
       })
       .catch(error =>{
        errorlog("Error" + error);
        rl.prompt();
       });
   }
  };
   





//Funcion plcd
exports.playCmd = rl=> {
  var i;

  let puntuacion =0;
  let PorResolve=[];
 
  const playOne =()=>{
     return new Promise (function (resolve,reject) {

     
      if(PorResolver.length === 0){
         log(`No hay nada más que preguntar.`);
         log(`Fin del juego. ${puntuacion}  aciertos`);
         biglog(puntuacion, 'magenta');
         
         resolve();
         return;
         
      }
       
      let posicion=Math.floor(Math.random()*(PorResolver.length-1)); //posicion aleatoria
      let quiz=PorResolver[posicion]; //quiz en esa posicion
      PorResolver.splice(posicion,1); //elimina el quiz el array

       
    
      makeQuestion(rl, quiz.question) //devuelve la respuesta
        .then(answer=>{
          if(answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim()){
            puntuacion++;
           log(` \bcorrect `);
           log(`Lleva  ${puntuacion}  aciertos`);
           resolve(playOne());
          }else{
           log(` \bincorrect `);
           log(` \bfin `);
           log (` ${puntuacion}  aciertos`);
           biglog(`${puntuacion}`, 'magenta'); 
          resolve();         
          }      
       });
      
    });    

  }
  
   
  models.quiz.findAll({raw : true}) //genera una promesa que mete todas las ? en el array quizzes
  .then(quizzes=>{//toma quizzes como parametro
    PorResolver = quizzes;
    
    
   
  })
  .then(()=>{
      return playOne();
    })
    .catch(error=>{
     errorlog(error.message);
     rl.prompt();
    })
    .then(()=>{

     rl.prompt();
    })
  
  
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
