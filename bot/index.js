const Discord = require('discord.js');
const client = new Discord.Client();
const pinger = require('minecraft-pinger')

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === 'ping') {

        // Promise
        pinger.pingPromise('hypixel.net', 25565)
            .then(console.log)
            .catch(console.error)

        // Async
        pinger.ping('hypixel.net', 25565, (error, result) => {
            if (error) return console.error(error)
        })
    }
});

client.login('NzEyMjQ1Mzk4MjY5MzI5NTEx.XsP2pw.inP78UEkJTYmrPbcyg0NhMflQ5M');