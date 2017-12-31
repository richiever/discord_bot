const Discord = require("discord.js");
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
    client.user.setGame(`in ${client.guilds.size} servers | $help`)
  });

const prefix = "$"



client.on('guildMemberAdd', member => {
  member.send("welcome to the server!")
  });

client.on('message', msg => {
  if (msg.content === '$cat') {
    msg.reply('http://apopka-1x1yusplq.stackpathdns.com/wp-content/uploads/2017/10/persian-cats-and-kittens-1.jpg');
  }
  if (msg.content === '$christmas with paradox') {
    msg.reply('https://cdn.discordapp.com/attachments/381004839502741519/387135800715771904/Blank-background_-_Copy.jpg');
  }
  if (msg.content === '$dogs') {
    msg.reply('https://www.cesarsway.com/sites/newcesarsway/files/styles/large_article_preview/public/Common-dog-behaviors-explained.jpg?itok=FSzwbBoi');
  }
  if (msg.content === '$dat boi') {
    msg.reply('https://vignette.wikia.nocookie.net/meme/images/9/9a/Dat_boi.gif/revision/latest?cb=20161020213949');
  }
  if (msg.content === '$claydol') {
    msg.reply('http://i0.kym-cdn.com/photos/images/original/001/103/070/2d1.gif');
  }
  if (msg.content === '$pickachu') {
    msg.reply('http://www.pokestadium.com/sprites/xy/pikachu.gif http://www.pokestadium.com/sprites/xy/pikachu-f-3.gif');
  }
    if (msg.content === '$pokemon') {
      var replies = ["http://www.pokestadium.com/sprites/xy/pikachu.gif", "http://www.pokestadium.com/sprites/xy/rhyhorn.gif","http://www.pokestadium.com/sprites/xy/diglett.gif","http://www.pokestadium.com/sprites/xy/bulbasaur.gif","http://www.pokestadium.com/sprites/xy/arceus.gif","http://www.pokestadium.com/sprites/xy/pidgey.gif","http://www.pokestadium.com/sprites/xy/rattata.gif","http://www.pokestadium.com/sprites/xy/wurmple.gif","http://www.pokestadium.com/sprites/xy/beedrill.gif","http://www.pokestadium.com/sprites/xy/doduo.gif","http://www.pokestadium.com/sprites/xy/caterpie.gif","http://www.pokestadium.com/sprites/xy/weedle.gif","http://www.pokestadium.com/sprites/xy/abra.gif","http://www.pokestadium.com/sprites/xy/nidoranm.gif","http://www.pokestadium.com/sprites/xy/nidoranf.gif","http://www.pokestadium.com/sprites/xy/charmander.gif","http://www.pokestadium.com/sprites/xy/squirtle-2.gif","http://www.pokestadium.com/sprites/xy/raticate.gif",]
  var reply = replies[Math.floor(Math.random()* replies.length)]
  msg.reply(reply)
    }
    if (msg.content === '$help') {
      msg.reply('pokemon:catches a pokemon for you.\n pickachu:sends a pic of pickachu\n claydol:sends a pic of claydol\ndogs:sends a pic of a dog.\ndat boi:sends a pic of DaT BoI\npickachu:sends a pic of pickachu!\nkick:admin only! kicks someone\ncats:sends pic of a cat\nban:admin only!bans someone\nmute:admin only!mutes someone\npurge:(admin only!bulkdeletes loads of messages)\nchristmas with paradox: merry christmas with paradox!\nalso, make sure to join the offical paradox bot server!https://discord.gg/s7upEX3');
    }
});

client.on("message", async message => {
  let messageArray = message.content.split(" ");
  let command = messageArray[0];
  const args = messageArray.splice(1);
  if(!command.startsWith(prefix)) return;

  if(command === `${prefix}mute`) {
      const Discord = require('discord.js');
  const fs = require('fs');
  const embed2 = new Discord.RichEmbed()
  .setColor("#C0392B")
  .addField("Mute Command", `**ERROR:** You don't have permission to run this command!`)
  .setFooter("paradox - by richie");

  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send({embed: embed2});

      let reason = args.slice(1).join(" ");

      let role2 = message.guild.roles.find(r => r.name === "unmutable");



     let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
     const embed3 = new Discord.RichEmbed()
     .setColor("#C0392B")
     .addField("Mute Command", `**Usage:** $mute {user} {reason}`)
     .setFooter("paradox - by richie");

     if(!toMute) return message.reply({embed: embed3});
     const embed4 = new Discord.RichEmbed()
     .setColor("#C0392B")
     .addField("Mute Command", `**ERROR:** This user is unmutable!`)
     .setFooter("paradox Bot - by richie");

     if(toMute.roles.has(role2.id)) return message.reply({embed: embed4});


     const embed5 = new Discord.RichEmbed()
     .setColor("#C0392B")
     .addField("Mute Command", `**ERROR:** You cannot mute yourself!`)
     .setFooter("richie's Bot - by richie");
     if(toMute.id === message.author.id) return message.reply({embed: embed5});
     const embed1 = new Discord.RichEmbed()
     .setColor("#C0392B")
     .addField("Mute Command", `**ERROR:** You cannot mute a user that has a higher role than you!`)
     .setFooter("paradox Bot - by richie");
     if(toMute.highestRole.position >= message.member.highestRole.position) return message.reply({embed: embed1});
     if(!reason) return message.reply({embed: embed3});

     const embed = new Discord.RichEmbed()

     .setColor("#C0392B")
     .addField("Mute Command", `${toMute} has been muted!`)
     .addField("Reason", `${reason}`)

     .setFooter("paradox - by richie");
     message.channel.send({embed: embed});

      toMute.addRole(role);





     return;
  }
  if(command === `${prefix}kick`) {
   const Discord = require('discord.js');
 const embed2 = new Discord.RichEmbed()
 .setColor("#C0392B")
 .addField("Kick Command", `**ERROR:** You don't have permission to run this command!`)
 .setFooter("paradox - by richie");
 if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send({embed: embed2});

 let role = message.guild.roles.find(r => r.name === "unkickable");
 let reason = args.slice(1).join(' ');
 let user = message.guild.member(message.mentions.users.first());
 let toKick = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
 const embed3 = new Discord.RichEmbed()
 .setColor("#C0392B")
 .addField("Kick Command", `**ERROR:** This person is unkickable!`)
 .setFooter("paradox Bot - by richie");
 const embed1 = new Discord.RichEmbed()
 .setColor("#C0392B")
 .addField("Kick Command", `**Usage:** $kick {user} {reason}`)
 .setFooter("paradox - by richie");
if(!toKick) return message.reply({embed: embed1});
 if(user.roles.has(role.id)) return message.reply({embed: embed3});



 const embed5 = new Discord.RichEmbed()
 .setColor("#C0392B")
 .addField("Kick Command", `**ERROR:** You can't kick yourself!`)
 .setFooter("paradox - by richie");
 const embed6 = new Discord.RichEmbed()
 .setColor("#C0392B")
 .addField("Kick Command", `**ERROR:** You cannot kick someone that has a higher role than you!`)
 .setFooter("paradox - by richie");
 if(toKick.id === message.author.id) return message.reply({embed: embed5});
 if(toKick.highestRole.position >= message.member.highestRole.position) return message.reply({embed: embed6});
 if(reason.length < 1) return message.reply({embed: embed1});

 const embed = new Discord.RichEmbed()

 .setTitle("You have been kicked from the  Discord server!")

 .addField("Person that kicked you:", `${message.author.username}`)

 .addField("Reason:", `${reason}`)

 .setFooter("paradox - by richie");
  await bot.users.get(user.id).send({embed: embed});



 toKick.kick();

 message.reply(":white_check_mark: I have **kicked** the user!");




 return;

 }
 if(command === `${prefix}ban`) {
       const Discord = require('discord.js');
const embed2 = new Discord.RichEmbed()
.setColor("#C0392B")
.addField("Ban Command", `**ERROR:** You don't have permission to run this command!`)
.setFooter("paradox - by richie");
if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send({embed: embed2});
const embed1 = new Discord.RichEmbed()
.setColor("#C0392B")
.addField("Ban Command", `**Usage:** $ban {user} {reason}`)
.setFooter("paradox - by richie");
let reason = args.slice(1).join(' ');
let user = message.mentions.users.first();
let toBan = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
if(!toBan) return message.reply({embed: embed1});

if(toBan.highestRole.position >= message.member.highestRole.position) return message.reply("You cannot ban a user that **has a higher or has the same role as you!**");
if(toBan.id === message.author.id) return message.reply("you cannot ban yourself.");
if(reason.length < 1) return message.reply({embed: embed1});

const embed = new Discord.RichEmbed()

.setTitle("You have been kicked from the this Discord server!")

.addField("Person that banned you:", `${message.author.username}`)

.addField("Reason:", `${reason}`)

.setFooter("paradox - by richie");
await bot.users.get(user.id).send({embed: embed});



message.mentions.members.first().ban();

message.reply(":white_check_mark: This user has been banned!")

if (message.content == "$purge") {
    if (message.member.hasPermission("MANAGE_MESSAGES")) {
        message.channel.fetchMessages()
           .then(function(list){
                message.channel.bulkDelete(list);
            }, function(err){message.channel.send("ERROR: ERROR CLEARING CHANNEL.")})
    }
}


return;
 }
});

client.login(process.env.BOT_TOKEN);
