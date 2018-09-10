const express = require("express");
const app = express();

//setting port
var port = process.env.PORT || 3000;

//use public directory
app.use(express.static("public"));

//set vien engine to be ejs
app.set("view engine", "ejs");


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
	app.get("/signUp", (req,res)=>{
		console.log("-- signUp visited ");
		res.render("signUp");
	});



//start server
app.listen(port, ()=>{
	console.log("Server running on port "+port);
})