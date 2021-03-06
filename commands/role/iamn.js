module.exports = {
  name: 'iamnot',
  usage: 'iamnot <role>',
  aliases: ['iamn'],
  description: 'Removes a role from a user from the list of self-assignable roles',
  category: 'role',
  permissions: [],
  args: true,
  run: function(msg, args) {
    //see if user has role
    const roleName = args.join(" ")
    const roleID = msg.client.getRoleID(msg.channel.guild.id, roleName.toLowerCase());
    if(roleID) {
      if(!msg.member.hasRole(roleID)) msg.channel.sendMsgEmbed('You don\'t have this role!');
      //remove role
      else {
       msg.member.removeRole(roleID).then(() => {
         msg.channel.sendMsgEmbed('You no longer have the ' + roleName +  ' role!');
       }).catch(err=>{
         msg.channel.sendMsgEmbed('Sorry, I couldn\'t remove that role. Ask an Administrator to check my permissions.');
       });
      }
    } else {
      msg.channel.sendMsgEmbed(`${roleName} is not a self-assignable role.`)
    }
  }
}