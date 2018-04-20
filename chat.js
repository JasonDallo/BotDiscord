const Discord = require('discord.js')
const bot = new Discord.Client();
const files = require('fs')

const config = require('./configChat.json');
const xp = require('./xp.json');
const Twitter =  require('twitter');
const TwitClient = new Twitter({
	consumer_key: config.twitter.consumer_key,
	consumer_secret: config.twitter.consumer_secret,
	access_token_key: config.twitter.access_token_key,
	access_token_secret: config.twitter.access_token_secret
});

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
var mysql      = require('mysql');
var connection = mysql.createConnection({
	host     : config.mysql.hostname,
	user     : config.mysql.user,
	password : config.mysql.psw,
	database : config.mysql.dbname
});
var user = 0;
var streamers = [];


bot.on('ready', () => {
	console.log('ready')
	connection.connect(function(err) {
		if (err) {
			console.error('error connecting: ' + err.stack);
			return;
		}
		console.error(connection.state);
	});
	getStreamers();

})

bot.on('guildMemberAdd', member => {
	let g = member.guild;
	g.defaultChannel.sendMessage('Hi ${member.user}, welcome here')
})

bot.on('message', msg => {

	if (msg.author.bot) return
		Leveling(msg.author.id, msg.content);
	if (!msg.content.startsWith(config.prefix)) return;

	let command = msg.content.split(" ")[0];
	command = command.slice(config.prefix.length);

	let args = msg.content.split(" ").slice(1);

	if (command == 'avatar') {
		msg.reply(msg.author.avatarURL)
	}
	if (command == 'on') {
		msg.reply('I\'m on !')
	}

	// ==========================CALCULS==========================
	if (command == 'add' && args.length >= 2){
		let result = 0;
		args.forEach(function(value){
			result = result + +value
		})
		msg.reply("Result: "+result)
	}
	if (command == 'sub' && args.length == 2){
		let result = args[0] - args[1]
		msg.reply("Result: "+result)
	}

	if (command == 'mult' && args.length >= 2){
		let result;
		let count = 0
		args.forEach(function(value){ 
			if(count == 0) {
				result = +value
			}
			else{
				result = result * +value
			}
			count = count+1;
		})
		msg.reply("Result: "+result)
	}
	if (command == 'dvd' && args.length >= 2){
		let result;
		let count = 0
		args.forEach(function(value){ 
			if(count == 0) {
				result = +value
			}
			else{
				result = result / +value
			}
			count = count+1;
		})
		msg.reply("Result: "+result)
	}

	// ==========================CONST==========================
	if (command == 'pi' && args.length < 1) {msg.reply(config.const.pi.text)}

		if (command == 'pi' && args.length == 1) {
			let value = args[0];
			if (value <= 100) {
				msg.reply(config.const.pi.nb.substr(0, +value+2))
			}
			else{
				msg.reply('Si vous désirez plus que les 99 premières décimales \n Rendez-vous ici http://www.ilikepi.com/10-000-digits-of-pi/')
			}
		}
		if (command == 'gold' && args.length < 1) {msg.reply(config.const.gold)}


	//==========================RECHERCHES==========================
if (command == 'r') {

}





	// ==========================USER STATUS==========================



	// ==========================MISC==========================
	if (command == 'h') {
		msg.reply(config.help.text)
	}
	if (command == 'profil') {
		flushFileXP(msg.author.id)
		connection.query("SELECT * FROM users WHERE name = '"+ msg.author.id +"'", function (error, results, fields) {
			if (error){
				throw error
			}
			let user = results[0]
			let ratio = user.currentXP / user.xpToReach;
			let bar = '='.repeat(Math.floor(ratio*50))
			//let space = '_'.repeat(50-(Math.floor(ratio*50)))
			msg.reply('Vous etes  au niveau '+user.current_level+ ' et vous disposez de '+user.currentXP+'/'+user.xpToReach+' points d\'xp.\nProchain level up dans '+(user.xpToReach-user.currentXP)+'points d\'xp :nerd:\n\n|'+bar+'| '+Math.round(ratio*100) +'%')
		});
	}
	if (msg.content == 'hi') {
		msg.reply("Hi here, im back")
	}
	if(command == 'newAlert'){

		connection.query("SELECT * FROM alerts WHERE author = '"+ msg.author.id +"'", function (error, results, fields) {
			if (error){
				throw error
			}
			if (!args[0]) msg.reply("Invalid arguments")
				else if (results.length >= 3) msg.reply("You can't have more than 3 alerts");
			else{

				if (args[0].length > 3) {
					if (args[1]) newAlert(args[0],args[1], msg.author.id)
						else{
							newAlert(args[0],null ,msg.author.id)
						}
						msg.reply("On enregistre votre alert")
					}
					else	{
						msg.reply("Invalid arguments")
					}
				}
			});
	}

	if (command == 'alerts') {
		msg.reply(config.alert.help)
	}
	if (command == 'a') {
		console.log(args)
	}
	if (command == 'alertsList') {
		connection.query("SELECT * FROM alerts WHERE author = '"+ msg.author.id +"'", function (error, results, fields) {
			if (error){
				throw error
			}
			var alerts = getAlerts(results)
			var str = 'Here the list of your alerts:\n\n'
			for (var i = 0; i <= alerts.length-1; i++) {
				str = str+ alerts[i].title+' à ' + alerts[i].date + ' active:' +alerts[i].active+"\n\n"
			}
			msg.reply(str)
		});
	}

	if(command == 'delAlert'){
		if (!args[0]) msg.reply("I need a title")
			else {
				connection.query("SELECT * FROM alerts WHERE author = '"+ msg.author.id +"' AND title = "+args[0], function (error, results, fields) {
					if(error) throw error

				});
			}
		}




	//ALERTS

	// Faire un fichier tier tampon de la db pour l'xp avec variable contenant l'xp à attribuer à l'user qui se 'vide' <toutes les 24h> et sur demande du lvl actuel de l'user

	// Faire un systeme d'alarme


	if(command == 'twlast' && args.length == 1){
		TwitClient.get('statuses/user_timeline',{screen_name: args[0], count: 1}, function (err, res){
			if (!res.length > 0) msg.reply('Cet utilisateur n\'existe pas, assurez-vous de donner son nom(@) et non son pseudo.');
			else{
				msg.reply("From: "+res[0].user.name+" at " + res[0].created_at+ "\n\n" +res[0].text)
			}
		})
	}
	if (command == 'nwtw' && args.length >= 1) {
		let tw = msg.content.substr(6, msg.content.length-1);
		if (tw.length >= 255) {
			msg.reply("Message trop long");
		}
		else{
			TwitClient.post('statuses/update', {status: tw}, function(err,res){
				if (!err) msg.reply("Le message a été posté.")
			})
			
		}
	}

	if(command == 'listS'){
		connection.	query("SELECT name FROM streamers ORDER BY added_at ASC", function(err, res, fields){
			if (err) console.log(err);
			res.forEach(function(value, key){
				streamers.push(value.name);
				if (key == res.length-1) {
					repStreamers(msg, streamers)
					msg.reply(streamers)
				}
			})
		});
	}
	if(command == 'addS' && args.length == 1){
		checkStreamer(args[0], msg);
	}
});



//==========================ALERTS==========================

function newAlert(title,content = null, id){
	console.log(title)
	console.log(content)
	console.log(id)
	connection.query("INSERT INTO alerts(title,content,author, active) VALUES('"+title+"', '"+ content+"','"+id+"', '0' )", function (error, results, fields) {
		if (error){
			throw error
		}

	});
	
}
function getAlerts(res){
	var alerts = []
	for (var i = 0; i <= res.length-1; i++) {
		let temp = {'title': res[i].title, 'date': res[i].date, 'active': res[i].active}
		alerts.push(temp)
	}
	return alerts
}


//==========================LEVELING==========================



function Leveling(user, content){

	var xpToGain = Math.round(content.length/10);
	let myXP = getUserinJSON(user)
	let intXP = parseInt(myXP.substr(myXP.indexOf(' ')+1, myXP.length));
	let newXP = intXP + xpToGain;
	let me = xp.users.indexOf(myXP)
	let replace = xp.users.replace(myXP, user + ' '+ newXP);
	xp.users = replace
	changeFile('xp.json', xp)
}

function getUser(id){
	connection.query("SELECT * FROM users WHERE name = '"+ id +"'", function (error, results, fields) {
		if (error){
			throw error
		}
		console.log(results[0].id+'getuser')
		return results[0].id
	});

}

function getUserinJSON(id){
	let us = xp.users;
	let me = strstr(us, id)
	if (me === false) {
		var string =  id+' 0'
		let exp = xp.users.split(',');
		exp.push(id+' 0');
		let imp = exp.join(',')
		xp.users = imp
		changeFile("xp.json", xp)
		return string
	}
	else{
		let sub = me.substr(0, me.indexOf(','))
		if (sub.length > 0) return sub;
		return me;
	}
}

function changeFile(filename, file){
	files.writeFile(filename, JSON.stringify(file), function(err){
		if (err) return console.log(err);
		console.log("writing in " +filename)
		console.log(JSON.stringify(file))
		return true
	})

}
function flushFileXP(id){
	let user = getUserinJSON(id)
	let posXP = user.indexOf(' ');
	let intXP = parseInt(user.substr(posXP+1, user.length));
	xpToCheck(id, intXP)
}
function xpToCheck(id, value){
	connection.query("SELECT * FROM users WHERE name = '"+ id +"'", function (error, results, fields) {
		if (error) console.log(error);
		let total = results[0].currentXP+value
		if (total >= results[0].xpToReach) {
			updateLevel(results[0], total)
			console.log('Results')
		}
		else{
			updateXP(id, total)
			console.log(total+'total')
		}

	});
}

function updateLevel(user, total){
	let rest = total - parseInt(user.xpToReach)
	let newLvl= parseInt(user.current_level)+1
	let xpToReach = user.xpToReach*1.5
	connection.query("UPDATE users SET currentXP = '0',current_level = '"+ newLvl +"', xpToReach = '"+ xpToReach +"'  WHERE name = '"+ user.name +"'", function (error, results) {
		if (error) throw error;
		xpToCheck(user.name, rest)
	});

}
function updateXP(id, value){
	connection.query("UPDATE users SET currentXP = '"+ value +"' WHERE name = '"+ id+"'", function (error, results) {
		if (error) throw error;
	});
	let me = strstr(xp.users, id)

	let sub = me.substr(0, me.indexOf(','))
	if (sub.length > 0){
		var stringXP = sub;
	}
	else {
		var stringXP = me;
	}

	let replace = xp.users.replace(me, id + ' '+ 0);
	xp.users = replace
	changeFile('xp.json', xp)

}
 	//==========================TWITCH==========================

function getStreamers(){

	// connection.query("SELECT name FROM streamers ORDER BY added_at ASC", function(err, res, fields){
	// 	if (err) console.log(err);
	// 	res.forEach(function(value, key){
	// 		if (!streamers.indexOf(value)) {
	// 			streamers.push(value.name);
	// 		}
	// 	})
	// });

	xhr.onreadystatechange = function() {
		if (this.readyState === 4) {
				console.log(this.responseText.length)
			if (this.responseText.length < 200) {
				
			}
			else{

			}
		}
	};
	xhr.open("GET", "https://api.twitch.tv/kraken/streams/zerator?client_id="+config.twitch.id, true);
	xhr.send();

}

function checkStreamer(name, msg){
	connection.query("SELECT name FROM streamers WHERE name LIKE '"+name+"';", function(err, res, fields){
		if (err) console.log(err);
		if (res.length > 0) {
			msg.reply('Ce streamer est déjà dans la liste.')
			
		}
		else{
			addStreamer(name, msg);
		}
	});
}
function addStreamer(name, msg){
	xhr.onreadystatechange = function() {
		if (this.readyState === 4) {
			console.log(this.responseText.length)
			if (this.responseText.length < 100) {
				msg.reply('Cet utilisateur n\'existe pas.')
			}
			else{
				connection.query("INSERT INTO streamers(name,url) VALUES('"+name+"', 'twitch.tv/"+ name+"')", function (error, results, fields) {
					if (error){
						throw error
					}
				});
				msg.reply('Streamer '+name+' bien ajouté à la liste');
			}
		}
	};
	xhr.open("GET", "https://api.twitch.tv/kraken/users/"+name+"?client_id="+config.twitch.id);
	xhr.send();

}
	//==========================GAME==========================



	//==========================UTILITIES==========================




// function replaceString(oldS, newS, fullS) {
//   for (var i = 0; i < fullS.length; i++) {
//     if (fullS.substring(i, i + oldS.length) == oldS) {
//      fullS = fullS.substring(0, i) + newS + fullS.substring(i + oldS.length, fullS.length);
//     }
//   }
//   return fullS;
// }
function strstr(haystack, needle, bool) {
    // Finds first occurrence of a string within another
    //
    // version: 1103.1210
    // discuss at: http://phpjs.org/functions/strstr    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: strstr(‘Kevin van Zonneveld’, ‘van’);
    // *     returns 1: ‘van Zonneveld’    // *     example 2: strstr(‘Kevin van Zonneveld’, ‘van’, true);
    // *     returns 2: ‘Kevin ‘
    // *     example 3: strstr(‘name@example.com’, ‘@’);
    // *     returns 3: ‘@example.com’
    // *     example 4: strstr(‘name@example.com’, ‘@’, true);    // *     returns 4: ‘name’
    var pos = 0;

    haystack += "";
    pos = haystack.indexOf(needle); if (pos == -1) {
    	return false;
    } else {
    	if (bool) {
    		return haystack.substr(0, pos);
    	} else {
    		return haystack.slice(pos);
    	}
    }
}

bot.login(config.token);
