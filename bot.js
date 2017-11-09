// require the discord.js module
const Discord = require('discord.js');

// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will trigger whenever your bot:
// - finishes logging in
// - reconnects after disconnecting
client.on('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    const args = message.content.slice("--").trim().split(/ +/g);
    console.log(message.author.username + ": " + message.content);

    if (message.content === '--ping') {
      message.channel.send('Pong!');
    }

    else if(message.content === '--help'){
      message.channel.send('Hello user! Commands: >help = Help command, >ping = Pong!, >kick = Kick (admin only), >avatar = Shows your avatar, ');
    }

    else if (message.content === '--avatar') {
    if (!message.mentions.users.size) {
        return message.channel.send(`Your avatar: ${message.author.displayAvatarURL}`);
    }

    else if (message.content === '--user-info') {
        message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
  }

    // ...
}

    if (message.content.startsWith("--kick")) {

      let allowedRole = message.guild.roles.find("name", "rolename");
      if (!message.member.roles.has(allowedRole.id) {
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
            message.channel.send(":wave: " + member.displayName + " has been successfully kicked :point_right: ");
        }).catch(() => {
             // Failmessage
            message.channel.send("Access Denied");
        });
    }

    if (message.content.startsWith("--ban")) {
      if (!message.member.roles.has(allowedRole.id) {
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
            message.channel.send(":wave: :hammer:" + member.displayName + " has been successfully banned! :hammer:");
        }).catch(() => {
             // Failmessage
            message.channel.send("Access Denied");
        });
    }

    if (message.content.startsWith("--prune")) {
      if (!message.member.roles.has(allowedRole.id) {
        return message.reply("You don't have the correct permissions to run this command! :hushed:");
      }
      try {
        let messagecount = args.slice(1).join(" ");
        message.channel.fetchMessages({limit: messagecount}).then(messages => message.channel.bulkDelete(messages));
        message.channel.send("Pruned succesfully");
      } catch (e) {
        message.channel.send("Could not prune. Are you trying to prune messages older than 14 days?");
      }
  }


});

// login to Discord with your app's token
client.login('MzQ3NDg0ODY0ODI5ODQ5NjAw.DOPqEw.lALIn95WK-MDzk5fhydjIKIjhBg');
