const Discord = require('discord.js')
const client = new Discord.Client()
const secrets = require('./secrets.json')
const config = require('./config.json')
var mc = require('minecraft-protocol')
var data = require('./data.json')
var fs = require('fs')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)

  client.user.setPresence({
    status: 'online',
    activity: {
      type: 'PLAYING',
      url: 'https://6b6t.org',
      name: '6b6t.org | (help',
      application: {
        id: '712245398269329511'
      }
    }
  })

  setInterval(() => {
    data = require('./data.json')

    if (data.guild !== null && data.channel1 != null && data.channel2 != null && data.channel3 != null) {
      var channel1 = client.guilds.resolve(data.guild).channels.resolve(data.channel1)
      var channel2 = client.guilds.resolve(data.guild).channels.resolve(data.channel2)
      var channel3 = client.guilds.resolve(data.guild).channels.resolve(data.channel3)

      mc.ping({
        host: config.host,
        port: config.port,
        version: config.version
      }, function (err, pingResult) {
        if (err) {
          console.log(err)
          channel1.setName('Players: 0')
          channel2.setName('Priority: 0')
          channel3.setName('Regular: 0')
        } else {
          var queue1raw = String(pingResult.players.sample[1].name)
          var queue2raw = String(pingResult.players.sample[2].name)

          var queue1 = queue1raw.replace(/§4/gi, '').replace(/§c/gi, '').replace(/§6/gi, '').replace(/§e/gi, '').replace(/§2/gi, '').replace(/§a/gi, '').replace(/§b/gi, '').replace(/§3/gi, '').replace(/§1/gi, '').replace(/§9/gi, '').replace(/§d/gi, '').replace(/§5/gi, '').replace(/§f/gi, '').replace(/§7/gi, '').replace(/§8/gi, '').replace(/§0/gi, '').replace(/§r/gi, '').replace(/§l/gi, '').replace(/§o/gi, '').replace(/§n/gi, '').replace(/§m/gi, '').replace(/§k/gi, '')
          var queue2 = queue2raw.replace(/§4/gi, '').replace(/§c/gi, '').replace(/§6/gi, '').replace(/§e/gi, '').replace(/§2/gi, '').replace(/§a/gi, '').replace(/§b/gi, '').replace(/§3/gi, '').replace(/§1/gi, '').replace(/§9/gi, '').replace(/§d/gi, '').replace(/§5/gi, '').replace(/§f/gi, '').replace(/§7/gi, '').replace(/§8/gi, '').replace(/§0/gi, '').replace(/§r/gi, '').replace(/§l/gi, '').replace(/§o/gi, '').replace(/§n/gi, '').replace(/§m/gi, '').replace(/§k/gi, '')

          channel1.setName('Players: ' + pingResult.players.online.toString() + ' / ' + pingResult.players.max.toString())
            .then(newChannel => {
              console.log(`Channel's new name is ${newChannel.name}`)
            })
            .catch(console.error)

          channel2.setName(queue1)
            .then(newChannel => {
              console.log(`Channel's new name is ${newChannel.name}`)
            })
            .catch(console.error)

          channel3.setName(queue2)
            .then(newChannel => {
              console.log(`Channel's new name is ${newChannel.name}`)
            })
            .catch(console.error)
        }
      })
    }
  }, 15000)
})

client.on('message', message => {
  if (message.author.id === '707442324958871594' /* Leees ID */ || message.author.id === '449812061514629139' /* Pistonmasters ID */) {
    if (message.content.startsWith('(setup ')) {
      var split = message.content.split(' ')

      if (client.guilds.resolve(message.guild).channels.resolve(split[1]) != null && client.guilds.resolve(message.guild).channels.resolve(split[2]) != null && client.guilds.resolve(message.guild).channels.resolve(split[3]) != null) {
        data.guild = message.guild.id
        data.channel1 = split[1]
        data.channel2 = split[2]
        data.channel3 = split[3]

        fs.writeFile('./data.json', JSON.stringify(data), function (err) {
          if (err) {
            console.log(err)
            message.reply('Sorry saving data went wrong.')
          } else {
            message.reply('Saved data. The playerdata will be sent to there.')
          }
        })
      } else {
        message.reply('Sorry it seems like that channel doesn\'t exist here.')
      }
    }
  }

  if (message.content.startsWith('(online')) {
    data = require('./data.json')

    if (data.guild !== null && data.channel1 != null && data.channel2 != null && data.channel3 != null) {
      mc.ping({
        host: config.host,
        port: config.port,
        version: config.version
      }, function (err, pingResult) {
        if (err) {
          console.log(err)
          message.reply('Sorry something went wrong. :(')
        } else {
          message.reply('Players on 6b6t.org: ' + pingResult.players.online.toString())
        }
      })
    }
  }

  if (message.content.startsWith('(motd')) {
    data = require('./data.json')

    if (data.guild !== null && data.channel1 != null && data.channel2 != null && data.channel3 != null) {
      mc.ping({
        host: config.host,
        port: config.port,
        version: config.version
      }, function (err, pingResult) {
        if (err) {
          console.log(err)
          message.reply('Sorry something went wrong. :(')
        } else {
          var motd = String(pingResult.description.text)

          motd = motd.replace(/§4/gi, '').replace(/§c/gi, '').replace(/§6/gi, '').replace(/§e/gi, '').replace(/§2/gi, '').replace(/§a/gi, '').replace(/§b/gi, '').replace(/§3/gi, '').replace(/§1/gi, '').replace(/§9/gi, '').replace(/§d/gi, '').replace(/§5/gi, '').replace(/§f/gi, '').replace(/§7/gi, '').replace(/§8/gi, '').replace(/§0/gi, '').replace(/§r/gi, '').replace(/§l/gi, '').replace(/§o/gi, '').replace(/§n/gi, '').replace(/§m/gi, '').replace(/§k/gi, '').replace('6b6t ', '')

          message.reply('Motd on 6b6t.org: ' + motd)
        }
      })
    }
  }

  if (message.content.startsWith('(ping')) {
    if (data.guild !== null && data.channel1 != null && data.channel2 != null && data.channel3 != null) {
      mc.ping({
        host: config.host,
        port: config.port,
        version: config.version
      }, function (err, pingResult) {
        if (err) {
          console.log(err)
          message.reply('Sorry something went wrong. :(')
        } else {
          var queue1raw = String(pingResult.players.sample[1].name)
          var queue2raw = String(pingResult.players.sample[2].name)

          var queue1 = queue1raw.replace(/§4/gi, '').replace(/§c/gi, '').replace(/§6/gi, '').replace(/§e/gi, '').replace(/§2/gi, '').replace(/§a/gi, '').replace(/§b/gi, '').replace(/§3/gi, '').replace(/§1/gi, '').replace(/§9/gi, '').replace(/§d/gi, '').replace(/§5/gi, '').replace(/§f/gi, '').replace(/§7/gi, '').replace(/§8/gi, '').replace(/§0/gi, '').replace(/§r/gi, '').replace(/§l/gi, '').replace(/§o/gi, '').replace(/§n/gi, '').replace(/§m/gi, '').replace(/§k/gi, '')
          var queue2 = queue2raw.replace(/§4/gi, '').replace(/§c/gi, '').replace(/§6/gi, '').replace(/§e/gi, '').replace(/§2/gi, '').replace(/§a/gi, '').replace(/§b/gi, '').replace(/§3/gi, '').replace(/§1/gi, '').replace(/§9/gi, '').replace(/§d/gi, '').replace(/§5/gi, '').replace(/§f/gi, '').replace(/§7/gi, '').replace(/§8/gi, '').replace(/§0/gi, '').replace(/§r/gi, '').replace(/§l/gi, '').replace(/§o/gi, '').replace(/§n/gi, '').replace(/§m/gi, '').replace(/§k/gi, '')

          const base64Image = pingResult.favicon.split(';base64,').pop()

          fs.writeFile('favicon.png', base64Image, { encoding: 'base64' }, function (err) {
            if (err) {
              console.log(err)
            }

            console.log('File created')
          })

          const favicon = new Discord.MessageAttachment('./favicon.png', 'favicon.png')
          const embed = new Discord.MessageEmbed()
            .setTitle('6b6t Status')
            .setColor('#3F47CC')
            .attachFiles(favicon)
            .setThumbnail('attachment://favicon.png')
            .addField('Players:', pingResult.players.online.toString() + ' / ' + pingResult.players.max.toString())
            .addField('Motd:', pingResult.description.text.replace(/§4/gi, '').replace(/§c/gi, '').replace(/§6/gi, '').replace(/§e/gi, '').replace(/§2/gi, '').replace(/§a/gi, '').replace(/§b/gi, '').replace(/§3/gi, '').replace(/§1/gi, '').replace(/§9/gi, '').replace(/§d/gi, '').replace(/§5/gi, '').replace(/§f/gi, '').replace(/§7/gi, '').replace(/§8/gi, '').replace(/§0/gi, '').replace(/§r/gi, '').replace(/§l/gi, '').replace(/§o/gi, '').replace(/§n/gi, '').replace(/§m/gi, '').replace(/§k/gi, '').replace('6b6t ', ''))
            .addField('Queue', queue1 + '\n' + queue2)
            .setAuthor('Pistonmaster', 'https://avatars0.githubusercontent.com/u/40795980?s=460&v=4', 'https://github.com/AlexProgrammerDE')
            .setFooter('6b6t Pinger', 'https://cdn.discordapp.com/app-icons/712245398269329511/404c1e5fee8870c35241de4241933cc3.png')
            .setURL('https://www.6b6t.org/')
            .setDescription('Some data about 6b6t.org.')
            .setTimestamp(Date.now())

          message.channel.send(embed)
        }
      })
    }
  }

  if (message.content.startsWith('(queue')) {
    data = require('./data.json')

    if (data.guild !== null && data.channel1 != null && data.channel2 != null && data.channel3 != null) {
      mc.ping({
        host: config.host,
        port: config.port,
        version: config.version
      }, function (err, pingResult) {
        if (err) {
          console.log(err)
          message.reply('Sorry something went wrong. :(')
        } else {
          var queue1raw = String(pingResult.players.sample[1].name)
          var queue2raw = String(pingResult.players.sample[2].name)

          var queue1 = queue1raw.replace(/§4/gi, '').replace(/§c/gi, '').replace(/§6/gi, '').replace(/§e/gi, '').replace(/§2/gi, '').replace(/§a/gi, '').replace(/§b/gi, '').replace(/§3/gi, '').replace(/§1/gi, '').replace(/§9/gi, '').replace(/§d/gi, '').replace(/§5/gi, '').replace(/§f/gi, '').replace(/§7/gi, '').replace(/§8/gi, '').replace(/§0/gi, '').replace(/§r/gi, '').replace(/§l/gi, '').replace(/§o/gi, '').replace(/§n/gi, '').replace(/§m/gi, '').replace(/§k/gi, '')
          var queue2 = queue2raw.replace(/§4/gi, '').replace(/§c/gi, '').replace(/§6/gi, '').replace(/§e/gi, '').replace(/§2/gi, '').replace(/§a/gi, '').replace(/§b/gi, '').replace(/§3/gi, '').replace(/§1/gi, '').replace(/§9/gi, '').replace(/§d/gi, '').replace(/§5/gi, '').replace(/§f/gi, '').replace(/§7/gi, '').replace(/§8/gi, '').replace(/§0/gi, '').replace(/§r/gi, '').replace(/§l/gi, '').replace(/§o/gi, '').replace(/§n/gi, '').replace(/§m/gi, '').replace(/§k/gi, '')

          message.reply('\n' + queue1 + '\n' + queue2)
        }
      })
    }
  }

  if (message.content.startsWith('(help')) {
    message.reply('These are my commands: (ping, (online, (motd' /* + ', (queue' */)
  }
})

client.login(secrets.token)
