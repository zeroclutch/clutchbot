module.exports = {
  name: 'iam',
  usage: 'iam <role>',
  aliases: [],
  description: 'Assigns a role to a user from the list of self-assignable roles',
  category: 'role',
  permissions: [],
  args: true,
  run: function(msg, args) {
    //see if user has role
    const roleName = args.join(" ")
    const roleID = msg.client.getRoleID(msg.channel.guild.id, roleName.toLowerCase());
    if(roleID) {
      if(msg.member.hasRole(roleID)) msg.channel.send('You already have this role!')
      //remove role
      else {
       msg.member.addRole(roleID).then(()=>{
         msg.channel.send('You now have the ' + roleName +  ' role!');
       })
       .catch(err => {
         console.error(err);
         msg.channel.send('Sorry, I couldn\'t add that role. Ask an Administrator to check my permissions.');
       });
      }
    } else {
      msg.channel.send(`${roleName} is not a self-assignable role.`)
    }
  }
}