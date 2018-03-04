const fs=require("fs"); //para leer el archivo

const DB_FILENAME ="quizzes.json"; //fichero donde se guardan los quizzes


//array de preguntas
let quizzes = [

    {
	 question: "¿Capital de España?",
	 answer: "madrid"
    },
 
 {
	 question: "¿10-5?",
	 answer: "5"
  },

 {
	 question: "¿Rama telemática o electrónica?",
	 answer: "electrónica"
  },

 {
	 question: "¿Cara o Cruz?",
	 answer: "cruz"
  },
];


//METODOS PARA TRABAJR CON EL FICHERO DE QUIZZES
const load = () => { //carga el fichero. Si no existia, lo crea
	fs.readFile(DB_FILENAME,(err, data) =>{
		if(err) {
			if(err.code ==="ENOENT"){
				save();
				return;
			}
			throw err;
		}

		let json= JSON.parse(data);

		if(json){
			quizzes=json;
		}
	})
};


const save =() => { //salvar los datos
	fs.writeFile(DB_FILENAME,
	JSON.stringify(quizzes),
	err => {
		if(err) throw err;
	});

};
//METODOS PARA MANEJAR EL ARRAY


//devuelve el numeros de preguntas existentes 
exports.count =() => quizzes.length; 


//añade una pregunta al array
exports.add =(question, answer) =>{

	quizzes.push({
		question: (question || "").trim(), //en caso de ser indefinido se cambia por "" 
	    answer: (answer || "").trim()
	});
	save();

};

//actualizar una pregunta con id
exports.update = (id , question, answer)=>{

	const quiz = quizzes[id]; //variable corresp a ese id
	if (typeof quiz ==="undefined"){
		throw new Error('El valor del parámetro id no es válido.');
		//console.log('El valor del id no corresponde a ninguna pregunta');
	}

	quizzes.splice(id, 1, { //actualiza 1 elemento de la posicion id
		question: (question || "").trim(), 
		answer: (answer || "").trim()
    });
    save();
};


//devuelve todos los elementos del array
//pasa una copia del array
exports.getAll = () => JSON.parse(JSON.stringify(quizzes));


//devuelve el quiz correspon al id indicado
exports.getByIndex = id => {

 	const quiz = quizzes[id]; //variable corresp a ese id
	if(typeof quiz ==="undefined"){
		throw new Error('El valor del parámetro id no es válido.');

		//console.log('El valor del id no corresponde a ninguna pregunta');
	}

 return JSON.parse(JSON.stringify(quiz));
};



//elimina el quiz correspon al id indicado
exports.deleteByIndex = id => {

   const quiz = quizzes[id]; //variable corresp a ese id
   if (typeof quiz ==="undefined"){
    	throw new Error('El valor del parámetro id no es válido.');
		//console.log('El valor del id no corresponde a ninguna pregunta');
	}
 
  quizzes.splice(id, 1);
  save();
};  

load();