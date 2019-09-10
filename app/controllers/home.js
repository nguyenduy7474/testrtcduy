var numeral = require('numeral');
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');
var Savedata = require('../models/savedata');
var Peer = require('simple-peer')

class Webrtc {
	static home(req, res){
		res.render('index.ejs', {
			error : req.flash("error"),
			success: req.flash("success"),
			session:req.session,

		});
	}

	static Checkuserwait(req, res){
		Savedata.findOne({}, (err, data) => {
			if(data){
				console.log(data)
				res.send({offer: data.offer, id: data._id})
			}else{
				res.send("false")
			}
		})
	}

	static Nhanoffer(req, res){
		let offer = req.body.offer
		let peer = req.body.peer
		let data = {
			offer: offer,
			peer: peer
		}

		let datasave = Savedata(data)
		datasave.save((err) => {
			res.send("true")
		})
	}

	static Nhananswer(req, res){
		var answer = req.body.answer
		var id = req.body.id
		console.log(id)
		
		Savedata.findOne({_id: id}, (err, data) => {
			Peer = JSON.parse(data.peer)
			Peer.signal(JSON.parse(answer))
			Peer.on('signal', (answer) => {
				res.send('ss')
			})
			
		})
	}
}

module.exports = Webrtc


    
