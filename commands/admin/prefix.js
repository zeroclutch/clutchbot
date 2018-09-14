const fs = require('fs');
module.exports = {
  name: 'prefix',
  usage: 'prefix <role>',
  aliases: [],
  description: 'View or change the prefix for this server',
  category: 'admin',
  permissions: ["MANAGE_SERVER"],
  args: false,
  run: function(msg, args) {
    const newPrefix = args.join(" ")
    var guildData = msg.client.data[msg.channel.guild.id]
    if(!guildData) msg.client.addGuild(msg.channel.guild.id)

    // update prefix
    if(newPrefix) {
      guildData.options.prefix = newPrefix
      msg.client.data[msg.channel.guild.id] = guildData
      msg.channel.send(`The prefix has been updated to \`${newPrefix}\``)
    // inform about current prefix
    } else {
      if(guildData.options && guildData.options.prefix) msg.channel.send(`The prefix for this server is \`${guildData.options.prefix}\``)
      else msg.channel.send(`The prefix for this server is \`${process.env.PREFIX}\``)
    }
  }
}