var db_uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lra2";
exports.articlescollection = require('mongoose').connect(db_uri).connection.collection('articles');