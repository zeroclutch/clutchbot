require('dotenv').load();
const Discord = require("discord.js");
const client = new Discord.Client();
const app = require("express")();
const http = require("http");
const fs = require('fs');
const options = require('./config/options')

// initialization
client.login(options.token); 

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`); 
  client.user.setActivity(options.activity.game, { type: options.activity.type }) 
  .catch(console.error);
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
      const command = require(`./commands/${commandFolder}/${file}`);
      client.commands.set(command.name, command);
    }
  }
}

client.data = {}

// get role data
fs.readFile('data.json', (err, data) => {
  if (err) throw err;
  client.data = JSON.parse(data);
  console.log(JSON.stringify(client.data))
});

client.getRoleID = function(server, role, global) {
  // find role id for server
  if(global) return (client.guilds.find(guild=>guild.id===server).roles.find(r=>r.name.toLowerCase() === role) || client.guilds.find(guild=>guild.id===server).roles.find(r=>r.id === role) || { id: null }).id;
  // find role id from roles list
  return (client.data[server].roles.find(r=>r.name.toLowerCase() === role) || client.data[server].roles.find(r=>r.id === role) || { id: null }).id;
}


// provide help
client.help = function(msg, command) {
  // find command in question
  const helpCmd = client.commands.find(cmd => cmd.name === command.args.join(" ")) ||  client.commands.find(cmd => cmd.aliases.includes(command.args.join(" ")))
  // find help for a specific command
  if(helpCmd && helpCmd.category !== 'dev') {
    msg.channel.send(`**__HELP:__**
                    \nCommand: \`${options.prefix}${helpCmd.name}\`
                    \nDescription: ${helpCmd.description}
                    \nUsage: \`${options.prefix}${helpCmd.usage}\`
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
          list[cmd.category].push(`${options.prefix}${cmd.name}${cmd.permissions[0] ? '*' : ''}`);
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
    msg.channel.send(`**__HELP:__**\nTo see info about a specific command, use \`${options.prefix}help <command name>\`.\n Available commands:\n${commandList}* = Permissions required`)
  }
  return false
}

Discord.GuildMember.prototype.hasRole = function(roleID) {
  if(this.roles.array().find(role=>role.id === roleID)) return true
  return false
}

client.on('message', function(msg) {
  if (!msg.content.startsWith(options.prefix) || msg.author.bot) return false
  
  const message = msg.content.substring(options.prefix.length, msg.content.length).split(" ")
  const command = { 
    name: message[0],
    args: message.splice(1)
  }
  const cmd = client.commands.find(cmd => cmd.name === command.name) || client.commands.find(cmd => cmd.aliases.includes(command.name));
  
  // provide help
  if(command.name === 'help') {
    client.help(msg, command);
  }
  
  if(cmd) {
    // test for permissions
    if(cmd.permissions) {
      if(!msg.member.hasPermission(cmd.permissions) && msg.author.id !== '210928865097416707') {
        msg.channel.send('Sorry, you don\'t have the necessary permissions for this command.')
        return false
      }
    }
    
    //try running command
    if(cmd.args) {
      if(command.args.join('') === '') {
        msg.channel.send(`Incorrect usage of this command. Usage: \`${options.prefix}${cmd.usage}\`.`)
      } else {
        try {
          cmd.run(msg, command.args)
        } catch (err) {
          console.error(err)
          msg.channel.send('There was an error performing this command.')
          return
        }
      }
      return false
    } else cmd.run(msg, command.args)
  }
});

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