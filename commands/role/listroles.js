module.exports = {
  name: 'listroles',
  usage: 'listroles',
  aliases: ['lsar'],
  description: 'Lists all self-assignable roles for the server',
  category: 'role',
  permissions: [],
  args: false,
  run: function(msg, args) {
    const roleList = (msg.client.data[msg.channel.guild.id] || {roles:[]}).roles
    var response = ''
    roleList.forEach(role => {
      response += '\n' + role.name
    })
    if(response) {
      msg.channel.send(`The self-assignable roles for this server are:`, {
        embed: {
          "color": 4513714,
          description: response
        }
      });
    } else {
      msg.channel.send(`This server has no self-assignable roles.`)
    }
  }
}