var mongoose = require('mongoose');

//define schema
var Peercalling = mongoose.Schema({
	datatype: { type : String , "default" : "peercalling" },
	peer1: { type : String , "default" : "" },
	peer2: { type : String , "default" : "" },
});

//create model
module.exports = mongoose.model('peercalling', Peercalling, 'peercalling');
