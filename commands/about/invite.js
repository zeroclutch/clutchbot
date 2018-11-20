module.exports = {
    name: 'invite',
    usage: 'invite',
    aliases: [],
    description: 'Sends an invite link for the bot',
    category: 'about',
    permissions: [],
    args: false,
    run: function(msg, args) {
        msg.channel.sendMsgEmbed('Invite me to your servers using this link: <https://discordapp.com/oauth2/authorize?client_id=486759646674157568&scope=bot&permissions=8>')
    }
  }