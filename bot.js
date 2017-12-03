// require the discord.js module
const Discord = require('discord.js');
const YTDL = require('ytdl-core');
const Util = Discord.Util;
const YoutubeSearcher = require('youtube-search');
const fs = require('fs');

// create a new Discord client
const client = new Discord.Client();


function play(connection, message) {
  var server = servers[message.guild.id];

  server.dispatcher = connection.playStream(YTDL(server.queue[0],{filter: "audioonly"}));

  server.queue.shift();

  server.dispatcher.on("end", function() {
    if (server.queue[0]) play(connection, message);
    else connection.disconnect();
  })
}

client.on('ready', () => {
    client.user.setPresence({game: {name: "in a large galaxy, --help", type: 3}});
    console.log('Ready!');
});

// if you're actually trying to get ahold of my token, it won't work. Happened once already >:(
var key = process.env.secret_key;
var servers = {};
var prefix = "--";
var opts = {
  maxResults: 1,
  key: 'AIzaSyDm8CoTi5AAspabCDOfOrp4aAlKZIlrLyM',
  kind: "youtube#video"
};


client.on('message', async message => {
    if(message.channel.type === 'dm')
    {
      if(!message.author.bot) return message.reply("You cant use me in PM.");
    }
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    console.log(message.author.username + ": " + message.content);

    if (message.content === 'you suck') {
      return message.channel.send('well you swallow LMAOOOOOOOOOOOOOOO');
    }
    if (message.content.startsWith(prefix))
    {

      if (command === 'ping') {
        return message.channel.send(`Pong! - ${Math.round(client.ping)} ms`);
      }

      else if(command === 'help'){
        console.log('reached line 31');
        let help_embed = new Discord.RichEmbed()
            .setTitle("Help")
            .setDescription("Welcome to the new version of Andromeda, a powerful bot, Andromeda 2.0. Made by child#4068")
            .addField("Prefix", "The prefix is: --")
            .addField("help", "The Help Command")
            .addField("ping", "Replies with the bot's ping")
            .addField("kick", "Kick a certain user(admin only)")
            .addField("avatar", "Shows your avatar. @'ing someone will output nothing")
            .addField("prune", "prunes an amount of messages, requires a integer (admin only)")
            .addField("ban", "Bans a person from the server (admin only)")
            .addField("you suck (no prefix)", "says 'well you swallow'")
            //.addField("play", "Plays music! Requires a youtube link of any sort")
            //.addField("stop", "Stops music")
            //.addField("skip", "Skips music")
            .setColor("#0000FF")
        return message.channel.send({ embed: help_embed });
      }

      else if (command === 'avatar') {
      if (!message.mentions.users.size) {
        let avatar_embed = new Discord.RichEmbed()
            .setAuthor("Your avatar: ")
            .setDescription(`Your avatar:`)
            .setColor("#0000FF")
            return message.channel.send(`${message.author.displayAvatarURL}`, {embed: avatar_embed});
      }

      // ...
  }

      if (command ==="kick") {
        let allowedRole = message.member.hasPermission("ADMINISTRATOR");
        if (!allowedRole) {
          return message.reply("You don't have the correct permissions to run this command! :hushed:");
        }
          if (!message.mentions.users.size) {
              return message.reply('You need to tag a user in order to kick them!');
            }
          let reason = args.slice(1).join(" ");
          // Easy way to get member object though mentions.
          var member= message.mentions.members.first();
          // Kick
          member.kick(reason).then((member) => {
              // Successmessage
              let kick_embed = new Discord.RichEmbed()
                  .setAuthor("Succesfully Kicked!")
                  .setDescription(":wave: " + member.displayName + " has been successfully kicked :point_right: ")
                  .setColor("#0000FF")
              return message.channel.sendEmbed(kick_embed);
          }).catch((err) => {
            console.log(err);
               // Failmessage
              return message.channel.send("Access Denied");
          });
      }

      if (command ==="ban") {
        let allowedRole = message.member.hasPermission("ADMINISTRATOR");
        if (!allowedRole) {
          return message.reply("You don't have the correct permissions to run this command! :hushed:");
        }
          if (!message.mentions.users.size) {
              return message.reply('You need to tag a user in order to ban them!');
            }

          let reason = args.slice(1).join(" ");
          // Easy way to get member object though mentions.
          var member= message.mentions.members.first();
          // Kick
          member.ban(reason).then((member) => {
              // Successmessage
              let ban_embed = new Discord.RichEmbed()
                  .setAuthor("Succesfully Kicked!")
                  .setDescription(":wave: " + member.displayName + " has been successfully banned :point_right: ")
                  .setColor("#0000FF")
              return message.channel.sendEmbed(ban_embed);
          }).catch(() => {
               // Failmessage
              return message.channel.send("Access Denied");
          });
      }

      if (command === "prune") {
        let allowedRole = message.member.hasPermission("ADMINISTRATOR");
        if (!allowedRole) {
          return message.reply("You don't have the correct permissions to run this command! :hushed:");
        }
        try {
          let messagecount = args.slice(1).join(" ");
          message.channel.fetchMessages({limit: messagecount}).then(messages => message.channel.bulkDelete(messages));;
        } catch (e) {
          message.channel.send("Could not prune. Are you trying to prune messages older than 14 days?");
        }
    }

    if (command == "invite")
    {
      message.reply("You want to invite me to your server? Nice! Use this link: https://discordapp.com/oauth2/authorize?client_id=378677177413009408&scope=bot&permissions=2146958591");
    }

    if (command ==='play')
    {
      let link = args[0];

      if (!link)
      {
        return message.reply("Please provide a link");
      }

      if (!message.member.voiceChannel)
      {
        return message.reply("Please join a voice channel!");
      }

      if (!servers[message.guild.id])
      {
         servers[message.guild.id] = {queue: []};
      }
      var server = servers[message.guild.id];

      server.queue.push(link);

      if (!message.guild.voiceConnection)
      {
        message.member.voiceChannel.join().then(function(connection){
          play(connection, message);
        });
      }

      // let video_arg = args[0];
      // console.log(video_arg);
      // let link;
      // let videoID;

      // console.log("passed 167");
      // if (!video_arg)
      // {
      //   return message.channel.send("Please provide a link / search term of a video.");
      // }
      // console.log("passed 171");
      // YoutubeSearcher(video_arg, opts, function(err, results) {
      //   if(err) return console.log(err);
      //   console.log("passed 174");
      //   // finds id of video
      //   console.dir(results[0].id);
      //   videoID = results[0].id;

      //   // find link of video
      //   console.dir(results[0].link);
      //   link = results[0].link[0];
      // });

       const songsInfo = await YTDL.getInfo(link);
       console.log("passed 187");
       console.log("passed 185");
       const songs = {
         title: Util.escapeMarkdown(songsInfo.title),
         description: Util.escapeMarkdown(songsInfo.description),
         url: link,
         thumbnail: `https://i.ytimg.com/vi/` + videoID + `/hqdefault.jpg`
       };

       let play_embed = new Discord.RichEmbed()
           .setAuthor("Music")
           .addField("Title", `${songs.title}`)
           .addField("Description", `${songs.description}`)
      message.channel.send("Thumbnail: " + `${songs.thumbnail}`)
      return message.channel.send(play_embed);


    }

    if (command === "skip")
    {
      var server = servers[message.guild.id];
      if(server.dispatcher) server.dispatcher.end();
    }

    if (command === "stop")
    {
      var server = servers[message.guild.id];
      if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
    }

}
});

client.on("guildMemberAdd", (guild, member, user) => {

    // Send the message to a designated channel on a server:
    var channel = member.guild.channels.find('name', 'join-log');
    // Do nothing if the channel wasn't found on this server
    if (!channel)
    {
      return;
    }
    // Send the message, mentioning the member
    channel.send(`Welcome to the server, ${member}!`);


});


// login to Discord with your app's token
client.login(key);
