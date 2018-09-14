const fs = require('fs');
module.exports = {
  name: 'addrole',
  usage: 'addrole <role>',
  aliases: ['asar'],
  description: 'Adds a role to the list of self-assignable roles',
  category: 'role',
  permissions: ["ADMINISTRATOR"],
  args: true,
  run: function(msg, args) {
    //fetch role
    const roleName = args.join(" ").toLowerCase()
    const roleID = (msg.channel.guild.roles.find(role => role.name.toLowerCase() === roleName) || {id: null}).id;
    var guildRoles = msg.client.data[msg.channel.guild.id].roles
    if(!msg.client.data[msg.channel.guild.id].roles) {
      msg.client.data[msg.channel.guild.id].roles = [];
    }
    
    if(guildRoles.find(role => role.id === roleID)) {
      msg.client.data[msg.channel.guild.id].roles.find(role => role.id === roleID).name = roleName;
      msg.channel.send('This role has already been added to the list of self-assignable roles.')
    } else {
      if(roleID) {
        msg.client.data[msg.channel.guild.id].roles.push({
          name: roleName.toLowerCase(),
          id: roleID
        })
        msg.channel.send(`${roleName} is now a self-assignable role.`)
      } else {
        msg.channel.send('Role not found.')
      }
    }
  }
}