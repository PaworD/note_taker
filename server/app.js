// Initialize express application with body-parser (json)
const express    =    require("express");
const bodyParser =    require('body-parser');

//Custom Routes, Util Func, etc..
const notes =  require('./routes/notes');
const user =  require('./routes/user');

// Init application context
const app = express();

//Init Parsing
app.use(bodyParser.json());


//Setting Global Access
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
	res.header("Access-Control-Allow-Headers", "*");
    next()
});


app.use(bodyParser.urlencoded({extended: true}));

//Init Routes
app.use("/notes", notes);
app.use("/user", user);



var server = app.listen(3000, () => {
    console.log(`Process is running in PORT : 3000`);
})

module.exports = server;