var mongoose = require('mongoose');

//define schema
var Savedata = mongoose.Schema({
	datatype: { type : String , "default" : "savedata" },
	offer: { type : String , "default" : "" },
	idsocket: { type : String , "default" : "" },
	roomnumber: { type : String , "default" : "" },
	type: { type : String , "default" : "" },
	res: { type : String , "default" : "" },
});

//create model
module.exports = mongoose.model('savedata', Savedata, 'savedata');
