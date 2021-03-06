require('dotenv').load();
const Discord = require("discord.js");
const client = new Discord.Client();
const app = require("express")();
const http = require("http");
const fs = require('fs');
const options = require('./config/options')

// initialization
client.login(options.token); 

client.data = {};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`); 
  client.user.setActivity(options.activity.game, { type: options.activity.type }) 
  .catch(console.error);

  // retrieve guild data
    // get stored data
    fs.readFile('data.json', 'utf-8', function (err, data) { 
      if (err) console.error(err) 

      client.data = JSON.parse(data);

      // check for any addl. guild data
      client.guilds.array().forEach(guild => {
        if(!client.data[guild.id]) {
          client.data[guild.id] = {
            admin: [],
            custom: [],
            options: {
              prefix: process.env.PREFIX
            },
            roles: [],
            users: []
          }
        }
      })

      //rewrite updated data to file
      fs.writeFile('data.json', JSON.stringify(client.data), (err) => {
        if (err) console.error(err);
      });
    })
});

// configuration
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands');

// add commands to list
for (const commandFolder of commandFiles) {
  //search through each folder
  if(!commandFolder.includes('.DS_Store')) {
    const folder = fs.readdirSync(`./commands/${commandFolder}`);
    for(const file of folder) {
      if(file.includes('disabled')) continue
      const command = require(`./commands/${commandFolder}/${file}`);
      client.commands.set(command.name, command);
    }
  }
}

// update stored client state
client.writeData = function (data) {
  console.log('Data updated.')
  return new Promise((resolve,reject) => {
    fs.writeFile('data.json', JSON.stringify(data), (err) => {
      if (err) reject(err)
      else resolve(true)
    });
  })
}

// add empty guild data
client.addGuild = function(guildID) {
  if(!client.data[guildID]) {
    client.data[guildID] = {
      admin: [],
      custom: [],
      options: {
        prefix: process.env.PREFIX
      },
      roles: [],
      users: []
    }
  }

  // rewrite updated data to file
  client.writeData(data)
}

// get role data
client.getRoleID = function(server, role, global) {
  // find role id for server
  if(global) return (client.guilds.find(guild=>guild.id===server).roles.find(r=>r.name.toLowerCase() === role) || client.guilds.find(guild=>guild.id===server).roles.find(r=>r.id === role) || { id: null }).id;
  // find role id from roles list
  return (client.data[server].roles.find(r=>r.name.toLowerCase() === role) || client.data[server].roles.find(r=>r.id === role) || { id: null }).id;
}

// provide help
client.help = function(msg, command) {
  const prefix = msg.prefix
  // find command in question
  const helpCmd = client.commands.find(cmd => cmd.name === command.args.join(" ")) ||  client.commands.find(cmd => cmd.aliases.includes(command.args.join(" ")))
  // find help for a specific command
  if(helpCmd && helpCmd.category !== 'dev') {
    msg.channel.sendMsgEmbed(`**__HELP:__**
                    \nCommand: \`${prefix}${helpCmd.name}\`
                    \nDescription: ${helpCmd.description}
                    \nUsage: \`${prefix}${helpCmd.usage}\`
                    \nAliases: \`${(helpCmd.aliases.join(", ")||'None')}\``)
    // find list of commands
  } else {
    const commandList = (function() {
      var list = {},
          response = ''
      // sort each command by category
      client.commands.forEach(cmd => {
        if(cmd.category !== 'dev') {
          if(!list[cmd.category]) list[cmd.category] = [];
          list[cmd.category].push(`${prefix}${cmd.name}${cmd.permissions[0] ? '*' : ''}`);
        }
      })
      // rewrite data in readable format
      for (var category in list) {
        response += '**__' + category + ' commands__**'
        response += '```dsconfig\n'
        response += list[category].join(", ")
        response += '```'
      }
      return response
    })();
    msg.channel.sendMsgEmbed(`**__HELP:__**\nTo see info about a specific command, use \`${prefix}help <command name>\`.\n Available commands:\n${commandList}* = Permissions required`)
  }
  return false
}

// returns true if a user has a role
Discord.GuildMember.prototype.hasRole = function(roleID) {
  if(this.roles.array().find(role=>role.id === roleID)) return true
  return false
}

// asynchronous TextChannel.startTyping()
Discord.TextChannel.prototype.startTypingAsync = function (channelResolvable) {
  return new Promise((resolve, reject) => { 
    try {
      channelResolvable.startTyping()
      resolve(true)
    } catch (err) {
      reject(err)
    }
  })
}

// 
Discord.TextChannel.prototype.sendMsgEmbed = function(description, title, embedColor) {
  this.send('', {
    embed: {
      color:  embedColor || 4513714,
      title,
      description
    }
  })
}

// update guilds list
client.on('guildCreate', function(guild) {
  client.addGuild(guild.id)
})

// handle commands
client.on('message', async function(msg) {
  var prefix = msg.prefix = (client.data[msg.guild.id] ? client.data[msg.guild.id].options : options).prefix
  if (msg.content.startsWith(`<@!${client.user.id}> `)) msg.content = msg.content.replace(`<@!${client.user.id}> `, prefix)
  if (msg.content.startsWith(`<@${client.user.id}> `)) msg.content = msg.content.replace(`<@${client.user.id}> `, prefix)
  if (!msg.content.startsWith(prefix) || msg.author.bot) return
  
  const message = msg.content.substring(prefix.length, msg.content.length).split(" ")
  const command = { 
    name: message[0],
    args: message.splice(1)
  }
  const cmd = client.commands.find(cmd => cmd.name === command.name) || client.commands.find(cmd => cmd.aliases.includes(command.name))
  var initialData = client.data

  // provide help
  if(command.name === 'help') {
    client.help(msg, command);
  }
  
  if(cmd) {
    // test for permissions
    if(cmd.permissions && msg.author.id !== process.env.OWNER_ID) {
      if(!msg.member.hasPermission(cmd.permissions) || cmd.permissions.includes('GOD')) {
        msg.channel.sendMsgEmbed('Sorry, you don\'t have the necessary permissions for this command.')
        return
      }
    }

    // start typing if message requires load time
    if(cmd.loader) {
      await msg.channel.startTypingAsync(msg.channel)
    }
    //try running command
    if(cmd.args && command.args.join('') === '') {
        msg.channel.sendMsgEmbed(`Incorrect usage of this command. Usage: \`${msg.prefix}${cmd.usage}\`.`)
    } else {
      await new Promise((resolve, reject) => {
        try {
          cmd.run(msg, command.args)
        } catch (err) {
          reject(err)
        }
        resolve(cmd)
      })
      .catch((err) => {
        console.error(err)
        msg.channel.sendMsgEmbed('There was an error performing this command.')
      })
      .then(()=>{
        client.writeData(client.data)
        .catch((err) => {
          console.error(err)
          msg.channel.sendMsgEmbed('There was an error performing this command.')
        })
        .then(() => msg.channel.stopTyping(true))
      })
    }
    return
  }
})

// update roles list on role delete
client.on('roleDelete', (oldRole, role) => {
  const roleList = client.data[role.guild.id].roles
  const matchingRoleFilter = r => r.id == role.id
  if(roleList.find(matchingRoleFilter)) {
    roleList.splice(roleList.findIndex(matchingRoleFilter),1)
  }
})

// update roles list on role update
client.on('roleUpdate', (oldRole, role) => {
  const roleList = client.data[role.guild.id].roles
  const matchingRoleFilter = r => r.id == role.id
  if(roleList.find(matchingRoleFilter)) {
    // replace role
    roleList.splice(roleList.findIndex(matchingRoleFilter), 1, { name: role.name, id: role.id })
  }
})

// Handle all GET requests
app.get('/', function (request, response) {
    response.sendFile(__dirname + '/index.html');
})

// Listen on port 3000
app.listen(3000, function (error) {
  if (error) throw error
  console.log('Server is running on port 3000')
})

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);