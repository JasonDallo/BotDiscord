const Discord = require('discord.js')
const bot = new Discord.Client();
const yt = require('ytdl')
const fs = require('fs')
const config = require('./configVocal.json');

bot.on('ready', () => {
	console.log('ready')
});

bot.on('message', msg => {
	if (msg.author.bot) return
	if (!msg.content.startsWith(config.prefix)) return;

	let command = msg.content.split(" ")[0];
	command = command.slice(config.prefix.length);

	let args = msg.content.split(" ").slice(1);


	if (command == 'yt' && msg.channel.name == 'botmusic') {
		if (!args[1]) msg.reply('Give me an Youtube URL')
		
	}

	//CALCULS
	 if (command = 'join' && msg.channel.name == "botmusic"){
	 	if (Number.isInteger(args[1])) {}
	}
	//

	if (command == 'h') {
		msg.reply("AIDE\n\n !avatar = Linker votre avatar\nCALULS\n\n/!\\EN COURS/!\\ \n\n")
	}

	//RECHERCHES
	if (command == 'r') {

	}
	//


	//ALERTS

	//lier la db

	//PresenceUpdate pour les jeux

	//


	//Systeme de leveling

	//
});


bot.login(config.token);