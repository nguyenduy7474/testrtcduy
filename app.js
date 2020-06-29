var express = require('express');

var app = express();
var constants = require('constants');
var constant = require('./config/constants');


var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var path = require('path');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');
var now = new Date();
var Savedata = require('./app/models/savedata');
var Peercalling = require('./app/models/peercalling');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


/***************Mongodb configuratrion********************/
var mongoose = require('mongoose');
var configDB = require('./config/database.js');
//configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database


require('./config/passport')(passport); // pass passport for configuration

//set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
//app.use(bodyParser()); // get information from html forms

//view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');
//app.set('view engine', 'ejs'); // set up ejs for templating


//required for passport
//app.use(session({ secret: 'iloveyoudear...' })); // session secret

app.use(session({
    secret: 'I Love India...',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./config/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

//launch ======================================================================
var server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => { 

	Savedata.find({}, (err, data) => {
		socket.emit("listphong", data)
	})

	socket.on('disconnect', () => {
		Savedata.deleteOne({idsocket: socket.id}, (err) => {
			Peercalling.find({$or: [{peer1: socket.id}, {peer2: socket.id}]}, (errpeer, data) => {
				var peerneeddelete
				if(data.length != 0){
					data = data[0]
					if(data.peer1 == socket.id){
						Peercalling.deleteOne({peer1: socket.id}, (err) => {
							io.to(data.peer2).emit("Peerdisconnect", "discn")
						})
					}else{
						Peercalling.deleteOne({peer2: socket.id}, (err) => {
							io.to(data.peer1).emit("Peerdisconnect", "discn")
						})
					}
				}
			})
		})
	})

	socket.on('SendOfferToServer', (offer) => {
		let data = {
			offer: JSON.stringify(offer.offer),
			idsocket: socket.id,
			roomnumber: offer.roomnumber,
			type: offer.type,
/*			res: offer.res*/
		}

		let datasave = Savedata(data)
		datasave.save()

		io.emit("showpeer", data)

	})

	socket.on('SendAnswerToServer', (answer) => {
		Savedata.deleteOne({roomnumber: answer.roomnumber}, (err) => {
			io.to(answer.idsocket).emit("SendAnswerToConnect", {answer: answer.answer})
		})
	})
});

server.listen(port);
/*app.listen(port);*/
console.log('The magic happens on port ' + port);

//catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).render('404', {title: "Sorry, page not found", session: req.sessionbo});
});

app.use(function (req, res, next) {
    res.status(500).render('404', {title: "Sorry, page not found"});
});
exports = module.exports = app;
