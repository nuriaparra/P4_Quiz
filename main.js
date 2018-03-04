const readline = require('readline'); //carga los modulos
const model = require('./model');  //array y funciones
const {log, biglog, colorize, errorlog}= require("./out");//colorear
const cmds =require("./cmds");

biglog("CORE quiz", 'green');



const rl = readline.createInterface({//configuracion del interfaz
  input: process.stdin,
  output: process.stdout,
  prompt: colorize('quiz >', 'blue'), //lo que sale al principio

  completer(line) { //lee una linea y te lo autocompleta con el tabulador
     const completions = 'help edit delete add show list test credits play quit '.split(' ');
     const hits = completions.filter((c) => c.startsWith(line));
 
     return [hits.length ? hits : completions, line];
    }
});

rl.prompt();

rl.on('line', (line) => {//manejadores de eventos
	let args = line.split(" "); //separa la linea introducida a traves del espacio para diferencias entre el cmd y el id
	let comando = args[0].toLowerCase().trim();

 switch (comando) {

  	case ''://retorno de carro
  	 rl.prompt();
  	 break;

    case 'h':
    case 'help':
      cmds.helpCmd(rl);
      break;

   case 'list':
     cmds.listCmd(rl);
     break;

    case 'show':
     cmds.showCmd(rl, args[1]);
     break; 

    case 'add':
     cmds.addCmd(rl);
     break; 


    case 'delete':
     cmds.deleteCmd(rl, args[1]);
     break;     


    case 'edit':
     cmds.editCmd(rl, args[1]);
     break;

    case 'test':
     cmds.testCmd(rl, args[1]);
     break; 

    case 'p':
    case 'play':
     cmds.playCmd(rl);
     break; 


    case 'credits':
     cmds.creditsCmd(rl);
     break; 


    case 'quit':
    case 'q':
     cmds.quitCmd(rl);
     break; 
  

            
    default:
      console.log(`No entiendo qué has querido decir.  ${colorize(comando, 'red')} no es un comando válido.  Prueba de nuevo o usa 'help' para ver los posibles comandos.`);
      //otra cosa que no entiende
      rl.prompt();
      break;
  }
})
.on('close', () => {
  log('Adios!');
  process.exit(0);
});

//control+D cierra el progrma














