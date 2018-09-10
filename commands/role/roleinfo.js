module.exports = {
  name: 'roleinfo',
  usage: 'roleinfo <role>',
  aliases: ['rinf'],
  description: 'Provides info about the given role',
  category: 'role',
  permissions: [],
  args: true,
  run: function(msg, args) {
    //see if user has role
    const roleName = args.join(" ")
    const roleID = msg.client.getRoleID(msg.channel.guild.id, roleName.toLowerCase(), true);
    if(roleID) {
      const role = msg.channel.guild.roles.find(r=>roleID===r.id);
      const members = (function() {
        var response = []
        role.members.forEach(member=>{
          response.push(member.user.username + "#" + member.user.discriminator)
        });
        return response.join(", ");
      })();
      msg.channel.send(`Role: \`${role.name}\`\nMembers: \`\`\`${members}\`\`\``);
    } else {
      msg.channel.send("Role not found.")
    }
  }
}