module.exports = {
    name: 'giverole',
    usage: 'giverole <user> <role>',
    aliases: ['gr'],
    description: 'Assigns a role to a user',
    category: 'role',
    permissions: ['MANAGE_ROLES'],
    args: true,
    run: function(msg, args) {
      const userID = args[0].replace(/\D/g, '')
      const user = msg.guild.members.find(user => user.id === userID)
      const roleName = args.slice(1).join(" ")
      const roleID = msg.client.getRoleID(msg.channel.guild.id, roleName.toLowerCase(), true);

      // check for correct usage
      if(userID && roleName) {
        // see if user has role
        if(user.hasRole(roleID)) {
            msg.channel.send('User already has this role.')
            return
        }

        // see if message author has permissions to assign this role
        if(msg.member.highestRole.comparePositionTo(msg.guild.roles.find(role => role.id === roleID)) <= 0) {
            msg.channel.send('Sorry, you don\'t have the permissions to add this role.')
            return
        }

        // add role
        user.addRole(roleID).then(()=>{
           msg.channel.send(`${user.displayName} now has the "${roleName}" role.`);
         })
         .catch(err => {
           console.error(err);
           msg.channel.send('Sorry, I couldn\'t add that role. Ask an Administrator to check my permissions.');
         });
      } else {
        msg.channel.send(`Incorrect usage of this command. Use \`${msg.prefix}help giverole\``)
      }
    }
  }