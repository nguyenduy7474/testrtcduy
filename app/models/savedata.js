var mongoose = require('mongoose');

//define schema
var Savedata = mongoose.Schema({
	datatype: { type : String , "default" : "savedata" },
	offer: { type : String , "default" : "" },
	idsocket: { type : String , "default" : "" },
});

//create model
module.exports = mongoose.model('savedata', Savedata, 'savedata');
