// Calling Packages
const Discord = require('discord.js');
const bot = new Discord.Client();
const weather = require('weather-js'); // Make sure you call the packages you install.
const fs = require('fs')

// Global Settings
const prefix = '~'; // This is the prefix, you can change it to whatever you want.

// Functions
function hook(channel, title, message, color, avatar) { // This function uses quite a few options. The last 2 are optional.

    // Reassign default parameters - If any are blank.
    if (!channel) return console.log('Channel not specified.');
    if (!title) return console.log('Title not specified.');
    if (!message) return console.log('Message not specified.');
    if (!color) color = 'd9a744'; // This is an optional variable. Therefore the default HEX color will be whatever you post there. Mine will be d9a744
    if (!avatar) avatar = 'https://cdn.discordapp.com/attachments/381022066847121428/385657906189828107/download_1.png' // This is also an optional variable, you can change the default to any icon.

    // We want to remove spaces from color & url, since they might have it on the sides.
    color = color.replace(/\s/g, '');
    avatar = avatar.replace(/\s/g, '');

    // This is the start of creating the webhook
    channel.fetchWebhooks() // This gets the webhooks in the channel
        .then(webhook => {

            // Fetches the webhook we will use for each hook
            let foundHook = webhook.find('name', 'Webhook'); // You can rename 'Webhook' to the name of your bot if you like, people will see if under the webhooks tab of the channel.

            // This runs if the webhook is not found.
            if (!foundHook) {
                channel.createWebhook('Webhook', 'https://cdn.discordapp.com/attachments/381022066847121428/385657906189828107/download_1.png') // Make sure this is the same thing for when you search for the webhook. The png image will be the default image seen under the channel. Change it to whatever you want.
                    .then(webhook => {
                        // Finally send the webhook
                        webhook.send('', {
                            "username": title,
                            "avatarURL": avatar,
                            "embeds": [{
                                "color": parseInt(`0x${color}`),
                                "description":message
                            }]
                        })
                            .catch(error => { // We also want to make sure if an error is found, to report it in chat.
                                console.log(error);
                                return channel.send('**Something went wrong when sending the webhook. Please check console(contact owner).**');
                            })
                    })
            } else { // That webhook was only for if it couldn't find the original webhook
                foundHook.send('', { // This means you can just copy and paste the webhook & catch part.
                    "username": title,
                    "avatarURL": avatar,
                    "embeds": [{
                        "color": parseInt(`0x${color}`),
                        "description":message
                    }]
                })
                    .catch(error => { // We also want to make sure if an error is found, to report it in chat.
                        console.log(error);
                        return channel.send('**Something went wrong when sending the webhook. Please check console(contact owner).**');
                    })
                }

        })

}

// Listener Event: Runs whenever a message is received.
bot.on('message', message => {

    // Variables - Variables make it easy to call things, since it requires less typing.
    let msg = message.content.toUpperCase(); // This variable takes the message, and turns it all into uppercase so it isn't case sensitive.
    let sender = message.author; // This variable takes the message, and finds who the author is.
    let cont = message.content.slice(prefix.length).split(" "); // This variable slices off the prefix, then puts the rest in an array based off the spaces
    let args = cont.slice(1); // This slices off the command in cont, only leaving the arguments.

    // Commands

    // Ping
    if (msg === prefix + 'PING') { // This checks if msg (the message but in all caps), is the same as the prefix + the command in all caps.

        // Now, let's send a response.
        message.channel.send('Ping!'); // This 'sends' the message to the channel the message was in. You can change what is in the message to whatever you want.

    }

    // Purge
    if (msg.startsWith(prefix + 'PURGE')) { // This time we have to use startsWith, since we will be adding a number to the end of the command.
        // We have to wrap this in an async since awaits only work in them.
        async function purge() {
            message.delete(); // Lets delete the command message, so it doesnt interfere with the messages we are going to delete.

            // Now, we want to check if the user has the `bot-commander` role, you can change this to whatever you want.
            if (!message.member.hasPermission("MANAGE_MESSAGES")) {  // This checks to see if they DONT have it, the "!" inverts the true/false
                message.channel.send('You need to be able to manage messages  to use this command.'); // This tells the user in chat that they need the role.
                return; // this returns the code, so the rest doesn't run.
            }

            // We want to check if the argument is a number
            if (isNaN(args[0])) {
                // Sends a message to the channel.
                message.channel.send('Please use a number as your arguments. \n Usage: ' + prefix + 'purge <amount>'); //\n means new line.
                // Cancels out of the script, so the rest doesn't run.
                return;
            }

            const fetched = await message.channel.fetchMessages({limit: args[0]}); // This grabs the last number(args) of messages in the channel.
            console.log(fetched.size + ' messages found, deleting...'); // Lets post into console how many messages we are deleting

            // Deleting the messages
            message.channel.bulkDelete(fetched)
                .catch(error => message.channel.send(`Error: ${error}`)); // If it finds an error, it posts it into the channel.

        }

        // We want to make sure we call the function whenever the purge command is run.
        purge(); // Make sure this is inside the if(msg.startsWith)

    }

    // Weather Command - We're going to need a new package for this, so open up the console again.
    // Lets make a basic version of this, then make it look good.

    if (msg.startsWith(prefix + 'WEATHER')) { // This checks to see if the beginning of the message is calling the weather command.
        // You can find some of the code used here on the weather-js npm page in the description.

        weather.find({search: args.join(" "), degreeType: 'F'}, function(err, result) { // Make sure you get that args.join part, since it adds everything after weather.
            if (err) message.channel.send(err);

            // We also want them to know if a place they enter is invalid.
            if (result === undefined || result.length === 0) {
                message.channel.send('**Please enter a valid location.**') // This tells them in chat that the place they entered is invalid.
                return; // This exits the code so the rest doesn't run.
            }

            // Variables
            var current = result[0].current; // This is a variable for the current part of the JSON output
            var location = result[0].location; // This is a variable for the location part of the JSON output

            // Let's use an embed for this.
            const embed = new Discord.RichEmbed()
                .setDescription(`**${current.skytext}**`) // This is the text of what the sky looks like, remember you can find all of this on the weather-js npm page.
                .setAuthor(`Weather for ${current.observationpoint}`) // This shows the current location of the weather.
                .setThumbnail(current.imageUrl) // This sets the thumbnail of the embed
                .setColor(0x00AE86) // This sets the color of the embed, you can set this to anything if you look put a hex color picker, just make sure you put 0x infront of the hex
                .addField('Timezone',`UTC${location.timezone}`, true) // This is the first field, it shows the timezone, and the true means `inline`, you can read more about this on the official discord.js documentation
                .addField('Degree Type',location.degreetype, true)// This is the field that shows the degree type, and is inline
                .addField('Temperature',`${current.temperature} Degrees`, true)
                .addField('Feels Like', `${current.feelslike} Degrees`, true)
                .addField('Winds',current.winddisplay, true)
                .addField('Humidity', `${current.humidity}%`, true)

                // Now, let's display it when called
                message.channel.send({embed});
        });
    }

    // This episode will be going over the hook command.
    if (msg.startsWith(prefix + 'HOOK')) { // We are using a .startsWith because the command will have arguments.

        // Delete the message that the user sends
        message.delete();

        if (msg === prefix + 'HOOK') { // This checks if the only thing they sent was 'Hook'
            return hook(message.channel, 'Hook Usage', `${prefix}hook <title>, <message>, [HEXcolor], [avatarURL]\n\n**<> is required\n[] is optional**`,'FC8469','https://cdn.discordapp.com/attachments/381022066847121428/385657906189828107/download_1.png') // Remeber that \n means new line. This is also using a custom HEX id, and an image.
        }

        let hookArgs = message.content.slice(prefix.length + 4).split(","); // This slices the first 6 letters (prefix & the word hook) then splits them by 'commas'

        hook(message.channel, hookArgs[0], hookArgs[1], hookArgs[2], hookArgs[3]); // This is where it actually calls the hook.
    }
});
bot.on('message', msg => {
if (msg.content === '~help') {
    msg.reply("\n\n__~hook__\n\n```hooks a message```\n\n__~weather__\n\n```shows the weather```\n\n__~purge <Amount>__\n\n```(admin only)Destroys the amount of messages you like!```\n\nfun commands!!!:pokemon:catches a pokemon for you.\n pickachu:sends a pic of pickachu\n claydol:sends a pic of claydol\ndogs:sends a pic of a dog.\ndat boi:sends a pic of cat\npickachu:sends a pic of dAT BOI.\nthose are the commands.\n\n__admin commands__\n\nkick:admin only! kicks someone\nban:admin only!bans someone\nmute:admin only!mutes someone\n\n__how do I get the bot?__\n\n```the bot has many features that the reglar version does not have. anyone can get it. all you have to do is become a patron. head to this link to check my patreon:\n ```https://www.patreon.com/richieroblox")
  }
  if (msg.content === '~cats') {
    msg.reply('http://apopka-1x1yusplq.stackpathdns.com/wp-content/uploads/2017/10/persian-cats-and-kittens-1.jpg');
  }
  if (msg.content === '~dog') {
    msg.reply('https://www.cesarsway.com/sites/newcesarsway/files/styles/large_article_preview/public/Common-dog-behaviors-explained.jpg?itok=FSzwbBoi');
  }
  if (msg.content === '~dat boi') {
    msg.reply('https://vignette.wikia.nocookie.net/meme/images/9/9a/Dat_boi.gif/revision/latest?cb=20161020213949');
  }
  if (msg.content === '~claydol') {
    msg.reply('http://i0.kym-cdn.com/photos/images/original/001/103/070/2d1.gif');
  }
  if (msg.content === '~dinosaurs') {
    msg.reply('https://media.giphy.com/media/mTrUbEjM1Agta/giphy.gif');
  }
  if (msg.content === '~pikachu') {
    msg.reply('http://www.pokestadium.com/sprites/xy/pikachu.gif http://www.pokestadium.com/sprites/xy/pikachu-f-3.gif');
  }
    if (msg.content === '~pokemon') {
      var replies = ["http://www.pokestadium.com/sprites/xy/pikachu.gif", "http://www.pokestadium.com/sprites/xy/rhyhorn.gif","http://www.pokestadium.com/sprites/xy/diglett.gif","http://www.pokestadium.com/sprites/xy/bulbasaur.gif","http://www.pokestadium.com/sprites/xy/arceus.gif","http://www.pokestadium.com/sprites/xy/pidgey.gif","http://www.pokestadium.com/sprites/xy/rattata.gif","http://www.pokestadium.com/sprites/xy/wurmple.gif","http://www.pokestadium.com/sprites/xy/beedrill.gif","http://www.pokestadium.com/sprites/xy/doduo.gif","http://www.pokestadium.com/sprites/xy/caterpie.gif","http://www.pokestadium.com/sprites/xy/weedle.gif","http://www.pokestadium.com/sprites/xy/abra.gif","http://www.pokestadium.com/sprites/xy/nidoranm.gif","http://www.pokestadium.com/sprites/xy/nidoranf.gif","http://www.pokestadium.com/sprites/xy/charmander.gif","http://www.pokestadium.com/sprites/xy/squirtle-2.gif","http://www.pokestadium.com/sprites/xy/raticate.gif",]
  var reply = replies[Math.floor(Math.random()* replies.length)]
  msg.reply(reply)
    }
if (msg.content === '~meme') {
    var replies = ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5ZVlMS3Y0Gn98xTngYJBZgIV6CpT3T4tb8W4jxAG7DMhv7aXf","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzFiPO-o0Q1G_IL5Mocig-NV6QGukU96A5GvNPXRbvhiKkiabh","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzFiPO-o0Q1G_IL5Mocig-NV6QGukU96A5GvNPXRbvhiKkiabh","http://quotesnhumor.com/wp-content/uploads/2015/08/Top-50-Funniest-Memes-Collection-memes-hilarious.jpg","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiOe-QCjk9amyy4pwYW78z1ZEUBPlyLYhYffdl58Z0g_6XlW_aZQ"]
var reply = replies[Math.floor(Math.random()* replies.length)]
msg.reply(reply)
  }

});

bot.on("message", async message => {
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
     .addField("Mute Command", `**Usage:** ~mute {user} {reason}`)
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
     .addField("Mute Command", `${toMute} has been mute!`)
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
 .addField("Kick Command", `**Usage:** ~kick {user} {reason}`)
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
.addField("Ban Command", `**Usage:** ~ban {user} {reason}`)
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




return;
 }
});

// Listener Event: Runs whenever the bot sends a ready event (when it first starts for example)
bot.on('ready', () => {

    // We can post into the console that the bot launched.
    console.log('Bot started.');
    bot.user.setGame("~help");
});

bot.login(process.env.BOT_TOKEN);
