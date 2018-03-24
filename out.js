const figlet =require('figlet');
const chalk =require('chalk');


const colorize  = (mensaje, color) => {//ponecolor

	if (typeof color !== "undefined"){


	  mensaje= chalk[color].bold(mensaje);
    }   

	return mensaje;
};

const log  = (socket, mensaje, color) => { //imprimeeltexto
	socket.write(colorize(mensaje, color) + "\n");
};

const biglog = (socket,mensaje, color) => {//imprimegrande

 log(socket, figlet.textSync(mensaje, {horizontalLayout: 'full'}), color );
};


const errorlog = (socket, emsg) => {

    socket.write(socket,`${colorize("Error", "red")}: ${colorize(colorize(emsg, "red"), "bgYellowBright")} \n `);
}

exports= module.exports= { //otra manera de hacer el exports
	colorize,
	log,
	biglog,
	errorlog
};