var https = require('https')
const Discord = require('discord.js')
const Client = new Discord.Client();
const Chans = new Discord.GuildChannel(Client);

module.exports = {
	getUser: function (id) {

		
		client.on('ready', () => {
			console.log(`Logged in as ${client.user.username}!`);
		});

		client.on('message', msg => {
			if (msg.content === 'ping') {
				msg.reply('Pong!');
			}
		});

		// var options = {
		// 	hostname: 'discordapp.com',
		// 	path: '/oauth2/applications/@me', //+ id  ,
		// 	method: 'GET',
		// 	headers: {"Authorization":"Bot Mjg2ODk4NTk3OTQ4MTYyMDUw.C5zmqg.Vg56IDzW4XJgA65uQBUEn37oJBA"}
		// };

		// https.get(options, function(res){
		// 	console.log(res.statusCode)
		// })

		Client.login('MjkwMTQ3OTIzMDUwNjI3MDcy.C6Wy8Q.L0hf-nZaVVsLzLwW1_pKijPhYk8')
	}
	
};