const Sequelize =require('sequelize');
const sequelize = new Sequelize("sqlite:quizzes.sqlite"); //objeto sequelize
                                                                           
sequelize.define('quiz', {//modelo de datos. se crea un array con todos los modelos definidos
	question: {
		type: Sequelize.STRING,
		unique: {msg: "Ya existe esta pregunta"},
		validate: {notEmpty: {msg: "La pregunta no puede estar vacia"}}
    },

    answer: {
		type: Sequelize.STRING,
		validate: {notEmpty: {msg: "La respuesta no puede estar vacia"}}
	}
});

sequelize.sync()//es una promesa
.then(() => sequelize.models.quiz.count())//se accede al modelo quiz y se cuestan
.then(count=>{
	if(!count){
		return sequelize.models.quiz.bulkCreate([//crea varios quizzes
		{ question: "Capital de Italia", answer: "Roma"},
		{ question: "Capital de Francia", answer: "París"},
		{ question: "Capital de España", answer: "Madrid"},
		{ question: "Capital de Portugal", answer: "Lisboa"}


		]);

	}
})
.catch(error =>{
	console.log(error);
});

module.exports=sequelize;	
