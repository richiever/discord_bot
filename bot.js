// require the discord.js module
const Discord = require('discord.js');

// create a new Discord client
const client = new Discord.Client();

client.on('ready', () => {
    console.log('Ready!');
});

// if you're actually trying to get ahold of my token, it won't work. Happened once already >:(
var key = process.env.secret_key;

var prefix == "--";


client.on('message', message => {
    client.user.setGame('in a very large galaxy | --help');
    const args = message.content.slice("--").trim().split(/ +/g);
    console.log(message.author.username + ": " + message.content);

    if (message.content === '--ping') {
      message.channel.send('Pong!');
    }

    else if (message.content === 'you suck') {
      message.channel.send('well you swallow LMAOOOOOOOOOOOOOOO');
    }

    else if(message.content === prefix + 'help'){
      let embed = new Discord.RichEmbed()
          .setAuthor("Help")
          .setDescription("Welcome to the new version of Andromeda, a powerful bot, Andromeda 2.0. Made by Aritro Is Cool#4068 \n The prefix is: -- \n Commands: --help = Help command \n --ping = Pong! \n --kick = Kick (admin only) \n --avatar = Shows your avatar \n --prune = prunes someone \n you suck (no prefix) = well you swallow")
          .setColor("#0000FF");
      message.channel.sendEmbed(embed);
    }

    else if (message.content === prefix +'avatar') {
    if (!message.mentions.users.size) {
      let embed = new Discord.RichEmbed()
          .setAuthor("Your avatar: ")
          .setDescription(`Your avatar:`)
          .setColor("#0000FF");
      message.channel.sendEmbed(embed);
      message.channel.send(`${message.author.displayAvatarURL}`);
    }
    // ...
}

    if (message.content.startsWith(prefix + "kick")) {
      let allowedRole = message.member.hasPermission("KICKMEMBER");
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
            let embed = new Discord.RichEmbed()
                .setAuthor("Succesfully Kicked!")
                .setDescription(":wave: " + member.displayName + " has been successfully kicked :point_right: ")
                .setColor("#0000FF");
            message.channel.sendEmbed(embed);
        }).catch(() => {
             // Failmessage
            message.channel.send("Access Denied");
        });
    }

    if (message.content.startsWith(prefix + "ban")) {
      let allowedRole = message.member.hasPermission("BANMEMBER");
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
            let embed = new Discord.RichEmbed()
                .setAuthor("Succesfully Kicked!")
                .setDescription(":wave: " + member.displayName + " has been successfully banned :point_right: ")
                .setColor("#0000FF");
            message.channel.sendEmbed(embed);
        }).catch(() => {
             // Failmessage
            message.channel.send("Access Denied");
        });
    }

    if (message.content.startsWith(prefix + "prune")) {
      let allowedRole = message.member.hasPermission("MANAGEMESSAGES");
      if (!allowedRole) {
        return message.reply("You don't have the correct permissions to run this command! :hushed:");
      }
      try {
        let messagecount = args.slice(1).join(" ");
        message.channel.fetchMessages({limit: messagecount}).then(messages => message.channel.bulkDelete(messages));
        message.channel.send("Pruned succesfully");
        message.delete(1);
      } catch (e) {
        message.channel.send("Could not prune. Are you trying to prune messages older than 14 days?");
      }
  }


});

// login to Discord with your app's token
client.login(key);
