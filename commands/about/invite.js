module.exports = {
    name: 'invite',
    usage: 'invite',
    aliases: [],
    description: 'Sends an invite link for the bot',
    category: 'about',
    permissions: [],
    args: false,
    run: function(msg, args) {
        msg.channel.send('Invite me to your servers using this link: <https://discordapp.com/oauth2/authorize?client_id=488501831404617740&scope=bot&permissions=8>')
    }
  }