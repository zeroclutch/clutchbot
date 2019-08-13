const client = require('nekos.life');
const neko = new client();
module.exports = {
    name: 'weebify',
    usage: 'weebify <phrase>',
    aliases: [],
    description: 'Makes your text sound like it was written in a myanimelist chatroom',
    category: 'fun',
    permissions: [],
    args: true,
    run: async function(msg, args) {
        var text = await neko.getSFWChat({text: args.join(' '), owo: "true"})
        msg.channel.sendMsgEmbed(text.response)
    }
  }