const fs = require('fs');
module.exports = {
  name: 'removerole',
  usage: 'removerole <role>',
  aliases: ['rsar'],
  description: 'Removes a role from the list of self-assignable roles',
  category: 'role',
  permissions: ["ADMINISTRATOR"],
  args: true,
  run: function(msg, args) {
    //fetch role
    const roleInput = args.join(" ")
    const roleName = roleInput.toLowerCase()
    const roleID = (msg.channel.guild.roles.find(role => role.name.toLowerCase() === roleName) || {id: null}).id;
    const guildRoles = msg.client.data[msg.channel.guild.id].roles
    if(!guildRoles) {
      msg.client.data[msg.channel.guild.id].roles = []
    }
    
    if(roleID) {
      if(guildRoles.find(role => role.id === roleID)) {
          //remove role from list
          for(var i = 0; i < guildRoles.length; i++) {
              if(guildRoles[i].id == roleID) {
                  msg.client.data[msg.channel.guild.id].roles.splice(i, 1);
                  break;
              }
          }
          fs.writeFile('data.json', JSON.stringify(msg.client.data), (err) => {
            if (err) {
              console.error(err);
              msg.channel.send(`There was an error removing this role from the list.`)
            } else {
              msg.channel.send(`${roleInput} is no longer a self-assignable role.`)
            }
          });
      } else {
        msg.channel.send('This role is not on the list of self-assignable roles.')
      }
    } else {
      msg.channel.send('Role not found.')
    }
  }
}