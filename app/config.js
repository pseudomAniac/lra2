var dbConf = require("../lib/db-confg.js");
var adapter = require("lockit-mongodb-adapter");
exports.appname = 'Loop Pacific Count';
// exports.url = 'http://localhost:3000';
exports.url = 'https://looppacificcount.herokuapp.com';
exports.rest = false;
exports.db = {
//	url: 'mongodb://127.0.0.1:27017/',
	url: 'mongodb://test_user:default@ds019980.mlab.com:19980/heroku_gt6n53cm',
	name: "lra",
	collection: 'users'
}
exports.login = {
	route: '/login',	// login route
	logoutRoute: '/logout',	// logout route
//	views: {
//		login: 'lockit/login.ejs',	// template file for login form
//		loggedOut: 'lockit/myLogoutSuccess.ejs'	// template file for logout success
//	}
}
exports.signup = {
	route: '/signup',
	views: {
		signup: 'lockit/signup.ejs' // create this file to host the signup form
	},
	handleResponse: true
}

exports.failedLoginsWarning = 3;
exports.failedLoginAttempts = 5;
exports.accountLockedTime = '20 minutes';
