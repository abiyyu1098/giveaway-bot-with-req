const Discord = require('discord.js');
const client = new Discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
client.commands = new Discord.Collection();
const fs = require('fs');
const path = require('path');
const {
  GiveawaysManager
} = require("discord-giveaways");
const manager = new GiveawaysManager(client, {
  storage: "./giveaways.json",
  updateCountdownEvery: 5000,
  default: {
    botsCanWin: false,
    embedColor: "#ff0000",
    reaction: "🎁"
  }
});
const express = require('express');
const app = express();
app.get("/", (req, res) => {
  res.status(200).send({success: "true"});
});
app.listen(process.env.PORT || 3000);



client.giveawaysManager = manager;
fs.readdir('./commands/', (error, f) => {
  if (error) {
    return console.error(error);
  }
  let commands = f.filter(f => f.split('.').pop() === 'js');
  if (commands.length <= 0) {
    return console.log('no command!');
  }

  commands.forEach((f) => {
    let Command = require(`./commands/${f}`);
    console.log(`${f} Command run!`);
    client.commands.set(Command.help.name, Command);
  });
});

client.on("ready", async () => {
  console.log(`I am ${client.user.tag} by 1098team`)
})

client.on('message', message => {
  if (message.channel.type === 'dm') return;
  if (message.author.bot) {
    return;
  }
  if (!message.channel.permissionsFor(client.user).has('SEND_MESSAGES')) {
    return;
  }
  let prefix = "Ag!"
  if (!message.content.startsWith(prefix)) {
    return;
  }

  let args = message.content.slice(prefix.length).trim().split(/ +/g);
  let Command = args.shift();
  let cmd = client.commands.get(Command);

  if (!cmd) {
    return;
  }
  cmd.run(client, message, args);
  let date = new Date();
  console.log(`${message.author.username} | ${date} | Command : ${prefix}${Command} ${args.join(' ')}`)
})

client.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
  if (member.user.bot) return;
  let conditionRole;

  let conditionsRoles = require(path.resolve(path.join(__dirname + '/database/conditionRole.json')));
  if (conditionsRoles[giveaway.messageID]) {
    conditionRole = conditionsRoles[giveaway.messageID].conditionRole;
  }
  if (conditionRole != 'none') {
    if (member.roles.cache.find(r => r.id === conditionRole)) {
      member.send(
        new Discord.MessageEmbed()
        .setAuthor(member.user.tag, member.user.displayAvatarURL({
          format: 'png',
          dynamic: 'true'
        }))
        .setColor('YELLOW')
        .setDescription(`Your entry for [this giveaway](https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${giveaway.messageID}) has been approved. **Good luck !****support https://discord.gg/SrdzBuWawe**`)
        .setFooter(`Giveaway by ${reaction.message.author.tag}`)
        .setTimestamp()
      );
      return;
    } else {
      reaction.users.remove(member.id)
      let role = reaction.message.guild.roles.cache.find(r => r.id === conditionRole);
      member.send(
        new Discord.MessageEmbed()
        .setAuthor(member.user.tag, member.user.displayAvatarURL({
          format: 'png',
          dynamic: 'true'
        }))
        .setColor('RED')
        .setDescription(`Your entry for [this giveaway](https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${giveaway.messageID}) has been denied. To enter, you need the \`${role.name}\` role.support https://discord.gg/SrdzBuWawe`)
        .setFooter(`Giveaway by ${reaction.message.author.tag}`)
        .setTimestamp()
      );
      return;
    }
  }

});

/*
add a valid token of your bot!
*/

client.login('ODcyNTA5NDg4OTQxMzc5Njc0.YQq5yA.-7VN0v1k6aDUGaMG2Stc6qttIh8')
///// we re doing much videos about discord stuffs make sure to subscribe and join discord server (dont join and leave cuz we re baning them and we ll add soon anti alt bots !)
