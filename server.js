// Dependencies
// =============================================================
var express = require("express");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var MySQLStore = require("express-mysql-session")(session);
var db = require("./models");
var expressValidator = require("express-validator");
var bcrypt = require("bcrypt");
const saltRounds = 10;
var User = require("./models/")["User"];
var config = require("./config/config.json");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(expressValidator());
// require passport.js

app.use(cookieParser());
// Static directory
app.use(express.static("public"));

var options = {
    host: "ffn96u87j5ogvehy.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    port: 3306,
    user: "rrlq4gzdiuqb3ipm",
    password: "u58o199ki97vdtvr",
    database: "ipjuydh8t4e8828y"
};

var sessionStore = new MySQLStore(options);

app.use(session({
	secret: "keyboard cat",
	resave: false,
	store: sessionStore,
	saveUnitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log(username);
    console.log(password);
    User.findOne({
    	where: {
    		username: username
    	}
    }).then(function(results) {
		var hash = results.dataValues.password;
		var userId = results.dataValues.id;
    	bcrypt.compare(password, hash, function(err, response) {
    		if (response === true) {
    			return done(null, {user_id: 43});
    		}else {
    			return done(null, false);
    		}
    	});
    });
  }
));

// Routes
// =============================================================
require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);


// Starts the server to begin listening
// =============================================================
db.sequelize.sync({ force: false }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});