module.exports = {
    name: 'takerole',
    usage: 'takerole <user> <role>',
    aliases: ['tr'],
    description: 'Removes a role from a user',
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
        if(!user.hasRole(roleID)) {
            msg.channel.sendMsgEmbed('User does not have this role.')
            return
        }

        // see if message author has permissions to assign this role
        if(msg.member.highestRole.comparePositionTo(msg.guild.roles.find(role => role.id === roleID)) <= 0) {
            msg.channel.sendMsgEmbed('Sorry, you don\'t have the permissions to remove this role.')
            return
        }

        // add role
        user.removeRole(roleID).then(()=>{
           msg.channel.sendMsgEmbed(`${user.displayName} no longer has the "${roleName}" role.`);
         })
         .catch(err => {
           console.error(err);
           msg.channel.sendMsgEmbed('Sorry, I couldn\'t remove that role. Ask an Administrator to check my permissions.');
         });
      } else {
        msg.channel.sendMsgEmbed(`Incorrect usage of this command. Use \`${msg.prefix}help takerole\``)
      }
    }
  }