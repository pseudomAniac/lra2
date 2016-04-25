var mongoose	= require("mongoose"),
		Schema		= mongoose.Schema;

// user schema
var userSchema = new Schema({
	fullName: String,
	type: String
});

module.exports = mongoose.model("Author", userSchema);