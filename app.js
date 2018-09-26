const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const uuidV4 = require("uuid/v4");


//setting port
var port = process.env.PORT || 3000;

//use body-parser 
app.use(bodyParser.urlencoded({extended: true}));

//use public directory
app.use(express.static("public"));

//set vien engine to be ejs
app.set("view engine", "ejs");

//datbase
	//setting the pool
	
	//uncomment for local
	// var pool = new Pool({
	// 	user: 'postgres',
	// 	host: '127.0.0.1',
	// 	database: 'chatroomv1',
	// 	password: '',
	// 	port: '5432'
	// });

	//uncomment for heroku
	let connectionString = process.env.DATABASE_URL;
	var pool = new Pool({ connectionString: connectionString,
		});


//route
	//root
	app.get("/" , (req,res)=>{
		console.log("-- root visited");
		res.render("index.ejs");
	});


	//invited
	app.get("/invited", (req,res)=>{
		console.log("-- invited visited");
		res.render("invited");
	})

	//seconAuth
	app.get("/secondAuth", (req,res)=>{
		console.log("-- seconAuth visited ");
		res.render("secondAuth");
	});

	//signUp
	app.get("/newMember", (req,res)=>{
		console.log("-- signUp visited ");
		res.render("signUp");
	});

	//signing up - adding new member

		//mailing an account request -- or  automatic depending on space available
			//auto
			//add to database -
				// send validation email - validate account in database : another route

	app.post("/newMember", (req,res) =>{
		console.log("--- sending a new member inscription");
		//getting the info 
			//get the login
			let login = req.body.login;
			let email = req.body.email;
			console.log(login , email);

			//check for existing login
			(async () => {
				const client = await pool.connect();
				try{
					let query = ['SELECT login from member WHERE login = $1;','SELECT email from member WHERE email = $1;'];
					let params = [[login],[email]];
					let results =[]
					for(let i=0 ; i< query.length ;i++){
						console.log("query:" +query[i]+ " " +" params: "+params[i]);
						results[i] = await client.query(query[i],params[i]);

						console.log(results[i].rows);
					}

					//check for double
					if(results[0].rows[0] || results[1].rows[0]){
						//account exists
						res.send("login already in use");
					}else {

						//add to db
							//gen hash
							let hashPass = await bcrypt.hash(req.body.password,5);
							//gen query
							let query = "INSERT INTO member(id,login,email,pass) VALUES($1 ,$2 ,$3 ,$4);";
							let params = [uuidV4() ,login ,email ,hashPass];
							await client.query(query,params);
							console.log("user added to db successfully");
							// res.redirect("/accounts");
							res.send("ok ok ok");

							
					}

				}finally{
					console.log("--finally--");
					client.release();
				}
			}) ().catch(err=> console.error(err.stack));

	});


	//test sign in
	app.get("/accounts" , (req,res)=>{
		//get data

		
		(async () =>{
			const client = await pool.connect();
			let query = 'SELECT * FROM member;';
			try {
				const results = await client.query(query);

				res.render('accounts',{results : results.rows});


			} catch(e) {
				// statements
				console.log(e);
			} finally {
				// statements
			}
		}) ().catch( err=> console.log(err.stack));

	});

	//route for receiving ajax 
	//search double everything
	app.get('/searchDouble/:table/:column/:val',(req,res)=>{

		//make the query to db
		let column = req.params.column;
		let value = req.params.val;
		let table = req.params.table;

		//query
		let query = "SELECT "+column+" FROM "+table+" WHERE "+column+" = $1;";
		let params = [value];
		console.log("column "+column);
		console.log("value "+value);
		console.log("query "+query);

		(async () => {
			const client = await pool.connect();
			try {
				const results = await client.query(query, params);
				//if it's already there
				if(results.rows[0]){
					res.send(true);
				}else{
					res.send('');
				}
			} catch(e) {
				res.send("error");
				console.log(e);
			} finally {
				client.release();
			}
		})();		


	});
		//validate email
		//verify if email is already taken



//start server
app.listen(port, ()=>{
	console.log("Server running on port "+port);
})