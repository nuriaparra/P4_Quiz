const readline = require('readline'); //carga los modulos
const model = require('./model');  //array y funciones
const {log, biglog, colorize, errorlog}= require("./out");//colorear
const cmds =require("./cmds");
const net = require("net");

net.createServer(socket=>{

  console.log ("Se ha conectado un cliente desde " + socket.remoteAddress);

  biglog(socket,"CORE quiz", 'green');



const rl = readline.createInterface({//configuracion del interfaz
  input: socket,
  output: socket,
  prompt: colorize('quiz >', 'blue'), //lo que sale al principio

  completer(line) { //lee una linea y te lo autocompleta con el tabulador
     const completions = 'help edit delete add show list test credits play quit '.split(' ');
     const hits = completions.filter((c) => c.startsWith(line));
 
     return [hits.length ? hits : completions, line];
    }
});


socket
.on("end", ()=>{rl.close()})
.on("error", ()=>{rl.close()});



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
      cmds.helpCmd(socket, rl);
      break;

   case 'list':
     cmds.listCmd(socket,rl);
     break;

    case 'show':
     cmds.showCmd(socket,rl, args[1]);
     break; 

    case 'add':
     cmds.addCmd(socket,rl);
     break; 


    case 'delete':
     cmds.deleteCmd(socket,rl, args[1]);
     break;     


    case 'edit':
     cmds.editCmd(socket,rl, args[1]);
     break;

    case 'test':
     cmds.testCmd(socket,rl, args[1]);
     break; 

    case 'p':
    case 'play':
     cmds.playCmd(socket,rl);
     break; 


    case 'credits':
     cmds.creditsCmd(socket,rl);
     break; 


    case 'quit':
    case 'q':
     cmds.quitCmd(socket,rl);
     break; 
  

            
    default:
      log(socket,`No entiendo qué has querido decir.  ${colorize(comando, 'red')} no es un comando válido.  Prueba de nuevo o usa 'help' para ver los posibles comandos.`);
      //otra cosa que no entiende
      rl.prompt();
      break;
  }
})
.on('close', () => {
  log(socket,'Adios!');
  
});


})
.listen(3030);



//control+D cierra el progrma














