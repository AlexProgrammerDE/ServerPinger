import { Client } from "discord.js";
import { NewPingResult, OldPingResult } from "minecraft-protocol";
import * as MinecraftProtocol from "minecraft-protocol";
import * as FS from "fs";
import * as DiscordTS from 'discord.js';

const Discord: typeof DiscordTS = require("discord.js");
const client: Client = new Discord.Client();
const secrets = require("./secrets.json");
const config = require("./config.json");
var mc: typeof MinecraftProtocol = require("minecraft-protocol");
const parseJSON = require('minecraft-protocol-chat-parser')(735).parseJSON

var data = require("./data.json");
var fs: typeof FS = require("fs");

client.on("ready", () => {
  if (client.user == null) return;

  console.log(`Logged in as ${client.user.tag}!`);

  client.user.setPresence({
    status: "online",
    activity: {
      type: "PLAYING",
      url: config.url,
      name: config.presence,
    },
  });

  setInterval(() => {
    data = require("./data.json");

    if (
      data.guild !== null &&
      data.channel1 != null &&
      data.channel2 != null &&
      data.channel3 != null
    ) {
      var guild = client.guilds.resolve(data.guild);
      if (guild == null) return;

      var channel1 = guild.channels.resolve(data.channel1);
      var channel2 = guild.channels.resolve(data.channel2);
      var channel3 = guild.channels.resolve(data.channel3);

      mc.ping(
        {
          host: config.host,
          port: config.port,
          version: config.version,
        },
        function (err, pingResult) {
          if (channel1 == null || channel2 == null || channel3 == null) return;
          if (!isNew(pingResult)) return;

          if (err) {
            console.log(err);
            channel1.setName("Players: 0");
            channel2.setName("Priority: 0");
            channel3.setName("Regular: 0");
          } else {
            var queue1raw = String(pingResult.players.sample[1].name);
            var queue2raw = String(pingResult.players.sample[2].name);

            var queue1 = stripColor(queue1raw);
            var queue2 = stripColor(queue2raw);

            channel1
              .setName(
                "Players: " +
                  pingResult.players.online.toString() +
                  " / " +
                  pingResult.players.max.toString()
              )
              .then((newChannel) => {
                console.log(`Channel's new name is ${newChannel.name}`);
              })
              .catch(console.error);

            channel2
              .setName(queue1)
              .then((newChannel) => {
                console.log(`Channel's new name is ${newChannel.name}`);
              })
              .catch(console.error);

            channel3
              .setName(queue2)
              .then((newChannel) => {
                console.log(`Channel's new name is ${newChannel.name}`);
              })
              .catch(console.error);
          }
        }
      );
    }
  }, config.interval);
});

client.on("message", (message) => {
  if (message.content.startsWith("(online")) {
    data = require("./data.json");

    if (
      data.guild !== null &&
      data.channel1 != null &&
      data.channel2 != null &&
      data.channel3 != null
    ) {
      mc.ping(
        {
          host: config.host,
          port: config.port,
          version: config.version,
        },
        function (err, pingResult) {
          if (!isNew(pingResult)) return;

          if (err) {
            console.log(err);
            message.reply("Sorry something went wrong. :(");
          } else {
            message.reply(
              "Players on " +
                config.host +
                ": " +
                pingResult.players.online.toString()
            );
          }
        }
      );
    }
  }

  if (message.content.startsWith("(motd")) {
    data = require("./data.json");

    if (
      data.guild !== null &&
      data.channel1 != null &&
      data.channel2 != null &&
      data.channel3 != null
    ) {
      mc.ping(
        {
          host: config.host,
          port: config.port,
          version: config.version,
        },
        function (err, pingResult) {
          if (!isNew(pingResult)) return;

          if (err) {
            console.log(err);
            message.reply("Sorry something went wrong. :(");
          } else {
            var motd = stripColor(parseJSON(pingResult.description)).replace(config.servername + " ", "");

            message.reply("Motd on " + config.host + ": " + motd);
          }
        }
      );
    }
  }

  if (message.content.startsWith("(ping")) {
    if (
      data.guild !== null &&
      data.channel1 != null &&
      data.channel2 != null &&
      data.channel3 != null
    ) {
      mc.ping(
        {
          host: config.host,
          port: config.port,
          version: config.version,
        },
        function (err, pingResult) {
          if (!isNew(pingResult)) return;

          if (err) {
            console.log(err);
            message.reply("Sorry something went wrong. :(");
          } else {
            var queue1raw = String(pingResult.players.sample[1].name);
            var queue2raw = String(pingResult.players.sample[2].name);

            var queue1 = stripColor(queue1raw);
            var queue2 = stripColor(queue2raw);

            const base64Image = pingResult.favicon.split(";base64,").pop();

            if (base64Image == undefined) return;

            fs.writeFile(
              "favicon.png",
              base64Image,
              { encoding: "base64" },
              function (err) {
                if (err) {
                  console.log(err);
                }

                console.log("File created");
              }
            );

            const favicon = new Discord.MessageAttachment(
              "./favicon.png",
              "favicon.png"
            );
            const embed = new Discord.MessageEmbed()
              .setTitle(config.servername + " Status")
              .setColor("#3F47CC")
              .setThumbnail("attachment://favicon.png")
              .addField(
                "Players:",
                pingResult.players.online.toString() +
                  " / " +
                  pingResult.players.max.toString()
              )
              .addField(
                "Motd:",
                stripColor(parseJSON(pingResult.description)).replace(
                  config.servername + " ",
                  ""
                )
              )
              .addField("Queue", queue1 + "\n" + queue2)
              .setAuthor(
                "Pistonmaster",
                "https://avatars0.githubusercontent.com/u/40795980?s=460&v=4",
                "https://github.com/AlexProgrammerDE"
              )
              .setFooter(
                "Server Pinger",
                "https://cdn.discordapp.com/app-icons/712245398269329511/404c1e5fee8870c35241de4241933cc3.png"
              )
              .setURL(config.url)
              .setDescription(config.description)
              .setTimestamp(Date.now());

            message.channel.send({embed, files: [favicon]});
          }
        }
      );
    }
  }

  if (message.content.startsWith("(queue")) {
    data = require("./data.json");

    if (
      data.guild !== null &&
      data.channel1 != null &&
      data.channel2 != null &&
      data.channel3 != null
    ) {
      mc.ping(
        {
          host: config.host,
          port: config.port,
          version: config.version,
        },
        function (err, pingResult) {
          if (!isNew(pingResult)) return;
          
          if (err) {
            console.log(err);
            message.reply("Sorry something went wrong. :(");
          } else {
            var queue1raw = String(pingResult.players.sample[1].name);
            var queue2raw = String(pingResult.players.sample[2].name);

            var queue1 = stripColor(queue1raw);
            var queue2 = stripColor(queue2raw);

            message.reply("\n" + queue1 + "\n" + queue2);
          }
        }
      );
    }
  }

  if (message.content.startsWith("(help")) {
    message.reply("This are my commands: (ping, (online, (motd, (queue");
  }
});

function stripColor(message: string): string {
  return message
    .replace(/§4/gi, "")
    .replace(/§c/gi, "")
    .replace(/§6/gi, "")
    .replace(/§e/gi, "")
    .replace(/§2/gi, "")
    .replace(/§a/gi, "")
    .replace(/§b/gi, "")
    .replace(/§3/gi, "")
    .replace(/§1/gi, "")
    .replace(/§9/gi, "")
    .replace(/§d/gi, "")
    .replace(/§5/gi, "")
    .replace(/§f/gi, "")
    .replace(/§7/gi, "")
    .replace(/§8/gi, "")
    .replace(/§0/gi, "")
    .replace(/§r/gi, "")
    .replace(/§l/gi, "")
    .replace(/§o/gi, "")
    .replace(/§n/gi, "")
    .replace(/§m/gi, "")
    .replace(/§k/gi, "");
}

function isNew(object: any): object is NewPingResult {
  return "players" in object;
}

client.login(secrets.token);
